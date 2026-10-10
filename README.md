# solmization

Übungsseite für relative Solmisation (Tonika-Do) und Kodály-Handzeichen – ohne Login, ohne Tracking, offlinefähig.
Live: https://solmization.kalikoer.com · ein Projekt von [kalikoer](https://kalikoer.com)

## Entwicklung

```sh
npm install
npm run dev        # Entwicklungsserver
npm test           # Musiklogik-Tests (Vitest)
npm run check      # Typprüfung (svelte-check)
npm run build      # statischer Build nach dist/ inkl. Service Worker
npm run preview    # Build lokal ansehen
```

## Aufbau

| Pfad | Inhalt |
|---|---|
| `docs/PRD.md` | Produktanforderungen |
| `docs/server.md` | Anforderungen und Beispielkonfiguration für den Webserver |
| `src/lib/theorie.ts` | Silben, Stufen, Tonarten, Kadenzen |
| `src/lib/aufgaben.ts` | Übungsrunden und singbare Zeichenfolgen |
| `src/lib/klang.ts` | Tonausgabe (Web Audio, Klavier-Samples) |
| `src/lib/texte.ts` | alle Oberflächentexte |
| `src/lib/betreiber.ts` | Angaben für Impressum und Datenschutz |
| `src/pages/` | Seiten der App |
| `assets/handzeichen/` | Handzeichen-SVGs, `uebersicht.html` zur fachlichen Abnahme |
| `tools/handzeichen/generate.mjs` | Generator der Handzeichen (`npm run handzeichen`) |

## Lizenzen

Code: MIT · Handzeichen: CC BY 4.0 · Klavier: Salamander Grand Piano V3 (Alexander Holm), CC BY 3.0 · Schriften: SIL OFL 1.1
