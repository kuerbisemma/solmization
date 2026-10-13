// Gemeinfreie Lieder (Liedanfänge) für die Übung „Lieder singen“ – als Silben mit Rhythmus.
// Notation je Ton: Silbe + Notenwert, z. B. „so4“, „do'2“, „la,8“, „mi4.“; „r4“ ist eine Pause, „|“ ein Taktstrich.
// Notenwerte: 1 = Ganze, 2 = Halbe, 4 = Viertel, 8 = Achtel, Punkt verlängert um die Hälfte.
// Alle Melodien sind von Johannes Golda fachlich abgenommen (Übersicht: docs/lieder.md); neue Lieder ebenso abnehmen lassen.

import { sortiert, type Modus, type SilbenId } from './theorie';

/** Ton oder Pause (id = null); Dauer in Achteln. */
export interface Ereignis {
  id: SilbenId | null;
  dauer: number;
}

export interface Takt {
  /** Zähler der Taktart (2, 3 oder 4 Viertel) */
  viertel: 2 | 3 | 4;
  /** Länge des Auftakts in Achteln (0 = ohne Auftakt) */
  auftakt: number;
}

export interface Lied {
  id: string;
  titel: string;
  /** Textanfang zum Erinnern an die Melodie */
  text: string;
  modus: Modus;
  takt: Takt;
  /** Viertel pro Minute */
  tempo: number;
  /** Takte in der obigen Notation */
  noten: string;
}

export const LIEDER: readonly Lied[] = [
  {
    id: 'entchen',
    titel: 'Alle meine Entchen',
    text: 'Alle meine Entchen schwimmen auf dem See',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 112,
    noten: 'do4 re4 mi4 fa4 | so2 so2 | la4 la4 la4 la4 | so1 | la4 la4 la4 la4 | so1',
  },
  {
    id: 'haenschen',
    titel: 'Hänschen klein',
    text: 'Hänschen klein ging allein in die weite Welt hinein',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 112,
    noten: 'so4 mi4 mi2 | fa4 re4 re2 | do4 re4 mi4 fa4 | so4 so4 so2',
  },
  {
    id: 'jakob',
    titel: 'Bruder Jakob',
    text: 'Bruder Jakob, schläfst du noch?',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 100,
    noten:
      'do4 re4 mi4 do4 | do4 re4 mi4 do4 | mi4 fa4 so2 | mi4 fa4 so2 | so8 la8 so8 fa8 mi4 do4 | so8 la8 so8 fa8 mi4 do4 | do4 so,4 do2 | do4 so,4 do2',
  },
  {
    id: 'weihnachtsmann',
    titel: 'Morgen kommt der Weihnachtsmann',
    text: 'Morgen kommt der Weihnachtsmann, kommt mit seinen Gaben',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 100,
    noten: 'do4 do4 so4 so4 | la4 la4 so2 | fa4 fa4 mi4 mi4 | re4 re4 do2',
  },
  {
    id: 'fuchs',
    titel: 'Fuchs, du hast die Gans gestohlen',
    text: 'Fuchs, du hast die Gans gestohlen, gib sie wieder her',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 112,
    noten: "do4 re4 mi4 fa4 | so4 so4 so4 so4 | la4 fa4 do'4 la4 | so1",
  },
  {
    id: 'voegel',
    titel: 'Alle Vögel sind schon da',
    text: 'Alle Vögel sind schon da, alle Vögel, alle',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 104,
    noten: "do4 mi4 so4 do'4 | la4 do'4 so2 | fa4 la4 so4 mi4 | re1",
  },
  {
    id: 'freude',
    titel: 'Freude, schöner Götterfunken',
    text: 'Freude, schöner Götterfunken, Tochter aus Elysium',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 104,
    noten:
      'mi4 mi4 fa4 so4 | so4 fa4 mi4 re4 | do4 do4 re4 mi4 | mi4. re8 re2 | mi4 mi4 fa4 so4 | so4 fa4 mi4 re4 | do4 do4 re4 mi4 | re4. do8 do2',
  },
  {
    id: 'jingle',
    titel: 'Jingle Bells',
    text: 'Jingle bells, jingle bells, jingle all the way',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 120,
    noten: 'mi4 mi4 mi2 | mi4 mi4 mi2 | mi4 so4 do4. re8 | mi1 | fa4 fa4 fa4. fa8 | fa4 mi4 mi4 mi8 mi8 | mi4 re4 re4 mi4 | re2 so2',
  },
  {
    id: 'mary',
    titel: 'Mary Had a Little Lamb',
    text: 'Mary had a little lamb, little lamb, little lamb',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 112,
    noten: 'mi4 re4 do4 re4 | mi4 mi4 mi2 | re4 re4 re2 | mi4 so4 so2 | mi4 re4 do4 re4 | mi4 mi4 mi4 mi4 | re4 re4 mi4 re4 | do1',
  },
  {
    id: 'macdonald',
    titel: 'Old MacDonald Had a Farm',
    text: 'Old MacDonald had a farm, E-I-E-I-O',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 116,
    noten: 'do4 do4 do4 so,4 | la,4 la,4 so,2 | mi4 mi4 re4 re4 | do1',
  },
  {
    id: 'amazing',
    titel: 'Amazing Grace',
    text: 'Amazing grace, how sweet the sound',
    modus: 'dur',
    takt: { viertel: 3, auftakt: 2 },
    tempo: 84,
    noten: 'so,4 | do2 mi8 do8 | mi2 re4 | do2 la,4 | so,2 so,4 | do2 mi8 do8 | mi2 re8 mi8 | so2',
  },
  {
    id: 'london',
    titel: 'London Bridge Is Falling Down',
    text: 'London Bridge is falling down, my fair lady',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 112,
    noten: 'so4. la8 so4 fa4 | mi4 fa4 so2 | re4 mi4 fa2 | mi4 fa4 so2 | so4. la8 so4 fa4 | mi4 fa4 so2 | re2 so2 | mi2 do2',
  },
  {
    id: 'saints',
    titel: 'When the Saints Go Marching In',
    text: 'Oh when the saints go marching in',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 6 },
    tempo: 132,
    noten: 'do4 mi4 fa4 | so1 | r4 do4 mi4 fa4 | so1 | r4 do4 mi4 fa4 | so2 mi2 | do2 mi2 | re1',
  },
  {
    id: 'susanna',
    titel: 'Oh! Susanna',
    text: 'I come from Alabama with a banjo on my knee',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 2 },
    tempo: 120,
    noten: 'do8 re8 | mi4 so4 so4. la8 | so4 mi4 do4. re8 | mi4 mi4 re4 do4 | re2. do8 re8 | mi4 so4 so4. la8 | so4 mi4 do4. re8 | mi4 mi4 re4 re4 | do2.',
  },
  {
    id: 'clair',
    titel: 'Au clair de la lune',
    text: 'Au clair de la lune, mon ami Pierrot',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 96,
    noten: 'do4 do4 do4 re4 | mi2 re2 | do4 mi4 re4 re4 | do1 | do4 do4 do4 re4 | mi2 re2 | do4 mi4 re4 re4 | do1',
  },
  {
    id: 'buns',
    titel: 'Hot Cross Buns',
    text: 'Hot cross buns, hot cross buns',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 0 },
    tempo: 100,
    noten: 'mi4 re4 do2 | mi4 re4 do2 | do8 do8 do8 do8 re8 re8 re8 re8 | mi4 re4 do2',
  },
  {
    id: 'auld',
    titel: 'Auld Lang Syne',
    text: 'Should auld acquaintance be forgot',
    modus: 'dur',
    takt: { viertel: 4, auftakt: 2 },
    tempo: 84,
    noten: 'so,4 | do4. do8 do4 mi4 | re4. do8 re4 mi4 | do4. do8 mi4 so4 | la2.',
  },
];

const TON = /^(so,|la,|ti,|do'|do|re|mi|fa|so|la|ti|r)(1|2|4|8)(\.?)$/;
const ACHTEL: Record<string, number> = { '1': 8, '2': 4, '4': 2, '8': 1 };

/** Zerlegt die Notation in Takte. */
export function takte(lied: Lied): Ereignis[][] {
  return lied.noten.split('|').map((t) =>
    t.trim().split(/\s+/).map((token) => {
      const m = TON.exec(token);
      if (!m) throw new Error(`${lied.id}: unbekannter Ton „${token}“`);
      const dauer = ACHTEL[m[2]] * (m[3] ? 1.5 : 1);
      if (!Number.isInteger(dauer)) throw new Error(`${lied.id}: Notenwert „${token}“ nicht darstellbar`);
      return { id: m[1] === 'r' ? null : (m[1] as SilbenId), dauer };
    }),
  );
}

export function ereignisse(lied: Lied): Ereignis[] {
  return takte(lied).flat();
}

/** Alle Silben, die im Lied vorkommen (von tief nach hoch). */
export function liedSilben(lied: Lied): SilbenId[] {
  return sortiert(ereignisse(lied).flatMap((e) => (e.id ? [e.id] : [])));
}

/** Lieder, deren Silben vollständig in der Auswahl liegen und deren Tongeschlecht passt. */
export function passendeLieder(silben: readonly SilbenId[], modus: Modus): Lied[] {
  return LIEDER.filter((l) => l.modus === modus && liedSilben(l).every((id) => silben.includes(id)));
}

export const LIEDER_PRO_RUNDE = 5;

/** Zufällige Liedauswahl für eine Runde, ohne Wiederholung. */
export function waehleLieder(lieder: readonly Lied[], anzahl = LIEDER_PRO_RUNDE, zufall: () => number = Math.random): Lied[] {
  const rest = [...lieder];
  const runde: Lied[] = [];
  while (runde.length < anzahl && rest.length > 0) runde.push(rest.splice(Math.floor(zufall() * rest.length), 1)[0]);
  return runde;
}
