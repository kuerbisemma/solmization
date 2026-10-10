// Gemeinsamer App-Zustand: Einstellungen, Übungsauswahl und Statistik, lokal gespeichert.

import type { Schluessel, VorzeichenStufe } from './noten';
import { entferne, lade, ladeRoh, speichere } from './speicher';
import { leereStatistik, migriere, verdichte, type Statistik, type Uebung } from './statistik';
import { STUFEN, type Modus, type SilbenId, type Stimmlage } from './theorie';

export interface Einstellungen {
  uebung: Uebung;
  stimmlage: Stimmlage;
  /** Töne pro Minute */
  tempo: number;
  schluessel: Schluessel;
  vorzeichen: VorzeichenStufe;
}

export interface Auswahl {
  /** Nummer der Stufe oder null für die freie Auswahl */
  stufe: number | null;
  silben: SilbenId[];
  modus: Modus;
}

export const TEMPO = { min: 40, max: 120, standard: 60 };

export const einstellungen = $state<Einstellungen>(
  lade('einstellungen', { uebung: 'handzeichen', stimmlage: 'hoch', tempo: TEMPO.standard, schluessel: 'violin', vorzeichen: 2 }),
);

export const auswahl = $state<Auswahl>(
  lade('auswahl', { stufe: 1, silben: [...STUFEN[0].silben], modus: STUFEN[0].modus }),
);

function ladeStatistik(): Statistik {
  const v3 = ladeRoh('statistik3');
  if (v3) return verdichte(migriere(v3));
  const v2 = ladeRoh('singstatistik');
  return v2 ? migriere(v2) : leereStatistik();
}

export const statistik = $state<{ wert: Statistik }>({ wert: ladeStatistik() });

export function speichereEinstellungen() {
  speichere('einstellungen', $state.snapshot(einstellungen));
}

export function speichereAuswahl() {
  speichere('auswahl', $state.snapshot(auswahl));
}

export function aktualisiereStatistik(neu: Statistik) {
  statistik.wert = neu;
  speichere('statistik3', neu);
  entferne('singstatistik');
}

export function setzeStatistikZurueck() {
  statistik.wert = leereStatistik();
  entferne('statistik3');
  entferne('singstatistik');
}
