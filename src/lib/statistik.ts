// Quote richtig gesungener Folgen pro Silbe – rein lokal gespeichert.

import type { SilbenId } from './theorie';

export interface Zaehler {
  richtig: number;
  gesamt: number;
}

export interface Statistik {
  treffer: Partial<Record<SilbenId, Zaehler>>;
}

export const leereStatistik = (): Statistik => ({ treffer: {} });

export function verbuche(stat: Statistik, id: SilbenId, richtig: boolean): Statistik {
  const alt = stat.treffer[id] ?? { richtig: 0, gesamt: 0 };
  return { treffer: { ...stat.treffer, [id]: { richtig: alt.richtig + (richtig ? 1 : 0), gesamt: alt.gesamt + 1 } } };
}

export function quote(z: Zaehler | undefined): number | null {
  return z && z.gesamt > 0 ? z.richtig / z.gesamt : null;
}
