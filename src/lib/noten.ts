// Notenschrift: Tonarten mit Vorzeichen, Schreibweise der Töne und Positionen im Liniensystem.
// Nur diatonische Melodien – Versetzungszeichen gibt es nicht, nur die Vorzeichen der Tonart.

import { silbe, type Modus, type SilbenId } from './theorie';

export type Schluessel = 'violin' | 'tenor' | 'bass';
/** Höchstzahl der Vorzeichen (Einstellung) */
export type VorzeichenStufe = 0 | 2 | 4 | 6;

const BUCHSTABEN = ['c', 'd', 'e', 'f', 'g', 'a', 'h'] as const;
const STAMMTON_PC = [0, 2, 4, 5, 7, 9, 11];

export interface Tonart {
  /** Tonhöhenklasse von do (0 = c) */
  doKlasse: number;
  /** Buchstabe von do (0 = c … 6 = h) */
  doBuchstabe: number;
  /** positiv = Kreuze, negativ = Be */
  vorzeichen: number;
}

/** Eine Tonart je Tonhöhenklasse von do; bei 6 Vorzeichen Ges-Dur (statt Fis-Dur). */
const TONARTEN: Tonart[] = [
  { doKlasse: 0, doBuchstabe: 0, vorzeichen: 0 }, // C
  { doKlasse: 1, doBuchstabe: 1, vorzeichen: -5 }, // Des
  { doKlasse: 2, doBuchstabe: 1, vorzeichen: 2 }, // D
  { doKlasse: 3, doBuchstabe: 2, vorzeichen: -3 }, // Es
  { doKlasse: 4, doBuchstabe: 2, vorzeichen: 4 }, // E
  { doKlasse: 5, doBuchstabe: 3, vorzeichen: -1 }, // F
  { doKlasse: 6, doBuchstabe: 4, vorzeichen: -6 }, // Ges
  { doKlasse: 7, doBuchstabe: 4, vorzeichen: 1 }, // G
  { doKlasse: 8, doBuchstabe: 5, vorzeichen: -4 }, // As
  { doKlasse: 9, doBuchstabe: 5, vorzeichen: 3 }, // A
  { doKlasse: 10, doBuchstabe: 6, vorzeichen: -2 }, // B
  { doKlasse: 11, doBuchstabe: 6, vorzeichen: 5 }, // H
];

const pc = (midi: number) => ((midi % 12) + 12) % 12;

export function tonartVonDo(doMidi: number): Tonart {
  return TONARTEN[pc(doMidi)];
}

/** Tonhöhenklassen von do, deren Tonart höchstens `max` Vorzeichen hat. */
export function erlaubteDoKlassen(max: VorzeichenStufe): number[] {
  return TONARTEN.filter((t) => Math.abs(t.vorzeichen) <= max).map((t) => t.doKlasse);
}

/** Alteration eines Buchstabens in der Tonart (+1 Kreuz, −1 Be, 0). */
function alteration(t: Tonart, buchstabe: number): number {
  const KREUZ_FOLGE = [3, 0, 4, 1, 5, 2, 6]; // f c g d a e h
  const BE_FOLGE = [6, 2, 5, 1, 4, 0, 3]; // h e a d g c f
  if (t.vorzeichen > 0) return KREUZ_FOLGE.slice(0, t.vorzeichen).includes(buchstabe) ? 1 : 0;
  if (t.vorzeichen < 0) return BE_FOLGE.slice(0, -t.vorzeichen).includes(buchstabe) ? -1 : 0;
  return 0;
}

function tonname(buchstabe: number, alt: number): string {
  const b = BUCHSTABEN[buchstabe];
  if (alt > 0) return `${b}is`;
  if (alt < 0) return b === 'h' ? 'b' : b === 'e' ? 'es' : b === 'a' ? 'as' : `${b}es`;
  return b;
}

/** z. B. „D-Dur, do = d“ bzw. „h-Moll, la = h“ */
export function tonartName(doMidi: number, modus: Modus): string {
  const t = tonartVonDo(doMidi);
  const doName = tonname(t.doBuchstabe, alteration(t, t.doBuchstabe));
  if (modus === 'dur') return `${doName.charAt(0).toUpperCase()}${doName.slice(1)}-Dur, do = ${doName}`;
  const laBuchstabe = (t.doBuchstabe + 5) % 7;
  const laName = tonname(laBuchstabe, alteration(t, laBuchstabe));
  return `${laName}-Moll, la = ${laName}`;
}

/** Stufe der Silbe in der Tonleiter relativ zu do (so, = −3 … do' = 7). */
const STUFE: Record<SilbenId, number> = {
  'so,': -3,
  'la,': -2,
  'ti,': -1,
  do: 0,
  re: 1,
  mi: 2,
  fa: 3,
  so: 4,
  la: 5,
  ti: 6,
  "do'": 7,
};

export interface Note {
  id: SilbenId;
  midi: number;
  /** Diatonischer Index: Oktave·7 + Buchstabe (c' = 4·7 + 0 = 28) */
  diatonisch: number;
  name: string;
}

export function note(doMidi: number, id: SilbenId): Note {
  const t = tonartVonDo(doMidi);
  const midi = doMidi + silbe(id).halbton;
  const buchstabe = (((t.doBuchstabe + STUFE[id]) % 7) + 7) % 7;
  const alt = alteration(t, buchstabe);
  // Oktave nach wissenschaftlicher Zählung (c' = C4); Ces/His korrekt über die Alteration.
  const oktave = Math.floor((midi - alt - STAMMTON_PC[buchstabe]) / 12) - 1;
  return { id, midi, diatonisch: oktave * 7 + buchstabe, name: tonname(buchstabe, alt) };
}

/** Diatonischer Index der untersten Notenlinie je Schlüssel (geschriebene Tonhöhe). */
const UNTERSTE_LINIE: Record<Schluessel, number> = {
  violin: 4 * 7 + 2, // e'
  tenor: 3 * 7 + 2, // klingt eine Oktave tiefer als notiert
  bass: 2 * 7 + 4, // G
};

/** Position im Liniensystem: 0 = unterste Linie, 8 = oberste Linie, ungerade = Zwischenräume. */
export function position(n: Note, schluessel: Schluessel): number {
  return n.diatonisch - UNTERSTE_LINIE[schluessel];
}

/** Positionen der Vorzeichen in der üblichen Reihenfolge (Violinschlüssel; Bass zwei Stufen tiefer). */
export function vorzeichenPositionen(t: Tonart, schluessel: Schluessel): number[] {
  const KREUZE = [8, 5, 9, 6, 3, 7, 4];
  const BE = [4, 7, 3, 6, 2, 5, 1];
  const basis = t.vorzeichen >= 0 ? KREUZE.slice(0, t.vorzeichen) : BE.slice(0, -t.vorzeichen);
  return schluessel === 'bass' ? basis.map((p) => p - 2) : basis;
}

/** Hilfslinien für eine Note außerhalb des Systems. */
export function hilfslinien(pos: number): number[] {
  const linien: number[] = [];
  for (let p = -2; p >= pos; p -= 2) linien.push(p);
  for (let p = 10; p <= pos; p += 2) linien.push(p);
  return linien;
}

export function vorzeichenText(t: Tonart): string {
  if (t.vorzeichen === 0) return 'keine Vorzeichen';
  const n = Math.abs(t.vorzeichen);
  return t.vorzeichen > 0 ? `${n} ${n === 1 ? 'Kreuz' : 'Kreuze'}` : `${n} Be`;
}
