import { describe, expect, it } from 'vitest';
import { erzeugeFolge, MAX_SPRUNG } from '../aufgaben';
import { dreiklangsSilben, kadenz, silbe, STUFEN, TONRAUM, waehleDo, midiVon, type Stimmlage } from '../theorie';
import { leereStatistik, quote, verbuche } from '../statistik';

// Deterministischer Zufall für reproduzierbare Tests.
function zufallMitSeed(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

describe('waehleDo', () => {
  it('legt jede Stufe in beiden Stimmlagen vollständig in den Tonraum', () => {
    for (const stufe of STUFEN) {
      for (const lage of ['hoch', 'tief'] as Stimmlage[]) {
        for (let seed = 0; seed < 50; seed++) {
          const d = waehleDo(stufe.silben, lage, zufallMitSeed(seed));
          for (const id of stufe.silben) {
            expect(midiVon(d, id)).toBeGreaterThanOrEqual(TONRAUM[lage].tief);
            expect(midiVon(d, id)).toBeLessThanOrEqual(TONRAUM[lage].hoch);
          }
        }
      }
    }
  });
});

describe('kadenz', () => {
  it('beginnt und endet in Dur auf der Tonika von do', () => {
    const akkorde = kadenz(60, 'dur', 'hoch');
    expect(akkorde).toHaveLength(4);
    expect(akkorde[0][0] % 12).toBe(0);
    expect(akkorde[3]).toEqual(akkorde[0]);
  });

  it('nutzt in Moll la als Tonika mit kleiner Terz und Leitton in V', () => {
    const [i, , V] = kadenz(60, 'moll', 'hoch'); // do = C → la = A
    expect(i[1] % 12).toBe(9);
    expect(i[2] - i[1]).toBe(3);
    expect(V[1] % 12).toBe(8); // gis als Leitton
  });
});

describe('erzeugeFolge', () => {
  it('erzeugt singbare Folgen für alle Stufen', () => {
    for (const stufe of STUFEN) {
      for (let seed = 0; seed < 100; seed++) {
        const folge = erzeugeFolge(stufe.silben, stufe.modus, stufe.folgenLaenge, zufallMitSeed(seed));
        expect(folge).toHaveLength(stufe.folgenLaenge);
        folge.forEach((id) => expect(stufe.silben).toContain(id));
        for (let i = 1; i < folge.length; i++) {
          expect(folge[i]).not.toBe(folge[i - 1]);
          expect(Math.abs(silbe(folge[i]).halbton - silbe(folge[i - 1]).halbton)).toBeLessThanOrEqual(MAX_SPRUNG);
        }
        const dreiklang = stufe.silben.filter((id) => dreiklangsSilben(stufe.modus).includes(id));
        if (dreiklang.length > 0) {
          expect(dreiklang).toContain(folge[0]);
          expect(dreiklang).toContain(folge[folge.length - 1]);
        }
      }
    }
  });
});

describe('Statistik', () => {
  it('zählt richtig gesungene Folgen pro Silbe', () => {
    let s = leereStatistik();
    s = verbuche(s, 'so', false);
    s = verbuche(s, 'so', true);
    expect(s.treffer.so).toEqual({ richtig: 1, gesamt: 2 });
    expect(quote(s.treffer.so)).toBe(0.5);
    expect(quote(s.treffer.la)).toBeNull();
  });
});
