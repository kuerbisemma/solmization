// Fachliches Datenmodell: Silben, Handzeichen, Stufen, Tonarten und Kadenzen (Tonika-Do).
// Tonhöhen werden als MIDI-Nummern gerechnet (60 = c').

export type Modus = 'dur' | 'moll';
export type Stimmlage = 'hoch' | 'tief';
export type ZeichenId = 'do' | 're' | 'mi' | 'fa' | 'so' | 'la' | 'ti';
export type SilbenId = 'so,' | 'la,' | 'ti,' | 'do' | 're' | 'mi' | 'fa' | 'so' | 'la' | 'ti' | "do'";

export interface Silbe {
  id: SilbenId;
  zeichen: ZeichenId;
  /** Abstand in Halbtönen zu „do“ */
  halbton: number;
  /** Höhenstufe des Handzeichens (0 = tiefstes so,) */
  hoehe: number;
  /** Ausgeschriebene Form für Screenreader */
  gesprochen: string;
}

/** Alle Silben des Tonvorrats, von tief nach hoch. */
export const SILBEN: readonly Silbe[] = [
  { id: 'so,', zeichen: 'so', halbton: -5, hoehe: 0, gesprochen: 'tiefes so' },
  { id: 'la,', zeichen: 'la', halbton: -3, hoehe: 1, gesprochen: 'tiefes la' },
  { id: 'ti,', zeichen: 'ti', halbton: -1, hoehe: 2, gesprochen: 'tiefes ti' },
  { id: 'do', zeichen: 'do', halbton: 0, hoehe: 3, gesprochen: 'do' },
  { id: 're', zeichen: 're', halbton: 2, hoehe: 4, gesprochen: 're' },
  { id: 'mi', zeichen: 'mi', halbton: 4, hoehe: 5, gesprochen: 'mi' },
  { id: 'fa', zeichen: 'fa', halbton: 5, hoehe: 6, gesprochen: 'fa' },
  { id: 'so', zeichen: 'so', halbton: 7, hoehe: 7, gesprochen: 'so' },
  { id: 'la', zeichen: 'la', halbton: 9, hoehe: 8, gesprochen: 'la' },
  { id: 'ti', zeichen: 'ti', halbton: 11, hoehe: 9, gesprochen: 'ti' },
  { id: "do'", zeichen: 'do', halbton: 12, hoehe: 10, gesprochen: 'hohes do' },
];

export const MAX_HOEHE = SILBEN.length - 1;

const SILBE_NACH_ID = new Map(SILBEN.map((s) => [s.id, s]));

export function silbe(id: SilbenId): Silbe {
  const s = SILBE_NACH_ID.get(id);
  if (!s) throw new Error(`Unbekannte Silbe: ${id}`);
  return s;
}

/** Sortiert Silben von tief nach hoch und entfernt Duplikate. */
export function sortiert(ids: readonly SilbenId[]): SilbenId[] {
  return [...new Set(ids)].sort((a, b) => silbe(a).hoehe - silbe(b).hoehe);
}

export interface Stufe {
  nr: number;
  titel: string;
  silben: SilbenId[];
  modus: Modus;
  /** Länge der Zeichenfolgen beim Singen */
  folgenLaenge: number;
}

export const STUFEN: readonly Stufe[] = [
  { nr: 1, titel: 'so – mi', silben: ['mi', 'so'], modus: 'dur', folgenLaenge: 3 },
  { nr: 2, titel: 'so – mi – la', silben: ['mi', 'so', 'la'], modus: 'dur', folgenLaenge: 3 },
  { nr: 3, titel: 'do – mi – so – la', silben: ['do', 'mi', 'so', 'la'], modus: 'dur', folgenLaenge: 4 },
  { nr: 4, titel: 'Pentatonik', silben: ['do', 're', 'mi', 'so', 'la'], modus: 'dur', folgenLaenge: 4 },
  { nr: 5, titel: 'Pentatonik + tiefes la und so', silben: ['so,', 'la,', 'do', 're', 'mi', 'so', 'la'], modus: 'dur', folgenLaenge: 5 },
  { nr: 6, titel: "+ hohes do'", silben: ['so,', 'la,', 'do', 're', 'mi', 'so', 'la', "do'"], modus: 'dur', folgenLaenge: 5 },
  { nr: 7, titel: '+ fa', silben: ['so,', 'la,', 'do', 're', 'mi', 'fa', 'so', 'la', "do'"], modus: 'dur', folgenLaenge: 6 },
  { nr: 8, titel: 'Dur-Tonleiter vollständig', silben: ['so,', 'la,', 'ti,', 'do', 're', 'mi', 'fa', 'so', 'la', 'ti', "do'"], modus: 'dur', folgenLaenge: 6 },
  { nr: 9, titel: 'la-Pentatonik (Moll)', silben: ['la,', 'do', 're', 'mi', 'so', 'la'], modus: 'moll', folgenLaenge: 5 },
  { nr: 10, titel: 'Natürliches Moll vollständig', silben: ['la,', 'ti,', 'do', 're', 'mi', 'fa', 'so', 'la'], modus: 'moll', folgenLaenge: 6 },
];

/** Folgenlänge für eine freie Auswahl: wächst mit der Zahl der Silben (3–6). */
export function folgenLaengeFuer(anzahlSilben: number): number {
  return Math.min(6, Math.max(3, anzahlSilben - 1));
}

/** Silben des Tonika-Dreiklangs – Anfangs- und Schlusstöne singbarer Folgen. */
export function dreiklangsSilben(modus: Modus): SilbenId[] {
  return modus === 'dur' ? ['so,', 'do', 'mi', 'so', "do'"] : ['la,', 'do', 'mi', 'la', "do'"];
}

/** Singbarer Tonraum je Stimmlage als MIDI-Grenzen (inklusive). */
export const TONRAUM: Record<Stimmlage, { tief: number; hoch: number }> = {
  hoch: { tief: 57, hoch: 77 }, // A3–F5
  tief: { tief: 45, hoch: 65 }, // A2–F4
};

export type Zufall = () => number;

/**
 * Wählt „do“ (als MIDI-Nummer) zufällig so, dass alle Silben der Auswahl im Tonraum der Stimmlage liegen.
 */
export function waehleDo(ids: readonly SilbenId[], stimmlage: Stimmlage, zufall: Zufall = Math.random): number {
  const halbtoene = ids.map((id) => silbe(id).halbton);
  const { tief, hoch } = TONRAUM[stimmlage];
  const min = tief - Math.min(...halbtoene);
  const max = hoch - Math.max(...halbtoene);
  if (max < min) throw new Error('Auswahl passt nicht in den Tonraum');
  return min + Math.floor(zufall() * (max - min + 1));
}

export function midiVon(doMidi: number, id: SilbenId): number {
  return doMidi + silbe(id).halbton;
}

/**
 * Kadenz zur Tonika-Orientierung: I–IV–V–I in Dur, i–iv–V–i in Moll (mit Leitton).
 * Liefert vier Akkorde als MIDI-Nummern (Bass + Dreiklang), im unteren Bereich des Tonraums.
 */
export function kadenz(doMidi: number, modus: Modus, stimmlage: Stimmlage): number[][] {
  const tonikaKlasse = (((modus === 'dur' ? doMidi : doMidi - 3) % 12) + 12) % 12;
  const { tief } = TONRAUM[stimmlage];
  const t = tief + ((tonikaKlasse - (tief % 12) + 12) % 12);
  const terz = modus === 'dur' ? 4 : 3;
  const sexteIV = modus === 'dur' ? 9 : 8;
  const I = [t - 12, t, t + terz, t + 7];
  const IV = [t - 7, t, t + 5, t + sexteIV];
  const V = [t - 5, t - 1, t + 2, t + 7];
  return [I, IV, V, I];
}
