// Robuster Zugriff auf localStorage: funktioniert auch, wenn der Speicher gesperrt ist (privater Modus).

const PRAEFIX = 'solmization:';

export function lade<T>(schluessel: string, standard: T): T {
  try {
    const roh = localStorage.getItem(PRAEFIX + schluessel);
    return roh === null ? standard : { ...standard, ...JSON.parse(roh) };
  } catch {
    return standard;
  }
}

export function speichere(schluessel: string, wert: unknown): void {
  try {
    localStorage.setItem(PRAEFIX + schluessel, JSON.stringify(wert));
  } catch {
    // Ohne Speicher läuft die Seite weiter, nur ohne Erinnerung.
  }
}

export function entferne(schluessel: string): void {
  try {
    localStorage.removeItem(PRAEFIX + schluessel);
  } catch {
    // ignorieren
  }
}
