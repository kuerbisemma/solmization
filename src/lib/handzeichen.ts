// Bindet die Handzeichen-SVGs inline ein und setzt sie in eine Körpersilhouette auf die richtige Höhe.

import { MAX_HOEHE, silbe, type SilbenId, type ZeichenId } from './theorie';

const roh = import.meta.glob('../../assets/handzeichen/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Innerer Inhalt je Zeichen, ohne <svg>-Hülle, Titel und Beschreibung (die Barrierefreiheit regelt die Komponente). */
const INHALT = new Map<ZeichenId, string>(
  Object.entries(roh).map(([pfad, svg]) => {
    const id = pfad.match(/([a-z]+)\.svg$/)![1] as ZeichenId;
    const innen = svg
      .replace(/^[\s\S]*?<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '')
      .replace(/<title[\s\S]*?<\/title>|<desc[\s\S]*?<\/desc>/g, '');
    return [id, innen];
  }),
);

/** Beschreibung je Zeichen (Alt-Text). */
export const ZEICHEN_BESCHREIBUNG: Record<ZeichenId, string> = {
  do: 'geschlossene Faust',
  re: 'flache Hand, schräg nach oben geneigt',
  mi: 'flache Hand, waagerecht',
  fa: 'Faust, Daumen zeigt nach unten',
  so: 'senkrechte Hand, Handrücken zu sehen, Daumen oben',
  la: 'Hand hängt locker herab',
  ti: 'Faust, Zeigefinger zeigt schräg nach oben',
};

const HOEHENNAMEN = ['unter der Hüfte', 'Hüfthöhe', 'knapp unter dem Bauch', 'Bauchhöhe', 'über dem Bauch', 'Brusthöhe', 'obere Brust', 'Schulterhöhe', 'Kinnhöhe', 'Augenhöhe', 'Stirnhöhe'];

export function altText(id: SilbenId): string {
  const s = silbe(id);
  return `Handzeichen: ${ZEICHEN_BESCHREIBUNG[s.zeichen]}, auf ${HOEHENNAMEN[s.hoehe]}`;
}

/** Nur das Zeichen, ohne Höhenangabe. */
export function zeichenSvg(zeichen: ZeichenId): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">${INHALT.get(zeichen)}</svg>`;
}

/**
 * Zeichen vor einer schematischen Körpersilhouette, auf der Höhe der Silbe.
 * Rechte Hand aus Sicht des Gegenübers – sie erscheint links vom Körper.
 */
export function figurSvg(id: SilbenId): string {
  const s = silbe(id);
  const y = 152 - (s.hoehe * 136) / MAX_HOEHE;
  const groesse = 84;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 166" aria-hidden="true" focusable="false">
  <g class="hz-silhouette">
    <circle cx="98" cy="26" r="15"/>
    <path d="M 91 42 L 91 49 Q 76 51 71 62 L 68 166 M 105 42 L 105 49 Q 120 51 125 62 L 128 166"/>
  </g>
  <line class="hz-marke" x1="4" x2="136" y1="${y}" y2="${y}"/>
  <svg x="${40 - groesse / 2}" y="${y - groesse / 2}" width="${groesse}" height="${groesse}" viewBox="0 0 200 200">${INHALT.get(s.zeichen)}</svg>
</svg>`;
}
