// Tastaturbelegung für Antworten: 1 = tiefster Ton der Auswahl.

import type { SilbenId } from './theorie';

const TASTEN = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'];

export function tasteFuer(index: number): string {
  return TASTEN[index] ?? '';
}

export function optionFuerTaste<T>(optionen: readonly T[], taste: string): T | undefined {
  const i = TASTEN.indexOf(taste);
  return i >= 0 ? optionen[i] : undefined;
}

export type Bewertung = { gewaehlt: SilbenId; soll: SilbenId } | null;

/** Tastenkürzel nicht abfangen, wenn gerade ein Bedienelement den Fokus hat und selbst reagiert. */
export function istEigeneEingabe(e: KeyboardEvent): boolean {
  const ziel = e.target as HTMLElement | null;
  if (!ziel) return false;
  if (ziel.closest('input, select, textarea')) return true;
  return (e.key === ' ' || e.key === 'Enter') && ziel.closest('button, a') !== null;
}
