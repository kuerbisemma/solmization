// Hilfen für Tastenkürzel.

/** Tastenkürzel nicht abfangen, wenn gerade ein Bedienelement den Fokus hat und selbst reagiert. */
export function istEigeneEingabe(e: KeyboardEvent): boolean {
  const ziel = e.target as HTMLElement | null;
  if (!ziel) return false;
  if (ziel.closest('input, select, textarea')) return true;
  return (e.key === ' ' || e.key === 'Enter') && ziel.closest('button, a, label') !== null;
}
