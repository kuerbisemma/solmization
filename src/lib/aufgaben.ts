// Erzeugt singbare Zeichenfolgen.

import { dreiklangsSilben, silbe, type Modus, type SilbenId, type Zufall } from './theorie';

export const FOLGEN_PRO_RUNDE = 5;

function ziehe<T>(liste: readonly T[], zufall: Zufall): T {
  return liste[Math.floor(zufall() * liste.length)];
}

/** Größter erlaubter Sprung in singbaren Folgen (Quinte). */
export const MAX_SPRUNG = 7;

function abstand(a: SilbenId, b: SilbenId): number {
  return Math.abs(silbe(a).halbton - silbe(b).halbton);
}

/** Schritte bevorzugen, kleine Sprünge seltener, große Sprünge am seltensten. */
function gewicht(halbtoene: number): number {
  if (halbtoene <= 2) return 4;
  if (halbtoene <= 4) return 3;
  if (halbtoene <= 5) return 2;
  return 1;
}

function zieheGewichtet(vorher: SilbenId, kandidaten: SilbenId[], zufall: Zufall): SilbenId {
  const gewichte = kandidaten.map((k) => gewicht(abstand(vorher, k)));
  let r = zufall() * gewichte.reduce((a, b) => a + b, 0);
  for (let i = 0; i < kandidaten.length; i++) {
    r -= gewichte[i];
    if (r < 0) return kandidaten[i];
  }
  return kandidaten[kandidaten.length - 1];
}

/**
 * Singbare Folge: Beginn und Ende auf Tönen des Tonika-Dreiklangs (sofern in der Auswahl),
 * keine Tonwiederholung, keine Sprünge größer als eine Quinte, Schritte bevorzugt.
 */
export function erzeugeFolge(
  ids: readonly SilbenId[],
  modus: Modus,
  laenge: number,
  zufall: Zufall = Math.random,
): SilbenId[] {
  if (ids.length < 2) throw new Error('Mindestens zwei Silben nötig');
  const dreiklang = ids.filter((id) => dreiklangsSilben(modus).includes(id));
  const rahmen = dreiklang.length > 0 ? dreiklang : [...ids];
  const nachbarn = (vorher: SilbenId, aus: readonly SilbenId[]) =>
    aus.filter((id) => id !== vorher && abstand(vorher, id) <= MAX_SPRUNG);

  for (let versuch = 0; versuch < 100; versuch++) {
    const folge: SilbenId[] = [ziehe(rahmen, zufall)];
    let ok = true;
    for (let i = 1; i < laenge; i++) {
      const vorher = folge[i - 1];
      const kandidaten = nachbarn(vorher, i === laenge - 1 ? rahmen : ids);
      if (kandidaten.length === 0) {
        ok = false;
        break;
      }
      folge.push(zieheGewichtet(vorher, kandidaten, zufall));
    }
    if (ok) return folge;
  }

  // Rückfall für ungewöhnliche Auswahlen: nur Wiederholungen vermeiden.
  const folge: SilbenId[] = [ziehe(ids, zufall)];
  while (folge.length < laenge) folge.push(ziehe(ids.filter((id) => id !== folge[folge.length - 1]), zufall));
  return folge;
}
