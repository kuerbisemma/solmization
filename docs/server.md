# Betrieb auf dem eigenen VPS

`npm run build` erzeugt das Verzeichnis `dist/` mit rein statischen Dateien. Es braucht keine Serverlogik, nur einen Webserver, der die folgenden Anforderungen aus dem PRD (N-10 bis N-13) erfüllt.

## Anforderungen

| Nr. | Anforderung | Warum |
|---|---|---|
| N-10 | HTTPS | Service Worker (Offline-Fähigkeit) funktioniert nur über HTTPS |
| N-11 | keine IP-Adressen in Logs | Datenschutzerklärung verspricht das |
| N-12 | `index.html`, `sw.js`, `manifest.webmanifest`, `registerSW.js` **nicht** cachen; `assets/*` (Hash im Namen) langfristig cachen | sonst bleiben Nutzer:innen auf alten Versionen hängen |
| — | `mp3`, `woff2`, `png`, `svg` außerhalb von `assets/` moderat cachen (z. B. 1 Tag) | haben keinen Hash im Namen |

Routing läuft über den URL-Hash (`#/tafel`), es ist also **kein** SPA-Fallback nötig.

## Beispiel: Caddy

```caddyfile
solmization.kalikoer.com {
	root * /var/www/solmization
	file_server
	encode zstd gzip

	# Logs ohne IP-Adressen
	log {
		output file /var/log/caddy/solmization.log
		format filter {
			wrap json
			fields {
				request>remote_ip delete
				request>client_ip delete
				request>remote_port delete
				request>headers>X-Forwarded-For delete
			}
		}
	}

	@nocache path / /index.html /sw.js /registerSW.js /manifest.webmanifest
	header @nocache Cache-Control "no-cache"

	@hashed path /assets/*
	header @hashed Cache-Control "public, max-age=31536000, immutable"

	@static path /samples/* /fonts/* /icons/* /favicon.svg
	header @static Cache-Control "public, max-age=86400"
}
```

Caddy holt das Let's-Encrypt-Zertifikat automatisch.

## Beispiel: nginx

```nginx
log_format ohne_ip '[$time_local] "$request" $status $body_bytes_sent';

server {
    listen 443 ssl http2;
    server_name solmization.kalikoer.com;
    # ssl_certificate … (z. B. per certbot)

    root /var/www/solmization;
    access_log /var/log/nginx/solmization.log ohne_ip;
    error_log  /var/log/nginx/solmization.error.log crit;  # error_log enthält sonst Client-IPs

    gzip on;
    gzip_types text/css application/javascript application/manifest+json image/svg+xml;

    location = /index.html            { add_header Cache-Control "no-cache"; }
    location = /sw.js                 { add_header Cache-Control "no-cache"; }
    location = /registerSW.js         { add_header Cache-Control "no-cache"; }
    location = /manifest.webmanifest  { add_header Cache-Control "no-cache"; types { application/manifest+json webmanifest; } }
    location /assets/                 { add_header Cache-Control "public, max-age=31536000, immutable"; }
    location ~ ^/(samples|fonts|icons)/ { add_header Cache-Control "public, max-age=86400"; }
    location = / { add_header Cache-Control "no-cache"; try_files /index.html =404; }
}

server {
    listen 80;
    server_name solmization.kalikoer.com;
    access_log off;
    return 301 https://$host$request_uri;
}
```

## Aktuelle Einrichtung (solmization.kalikoer.com)

| | |
|---|---|
| Server | Ubuntu 24.04, nginx 1.24 (gemeinsam mit den anderen kalikoer-Diensten) |
| Webroot | `/var/www/solmization` |
| nginx | `/etc/nginx/sites-available/solmization.kalikoer.com.conf` (Vorlage: `deploy/solmization.kalikoer.com.conf`, HTTPS-Teil von certbot ergänzt) |
| Logs | `/var/log/nginx/solmization.access.log` (ohne IP), `/var/log/nginx/solmization.error.log` (nur `crit`) |
| TLS | Let's Encrypt über `certbot --nginx`, Erneuerung per `certbot.timer` |

Hinweis: Ubuntus `mime.types` kennt `.webmanifest` nicht – die Konfiguration setzt den Typ für `/manifest.webmanifest` selbst.

## Deployment

```sh
npm run deploy
```

Das Skript `deploy/deploy.sh` baut die App, überträgt `dist/` per `tar` über SSH nach `/var/www/solmization.neu` und tauscht das Verzeichnis dann in einem Schritt aus. Ziel ist standardmäßig `root@solmization.kalikoer.com`, überschreibbar mit `SOLMIZATION_HOST`. Nutzer:innen bekommen danach den Hinweis „Neue Version verfügbar“.
