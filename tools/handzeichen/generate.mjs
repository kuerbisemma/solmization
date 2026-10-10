// Erzeugt die Handzeichen-SVGs (Kodály/Curwen) und eine Übersichtsseite zur fachlichen Abnahme.
// Darstellung: rechte Hand aus Sicht des Gegenübers, einheitlicher Stil, viewBox 200×200.
// Aufruf: node tools/handzeichen/generate.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'assets', 'handzeichen');

// Klassen mit Präfix und CSS-Variablen, damit die SVGs auch inline in der App themenfähig sind.
const STYLE = `
  <style>
    .hz-f { fill: var(--hz-fuellung, #F4F1ED); stroke: var(--hz-linie, #275D6F); stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
    .hz-l { fill: none; stroke: var(--hz-linie, #275D6F); stroke-width: 3; stroke-linecap: round; }
    @media (prefers-color-scheme: dark) {
      .hz-f { fill: var(--hz-fuellung, #1A2630); stroke: var(--hz-linie, #6FA8BE); }
      .hz-l { stroke: var(--hz-linie, #6FA8BE); }
    }
  </style>`;

// Unterarm als abgerundetes Rechteck, gedreht um den Ansatz am Handgelenk.
const forearm = (x, y, angle, length = 160, width = 32) =>
  `<g transform="rotate(${angle} ${x} ${y})"><rect class="hz-f" x="${x - length}" y="${y - width / 2}" width="${length + 8}" height="${width}" rx="14"/></g>`;

// Flache Hand im Profil, Finger geschlossen und nach rechts, Handrücken oben, Handgelenk bei (0,0).
const flatHandProfile = `
    <path class="hz-f" d="M -4 -17 C 20 -21 40 -23 60 -20 L 104 -13 Q 118 -8 106 1 L 64 7 C 46 11 30 19 12 19 L -4 17 Z"/>
    <path class="hz-l" d="M 60 -20 Q 63 -7 64 7"/>
    <path class="hz-l" d="M 66 -6 L 100 -5"/>
    <path class="hz-l" d="M 10 8 C 26 6 42 3 56 -2"/>`;

// Faust (Seitenansicht): Fingerglieder vorne, Daumen quer darüber.
const fist = (thumb = 'front') => `
    <rect class="hz-f" x="-34" y="-32" width="68" height="64" rx="18"/>
    <path class="hz-l" d="M 16 -30 Q 6 0 16 30"/>
    <path class="hz-l" d="M 17 -14 L 33 -14 M 17 1 L 34 1 M 17 16 L 33 16"/>
    ${thumb === 'front' ? '<rect class="hz-f" x="-26" y="-36" width="50" height="17" rx="8.5" transform="rotate(8 0 -28)"/>' : ''}`;

const signs = [
  {
    id: 'do',
    titel: 'do',
    beschreibung: 'do: geschlossene Faust, Daumen liegt quer über den Fingern.',
    body: `
  ${forearm(100, 128, -90)}
  <g transform="translate(100 100)">${fist()}</g>`,
  },
  {
    id: 're',
    titel: 're',
    beschreibung: 're: flache Hand, schräg nach oben geneigt, Handfläche zeigt nach unten.',
    body: `
  ${forearm(70, 120, 0)}
  <g transform="translate(70 120) rotate(-32)">${flatHandProfile}</g>`,
  },
  {
    id: 'mi',
    titel: 'mi',
    beschreibung: 'mi: flache Hand waagerecht, Handfläche zeigt nach unten.',
    body: `
  ${forearm(70, 110, 0)}
  <g transform="translate(70 110)">${flatHandProfile}</g>`,
  },
  {
    id: 'fa',
    titel: 'fa',
    beschreibung: 'fa: Faust, der Daumen zeigt nach unten.',
    body: `
  ${forearm(76, 92, 0)}
  <g transform="translate(108 92)">
    <rect class="hz-f" x="10" y="14" width="18" height="62" rx="9"/>
    ${fist('none')}
  </g>`,
  },
  {
    id: 'so',
    titel: 'so',
    beschreibung: 'so: flache Hand senkrecht, Handfläche zum Körper; zu sehen ist der Handrücken, die Finger zeigen zur Seite, der Daumen nach oben.',
    body: `
  ${forearm(78, 140, -55)}
  <g transform="translate(78 110)">
    <rect class="hz-f" x="20" y="-34" width="80" height="16" rx="8"/>
    <rect class="hz-f" x="20" y="-18" width="86" height="16" rx="8"/>
    <rect class="hz-f" x="20" y="-2" width="80" height="16" rx="8"/>
    <rect class="hz-f" x="20" y="14" width="66" height="15" rx="7.5"/>
    <rect class="hz-f" x="-14" y="-38" width="54" height="72" rx="16"/>
    <rect class="hz-f" x="-4" y="-58" width="17" height="44" rx="8.5" transform="rotate(28 4 -36)"/>
  </g>`,
  },
  {
    id: 'la',
    titel: 'la',
    beschreibung: 'la: Hand hängt locker vom Handgelenk herab, Handfläche zeigt nach unten, Finger zeigen zum Boden.',
    body: `
  ${forearm(78, 70, 0)}
  <g transform="translate(78 70) rotate(62)">${flatHandProfile}</g>`,
  },
  {
    id: 'ti',
    titel: 'ti',
    beschreibung: 'ti: Faust, der Zeigefinger zeigt schräg nach oben.',
    body: `
  ${forearm(92, 150, -90)}
  <g transform="translate(92 122)">
    <rect class="hz-f" x="-2" y="-78" width="18" height="62" rx="9" transform="rotate(22 7 -22)"/>
    ${fist()}
  </g>`,
  },
];

// Höhenstufen relativ zur Körpersilhouette (0 = Bauch/do, größer = höher).
const tafel = [
  { silbe: "do'", zeichen: 'do', hoehe: 8 },
  { silbe: 'ti', zeichen: 'ti', hoehe: 7 },
  { silbe: 'la', zeichen: 'la', hoehe: 6 },
  { silbe: 'so', zeichen: 'so', hoehe: 5 },
  { silbe: 'fa', zeichen: 'fa', hoehe: 4 },
  { silbe: 'mi', zeichen: 'mi', hoehe: 3 },
  { silbe: 're', zeichen: 're', hoehe: 2 },
  { silbe: 'do', zeichen: 'do', hoehe: 1 },
  { silbe: 'ti,', zeichen: 'ti', hoehe: 0 },
  { silbe: 'la,', zeichen: 'la', hoehe: -1 },
  { silbe: 'so,', zeichen: 'so', hoehe: -2 },
];

const svg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-labelledby="t d">
  <title id="t">Handzeichen ${s.titel}</title>
  <desc id="d">${s.beschreibung}</desc>${STYLE}${s.body}
</svg>
`;

mkdirSync(outDir, { recursive: true });
for (const s of signs) writeFileSync(join(outDir, `${s.id}.svg`), svg(s));

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Handzeichen-Abnahme</title>
<style>
  :root { --bg: #F4F1ED; --fg: #1A2630; --accent: #275D6F; --card: #fff; }
  @media (prefers-color-scheme: dark) { :root { --bg: #0D1A22; --fg: #F4F1ED; --accent: #6FA8BE; --card: #1A2630; } }
  body { margin: 0; padding: 16px; background: var(--bg); color: var(--fg); font-family: 'Segoe UI', Arial, sans-serif; }
  h1, h2 { color: var(--accent); font-family: 'Roboto Slab', Georgia, serif; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
  figure { margin: 0; background: var(--card); border-radius: 12px; padding: 12px; }
  figure img { width: 100%; display: block; }
  figcaption { font-size: 0.9rem; }
  figcaption b { font-size: 1.3rem; color: var(--accent); display: block; }
  .leiter { list-style: none; padding: 0; max-width: 420px; }
  .leiter li { display: flex; align-items: center; gap: 12px; }
  .leiter img { width: 56px; height: 56px; }
  .leiter b { width: 3ch; color: var(--accent); font-size: 1.2rem; }
  .leiter .bar { height: 6px; background: var(--accent); border-radius: 3px; opacity: .5; }
</style>
</head>
<body>
<h1>Handzeichen – fachliche Abnahme</h1>
<p>Rechte Hand aus Sicht des Gegenübers. Bitte jedes Zeichen auf Form und Ausrichtung prüfen.</p>
<div class="grid">
${signs.map((s) => `  <figure><img src="${s.id}.svg" alt=""><figcaption><b>${s.titel}</b>${s.beschreibung.replace(/^[^:]+: /, '')}</figcaption></figure>`).join('\n')}
</div>
<h2>Höhenleiter</h2>
<p>Die Höhe der Hand gehört zum Zeichen (do etwa Bauchhöhe, do' etwa Stirnhöhe; tiefe Oktave unterhalb des Bauchs).</p>
<ul class="leiter">
${tafel.map((t) => `  <li><b>${t.silbe}</b><img src="${t.zeichen}.svg" alt="Handzeichen ${t.silbe}"><span class="bar" style="width:${(t.hoehe + 3) * 22}px"></span></li>`).join('\n')}
</ul>
</body>
</html>
`;
writeFileSync(join(outDir, 'uebersicht.html'), html);

console.log(`${signs.length} SVGs und uebersicht.html nach ${outDir} geschrieben.`);
