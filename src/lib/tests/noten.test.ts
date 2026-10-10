import { describe, expect, it } from 'vitest';
import { erlaubteDoKlassen, hilfslinien, note, position, tonartName, tonartVonDo, vorzeichenPositionen, type VorzeichenStufe } from '../noten';
import { STUFEN, TONRAUM, waehleDo, type Stimmlage } from '../theorie';

describe('Schreibweise', () => {
  it('schreibt do = c als c′ auf der ersten Hilfslinie unter dem Violinsystem', () => {
    const n = note(60, 'do');
    expect(n.name).toBe('c');
    expect(position(n, 'violin')).toBe(-2);
    expect(hilfslinien(-2)).toEqual([-2]);
  });

  it('nutzt die Vorzeichen der Tonart', () => {
    expect(note(62, 'ti').name).toBe('cis'); // D-Dur
    expect(note(65, 'fa').name).toBe('b'); // F-Dur
    expect(note(63, 'la').name).toBe('c'); // Es-Dur
  });

  it('schreibt in Ges-Dur das fa als ces eine Stufe über dem b', () => {
    const fa = note(66, 'fa'); // klingt h′
    expect(fa.name).toBe('ces');
    expect(fa.diatonisch).toBe(5 * 7 + 0); // ces″
    expect(position(fa, 'violin')).toBe(5);
  });

  it('setzt Tenor eine Oktave höher und Bass passend', () => {
    const n = note(48, 'do'); // c
    expect(position(n, 'tenor')).toBe(-2);
    expect(position(n, 'bass')).toBe(3);
  });
});

describe('Tonarten', () => {
  it('benennt Dur- und Molltonarten', () => {
    expect(tonartName(62, 'dur')).toBe('D-Dur, do = d');
    expect(tonartName(60, 'moll')).toBe('a-Moll, la = a');
    expect(tonartName(66, 'moll')).toBe('es-Moll, la = es');
    expect(tonartName(70, 'dur')).toBe('B-Dur, do = b');
  });

  it('begrenzt die Tonarten nach Vorzeichen', () => {
    expect(erlaubteDoKlassen(0)).toEqual([0]);
    expect(erlaubteDoKlassen(2).sort((a, b) => a - b)).toEqual([0, 2, 5, 7, 10]);
    expect(erlaubteDoKlassen(6)).toHaveLength(12);
  });

  it('setzt Vorzeichen an die üblichen Stellen', () => {
    expect(vorzeichenPositionen(tonartVonDo(62), 'violin')).toEqual([8, 5]); // fis″, cis″
    expect(vorzeichenPositionen(tonartVonDo(63), 'bass')).toEqual([2, 5, 1]); // B, es, As
  });
});

describe('Tonart-Wahl mit Vorzeichen-Einstellung', () => {
  it('findet für jede Stufe, Stimmlage und Einstellung eine Tonart mit höchstens kleiner Erweiterung', () => {
    for (const stufe of STUFEN) {
      for (const lage of ['hoch', 'tief'] as Stimmlage[]) {
        for (const max of [0, 2, 4, 6] as VorzeichenStufe[]) {
          const erlaubt = erlaubteDoKlassen(max);
          for (let i = 0; i < 20; i++) {
            const d = waehleDo(stufe.silben, lage, Math.random, erlaubt);
            expect(erlaubt).toContain(d % 12);
            expect(Math.abs(tonartVonDo(d).vorzeichen)).toBeLessThanOrEqual(max);
            for (const id of stufe.silben) {
              const m = note(d, id).midi;
              expect(m).toBeGreaterThanOrEqual(TONRAUM[lage].tief - 3);
              expect(m).toBeLessThanOrEqual(TONRAUM[lage].hoch + 3);
            }
          }
        }
      }
    }
  });

  it('erweitert bei nur C-Dur und voller Dur-Tonleiter minimal (do = c′ für die hohe Stimme)', () => {
    expect(waehleDo(STUFEN[7].silben, 'hoch', Math.random, [0])).toBe(60);
  });
});
