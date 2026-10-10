// Gemeinsamer App-Zustand: Einstellungen, Übungsauswahl und Statistik, lokal gespeichert.

import { entferne, lade, speichere } from './speicher';
import { leereStatistik, type Statistik } from './statistik';
import { STUFEN, type Modus, type SilbenId, type Stimmlage } from './theorie';

export interface Einstellungen {
  stimmlage: Stimmlage;
  /** Zeichen pro Minute beim Singen */
  tempo: number;
}

export interface Auswahl {
  /** Nummer der Stufe oder null für die freie Auswahl */
  stufe: number | null;
  silben: SilbenId[];
  modus: Modus;
}

export const TEMPO = { min: 40, max: 120, standard: 60 };

export const einstellungen = $state<Einstellungen>(lade('einstellungen', { stimmlage: 'hoch', tempo: TEMPO.standard }));

export const auswahl = $state<Auswahl>(
  lade('auswahl', { stufe: 1, silben: [...STUFEN[0].silben], modus: STUFEN[0].modus }),
);

export const statistik = $state<{ wert: Statistik }>({ wert: lade('singstatistik', leereStatistik()) });

export function speichereEinstellungen() {
  speichere('einstellungen', $state.snapshot(einstellungen));
}

export function speichereAuswahl() {
  speichere('auswahl', $state.snapshot(auswahl));
}

export function aktualisiereStatistik(neu: Statistik) {
  statistik.wert = neu;
  speichere('singstatistik', neu);
}

export function setzeStatistikZurueck() {
  statistik.wert = leereStatistik();
  entferne('singstatistik');
}
