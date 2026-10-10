// Trefferquoten pro Silbe und Übungstyp sowie häufige Verwechslungen – rein lokal gespeichert.

import { silbe, type SilbenId } from './theorie';

export type UebungsTyp = 'zeichen-silbe' | 'silbe-zeichen' | 'hoeren-silbe' | 'hoeren-zeichen' | 'singen';

export interface Zaehler {
  richtig: number;
  gesamt: number;
}

export interface Statistik {
  treffer: Partial<Record<UebungsTyp, Partial<Record<SilbenId, Zaehler>>>>;
  /** Schlüssel „a|b“ mit a tiefer als b – die Richtung der Verwechslung spielt keine Rolle. */
  verwechslungen: Record<string, number>;
}

export const leereStatistik = (): Statistik => ({ treffer: {}, verwechslungen: {} });

export function verbuche(stat: Statistik, typ: UebungsTyp, soll: SilbenId, richtig: boolean): Statistik {
  const proTyp = { ...stat.treffer[typ] };
  const alt = proTyp[soll] ?? { richtig: 0, gesamt: 0 };
  proTyp[soll] = { richtig: alt.richtig + (richtig ? 1 : 0), gesamt: alt.gesamt + 1 };
  return { ...stat, treffer: { ...stat.treffer, [typ]: proTyp } };
}

export function verbucheVerwechslung(stat: Statistik, soll: SilbenId, ist: SilbenId): Statistik {
  if (soll === ist) return stat;
  const [a, b] = silbe(soll).hoehe < silbe(ist).hoehe ? [soll, ist] : [ist, soll];
  const schluessel = `${a}|${b}`;
  return {
    ...stat,
    verwechslungen: { ...stat.verwechslungen, [schluessel]: (stat.verwechslungen[schluessel] ?? 0) + 1 },
  };
}

export function haeufigsteVerwechslungen(stat: Statistik, anzahl = 3): { paar: [SilbenId, SilbenId]; anzahl: number }[] {
  return Object.entries(stat.verwechslungen)
    .sort(([, x], [, y]) => y - x)
    .slice(0, anzahl)
    .map(([schluessel, n]) => ({ paar: schluessel.split('|') as [SilbenId, SilbenId], anzahl: n }));
}

export function quote(z: Zaehler | undefined): number | null {
  return z && z.gesamt > 0 ? z.richtig / z.gesamt : null;
}
