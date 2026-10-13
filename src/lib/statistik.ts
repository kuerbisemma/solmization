// Selbstbewertungen aller Übungen mit Datum – rein lokal gespeichert.
// Bei „Handzeichen“ und „Noten“ sind die Quoten silbengewichtet: jede Silbe einer bewerteten Folge zählt mit dem
// Ergebnis der Folge. Bei „Lieder“ zählt jedes Lied einmal; eine Silbenquote gibt es dort nicht.

import { SILBEN, type SilbenId } from './theorie';

export type Uebung = 'handzeichen' | 'noten' | 'lieder';
export const UEBUNGEN: Uebung[] = ['handzeichen', 'noten', 'lieder'];
/** Übungen mit Quote pro Silbe */
export type SilbenUebung = Exclude<Uebung, 'lieder'>;
export const SILBEN_UEBUNGEN: SilbenUebung[] = ['handzeichen', 'noten'];

export interface Zaehler {
  richtig: number;
  gesamt: number;
}

/** Eine bewertete Folge bzw. Melodie. */
export interface Eintrag {
  /** Tag seit 1970-01-01 (lokale Zeit) */
  tag: number;
  uebung: Uebung;
  /** bei „Lieder“ leer */
  silben: SilbenId[];
  richtig: boolean;
  /** Lied-Id bei „Lieder“ */
  lied?: string;
}

export interface Statistik {
  version: 3;
  eintraege: Eintrag[];
  /** Verdichtete Altdaten (älter als 52 Wochen bzw. aus Version 2) – zählen nur in den Quoten. */
  summen: Record<SilbenUebung, Partial<Record<SilbenId, Zaehler>>>;
  /** Verdichtete Lieder-Bewertungen */
  liedSumme: Zaehler;
}

export const AUFBEWAHRUNG_WOCHEN = 52;

export const leereStatistik = (): Statistik => ({
  version: 3,
  eintraege: [],
  summen: { handzeichen: {}, noten: {} },
  liedSumme: { richtig: 0, gesamt: 0 },
});

export function heute(datum = new Date()): number {
  return Math.floor((datum.getTime() - datum.getTimezoneOffset() * 60_000) / 86_400_000);
}

/** Montag der Woche, in der der Tag liegt (1970-01-01 war ein Donnerstag). */
export function wochenbeginn(tag: number): number {
  return tag - ((tag + 3) % 7);
}

function addiere(ziel: Partial<Record<SilbenId, Zaehler>>, id: SilbenId, richtig: boolean) {
  const alt = ziel[id] ?? { richtig: 0, gesamt: 0 };
  ziel[id] = { richtig: alt.richtig + (richtig ? 1 : 0), gesamt: alt.gesamt + 1 };
}

export function verbuche(stat: Statistik, eintrag: Eintrag): Statistik {
  return { ...stat, eintraege: [...stat.eintraege, eintrag] };
}

/** Verschiebt Einträge, die älter als 52 Wochen sind, in die Summen. */
export function verdichte(stat: Statistik, jetzt = heute()): Statistik {
  const grenze = wochenbeginn(jetzt) - (AUFBEWAHRUNG_WOCHEN - 1) * 7;
  const alt = stat.eintraege.filter((e) => e.tag < grenze);
  if (alt.length === 0) return stat;
  const summen = { handzeichen: { ...stat.summen.handzeichen }, noten: { ...stat.summen.noten } };
  const liedSumme = { ...stat.liedSumme };
  for (const e of alt) {
    if (e.uebung === 'lieder') {
      liedSumme.gesamt += 1;
      if (e.richtig) liedSumme.richtig += 1;
    } else for (const id of e.silben) addiere(summen[e.uebung], id, e.richtig);
  }
  return { ...stat, eintraege: stat.eintraege.filter((e) => e.tag >= grenze), summen, liedSumme };
}

/** Übernimmt gespeicherte Daten; Version 2 ({ treffer }) wird zu Summen der Handzeichen-Übung. */
export function migriere(roh: unknown): Statistik {
  const daten = roh as Partial<Statistik> & { treffer?: Partial<Record<SilbenId, Zaehler>> };
  if (daten?.version === 3 && Array.isArray(daten.eintraege) && daten.summen) {
    return { ...(daten as Statistik), liedSumme: daten.liedSumme ?? { richtig: 0, gesamt: 0 } };
  }
  const stat = leereStatistik();
  if (daten?.treffer) stat.summen.handzeichen = { ...daten.treffer };
  return stat;
}

export function proSilbe(stat: Statistik, uebung: SilbenUebung): Partial<Record<SilbenId, Zaehler>> {
  const ergebnis: Partial<Record<SilbenId, Zaehler>> = {};
  for (const [id, z] of Object.entries(stat.summen[uebung]) as [SilbenId, Zaehler][]) ergebnis[id] = { ...z };
  for (const e of stat.eintraege) {
    if (e.uebung !== uebung) continue;
    for (const id of e.silben) addiere(ergebnis, id, e.richtig);
  }
  return ergebnis;
}

/** Gesamtquote: bei „Lieder“ je Lied, sonst silbengewichtet. */
export function gesamt(stat: Statistik, uebung: Uebung): Zaehler {
  if (uebung === 'lieder') {
    return stat.eintraege
      .filter((e) => e.uebung === 'lieder')
      .reduce((s, e) => ({ richtig: s.richtig + (e.richtig ? 1 : 0), gesamt: s.gesamt + 1 }), { ...stat.liedSumme });
  }
  return Object.values(proSilbe(stat, uebung)).reduce<Zaehler>(
    (s, z) => ({ richtig: s.richtig + z!.richtig, gesamt: s.gesamt + z!.gesamt }),
    { richtig: 0, gesamt: 0 },
  );
}

export interface Woche {
  /** Tag des Montags */
  beginn: number;
  werte: Record<Uebung, { quote: number | null; folgen: number }>;
}

/** Wochenwerte der letzten `anzahl` Wochen bis einschließlich der aktuellen. */
export function wochenverlauf(stat: Statistik, anzahl: number, jetzt = heute()): Woche[] {
  const letzte = wochenbeginn(jetzt);
  const wochen: Woche[] = [];
  for (let i = anzahl - 1; i >= 0; i--) {
    const beginn = letzte - i * 7;
    const werte = {} as Woche['werte'];
    for (const u of UEBUNGEN) {
      const drin = stat.eintraege.filter((e) => e.uebung === u && e.tag >= beginn && e.tag < beginn + 7);
      const gewicht = (e: Eintrag) => (u === 'lieder' ? 1 : e.silben.length);
      const silben = drin.reduce((n, e) => n + gewicht(e), 0);
      const richtig = drin.reduce((n, e) => n + (e.richtig ? gewicht(e) : 0), 0);
      werte[u] = { quote: silben > 0 ? richtig / silben : null, folgen: drin.length };
    }
    wochen.push({ beginn, werte });
  }
  return wochen;
}

export function quote(z: Zaehler | undefined): number | null {
  return z && z.gesamt > 0 ? z.richtig / z.gesamt : null;
}

/** Silben mit Daten in mindestens einer Übung, von hoch nach tief. */
export function silbenMitDaten(stat: Statistik): SilbenId[] {
  const h = proSilbe(stat, 'handzeichen');
  const n = proSilbe(stat, 'noten');
  return [...SILBEN].reverse().filter((s) => h[s.id]?.gesamt || n[s.id]?.gesamt).map((s) => s.id);
}
