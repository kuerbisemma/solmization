// Horizontales Layout im Notensystem: Abstände nach Notenwert, Takte, Zeilenumbruch und Balken.
// Die Maße sind SVG-Einheiten der Notenzeile (Linienabstand 10).

import type { Ereignis, Takt } from './lieder';

/** Platz nach einem Ton bzw. einer Pause, abhängig von der Dauer in Achteln. */
const PLATZ: Record<number, number> = { 1: 20, 2: 28, 3: 34, 4: 38, 6: 46, 8: 54 };
/** Gleichmäßiger Abstand ohne Rhythmus (Übung „Noten singen“). */
export const NOTENABSTAND = 44;
/** Abstand zwischen Taktstrich und erster Note. */
const TAKTANFANG = 8;
/** Unter diesem Füllgrad wird die letzte Zeile nicht auf volle Breite gestreckt. */
const MIN_FUELLUNG = 0.7;

export interface Gesetzt {
  /** Index in der Gesamtfolge (für Markierung und Klang) */
  index: number;
  ereignis: Ereignis;
  x: number;
}

export interface Zeile {
  noten: Gesetzt[];
  /** x-Positionen der Taktstriche innerhalb der Zeile (ohne den Schlussstrich) */
  taktstriche: number[];
  /** Ende der Zeile (letzter Takt- bzw. Schlussstrich) */
  ende: number;
  /** Paare von Indizes (in `noten`) zusammengebalkter Achtel */
  balken: [number, number][];
}

const platz = (e: Ereignis) => PLATZ[e.dauer] ?? NOTENABSTAND;

/**
 * Achtelpaare innerhalb eines Viertelschlags werden gebalkt. `beginn` ist der Taktbeginn in Achteln
 * relativ zum ersten Schlag (beim Auftakt negativ).
 */
function balkenImTakt(takt: Ereignis[], beginn: number): [number, number][] {
  const paare: [number, number][] = [];
  let zeit = beginn;
  for (let i = 0; i < takt.length; i++) {
    const naechste = takt[i + 1];
    const aufSchlag = ((zeit % 2) + 2) % 2 === 0;
    if (takt[i].dauer === 1 && takt[i].id && naechste?.dauer === 1 && naechste.id && aufSchlag) {
      paare.push([i, i + 1]);
      zeit += 2;
      i++;
      continue;
    }
    zeit += takt[i].dauer;
  }
  return paare;
}

/** Eine Zeile mit gleichmäßigem Abstand, ohne Takte (Übung „Noten singen“). */
export function gleichmaessig(folge: Ereignis[], vorspann: number): Zeile {
  return {
    noten: folge.map((ereignis, index) => ({ index, ereignis, x: vorspann + index * NOTENABSTAND })),
    taktstriche: [],
    ende: vorspann + folge.length * NOTENABSTAND,
    balken: [],
  };
}

/**
 * Verteilt die Takte auf möglichst wenige Zeilen und dabei möglichst gleichmäßig (kein einzelner Takt am Ende).
 * Kosten je Zeile: Quadrat des ungenutzten Anteils. Ein Takt, der allein zu breit ist, bekommt eine eigene Zeile.
 */
function umbrechen(breiten: number[], breite: number, vorspann: (zeile: number) => number): number[][] {
  type Loesung = { zeilen: number[][]; kosten: number };
  const besser = (a: Loesung, b: Loesung) =>
    a.zeilen.length !== b.zeilen.length ? a.zeilen.length < b.zeilen.length : a.kosten < b.kosten;
  const merk = new Map<string, Loesung>();

  function ab(start: number, zeile: number): Loesung {
    if (start === breiten.length) return { zeilen: [], kosten: 0 };
    const schluessel = `${start}/${zeile}`;
    const bekannt = merk.get(schluessel);
    if (bekannt) return bekannt;
    const verfuegbar = breite - vorspann(zeile);
    let beste: Loesung | null = null;
    let summe = 0;
    for (let ende = start; ende < breiten.length; ende++) {
      summe += breiten[ende];
      if (summe > verfuegbar && ende > start) break;
      const rest = ab(ende + 1, zeile + 1);
      const kandidat = {
        zeilen: [Array.from({ length: ende - start + 1 }, (_, i) => start + i), ...rest.zeilen],
        kosten: Math.max(0, 1 - summe / verfuegbar) ** 2 + rest.kosten,
      };
      if (!beste || besser(kandidat, beste)) beste = kandidat;
    }
    merk.set(schluessel, beste!);
    return beste!;
  }

  return ab(0, 0).zeilen;
}

/**
 * Setzt Takte in Zeilen von höchstens `breite` Einheiten. Umbrochen wird nur an Taktgrenzen; volle Zeilen
 * werden auf die ganze Breite gestreckt. `vorspann(i)` ist der Platz für Schlüssel, Vorzeichen (und Taktart) in Zeile i.
 */
export function setzeTakte(takte: Ereignis[][], takt: Takt, breite: number, vorspann: (zeile: number) => number): Zeile[] {
  const breiten = takte.map((t) => TAKTANFANG + t.reduce((s, e) => s + platz(e), 0));
  const zeilen = umbrechen(breiten, breite, vorspann);

  const taktAchtel = takt.viertel * 2;
  const beginne: number[] = [];
  let zeit = takt.auftakt > 0 ? -takt.auftakt : 0;
  for (const t of takte) {
    beginne.push(zeit);
    zeit += t.reduce((s, e) => s + e.dauer, 0);
  }

  let index = 0;
  return zeilen.map((taktIndizes, z) => {
    const start = vorspann(z);
    const natuerlich = taktIndizes.reduce((s, i) => s + breiten[i], 0);
    const letzte = z === zeilen.length - 1;
    const verfuegbar = breite - start;
    const strecken = !letzte || natuerlich > verfuegbar * MIN_FUELLUNG;
    const faktor = strecken ? verfuegbar / natuerlich : 1;

    const zeile: Zeile = { noten: [], taktstriche: [], ende: start, balken: [] };
    let x = start;
    for (const i of taktIndizes) {
      let nx = x + TAKTANFANG * faktor;
      const erste = zeile.noten.length;
      for (const ereignis of takte[i]) {
        zeile.noten.push({ index: index++, ereignis, x: nx });
        nx += platz(ereignis) * faktor;
      }
      for (const [a, b] of balkenImTakt(takte[i], ((beginne[i] % taktAchtel) + taktAchtel) % taktAchtel)) {
        zeile.balken.push([erste + a, erste + b]);
      }
      x += breiten[i] * faktor;
      zeile.taktstriche.push(x);
    }
    zeile.ende = zeile.taktstriche.pop() ?? x;
    return zeile;
  });
}
