# solmization

Übungsseite für relative Solmisation (Tonika-Do) und Kodály-Handzeichen: Handzeichen und Noten vom Blatt singen, bekannte Lieder auf Silben umsingen – ohne Login, ohne Tracking, offlinefähig.
Live: https://solmization.kalikoer.com · ein Projekt von [kalikoer](https://kalikoer.com)

## Entwicklung

```sh
npm install
npm run dev        # Entwicklungsserver
npm test           # Musiklogik-Tests (Vitest)
npm run check      # Typprüfung (svelte-check)
npm run build      # statischer Build nach dist/ inkl. Service Worker
npm run preview    # Build lokal ansehen
npm run deploy     # bauen und auf solmization.kalikoer.com einspielen (SSH-Zugang nötig)
```

## Aufbau

| Pfad | Inhalt |
|---|---|
| `docs/PRD.md` | Produktanforderungen |
| `docs/server.md` | Anforderungen, Einrichtung und Deployment |
| `deploy/` | nginx-Konfiguration und Deploy-Skript |
| `src/lib/theorie.ts` | Silben, Stufen, Tonarten, Kadenzen |
| `src/lib/aufgaben.ts` | singbare Folgen bzw. Melodien |
| `src/lib/noten.ts` | Tonarten, Vorzeichen, Schreibweise und Position der Noten |
| `src/lib/lieder.ts` | gemeinfreie Lieder (Silben mit Rhythmus) für „Lieder singen“, Abnahmeliste in `docs/lieder.md` |
| `src/lib/notensatz.ts` | Notenabstände, Takte, Zeilenumbruch und Balken |
| `src/lib/statistik.ts` | Bewertungen mit Datum, Quoten, Wochenverlauf |
| `src/lib/klang.ts` | Tonausgabe (Web Audio, Klavier-Samples) |
| `src/lib/texte.ts` | alle Oberflächentexte |
| `src/lib/betreiber.ts` | Angaben für Impressum und Datenschutz |
| `src/pages/` | Seiten der App |
| `assets/handzeichen/` | Handzeichen-SVGs, `uebersicht.html` zur fachlichen Abnahme |
| `tools/handzeichen/generate.mjs` | Generator der Handzeichen (`npm run handzeichen`) |
| `tools/notenschrift/subset.py` | erzeugt die Notenschrift „Solmi Noten“ als Auszug aus Bravura (fontTools) |

## Lizenzen

Code: MIT · Handzeichen: CC BY 4.0 · Klavier: Salamander Grand Piano V3 (Alexander Holm), CC BY 3.0 · Schriften und Notenschrift (Auszug aus Bravura, umbenannt): SIL OFL 1.1
