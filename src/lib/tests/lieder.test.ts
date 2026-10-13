import { describe, expect, it } from 'vitest';
import { ereignisse, LIEDER, liedSilben, passendeLieder, takte, waehleLieder } from '../lieder';
import { gleichmaessig, setzeTakte } from '../notensatz';
import { STUFEN, TONRAUM, waehleDo, midiVon, type Stimmlage } from '../theorie';
import { erlaubteDoKlassen, type VorzeichenStufe } from '../noten';

describe('Lieder', () => {
  it('haben eindeutige Ids und lesbare Notation', () => {
    expect(new Set(LIEDER.map((l) => l.id)).size).toBe(LIEDER.length);
    for (const l of LIEDER) expect(ereignisse(l).length).toBeGreaterThan(0);
  });

  it('füllen jeden Takt passend zur Taktart; der Schlusstakt ist voll oder ergänzt den Auftakt', () => {
    for (const l of LIEDER) {
      const voll = l.takt.viertel * 2;
      const laengen = takte(l).map((t) => t.reduce((s, e) => s + e.dauer, 0));
      const erster = l.takt.auftakt > 0 ? l.takt.auftakt : voll;
      expect(laengen[0], `${l.id}: erster Takt`).toBe(erster);
      laengen.slice(1, -1).forEach((n, i) => expect(n, `${l.id}: Takt ${i + 2}`).toBe(voll));
      const letzter = laengen[laengen.length - 1];
      expect([voll, voll - l.takt.auftakt], `${l.id}: letzter Takt`).toContain(letzter);
    }
  });

  it('liegen im Tonvorrat so, bis do′ und beginnen mit einem Ton', () => {
    for (const l of LIEDER) {
      expect(ereignisse(l)[0].id, l.id).not.toBeNull();
      expect(liedSilben(l).length).toBeGreaterThanOrEqual(2);
    }
  });

  it('passen in jede Stimmlage und Vorzeichen-Einstellung', () => {
    for (const l of LIEDER) {
      for (const lage of ['hoch', 'tief'] as Stimmlage[]) {
        for (const v of [0, 2, 4, 6] as VorzeichenStufe[]) {
          const d = waehleDo(liedSilben(l), lage, () => 0.5, erlaubteDoKlassen(v));
          for (const id of liedSilben(l)) {
            expect(midiVon(d, id)).toBeGreaterThanOrEqual(TONRAUM[lage].tief - 12);
            expect(midiVon(d, id)).toBeLessThanOrEqual(TONRAUM[lage].hoch + 12);
          }
        }
      }
    }
  });

  it('filtert nach Silben und Tongeschlecht', () => {
    const stufe8 = STUFEN[7];
    expect(passendeLieder(stufe8.silben, 'dur').length).toBe(LIEDER.filter((l) => l.modus === 'dur').length);
    expect(passendeLieder(['do', 're', 'mi'], 'dur').map((l) => l.id)).toEqual(expect.arrayContaining(['clair', 'buns']));
    expect(passendeLieder(['mi', 'so'], 'dur')).toEqual([]);
  });

  it('wählt eine Runde ohne Wiederholung', () => {
    const runde = waehleLieder(LIEDER, 5);
    expect(new Set(runde.map((l) => l.id)).size).toBe(5);
    expect(waehleLieder(LIEDER.slice(0, 2), 5)).toHaveLength(2);
  });
});

describe('Notensatz', () => {
  const vorspann = () => 60;

  it('setzt ohne Rhythmus gleichmäßig in eine Zeile', () => {
    const z = gleichmaessig([{ id: 'do', dauer: 2 }, { id: 're', dauer: 2 }], 60);
    expect(z.noten.map((n) => n.x)).toEqual([60, 104]);
    expect(z.taktstriche).toEqual([]);
  });

  it('bricht nur an Taktgrenzen um und bleibt in der Zeilenbreite', () => {
    for (const l of LIEDER) {
      const zeilen = setzeTakte(takte(l), l.takt, 360, vorspann);
      expect(zeilen.flatMap((z) => z.noten).map((n) => n.index)).toEqual(ereignisse(l).map((_, i) => i));
      for (const z of zeilen) expect(z.ende).toBeLessThanOrEqual(360.001);
      expect(zeilen.length, l.id).toBeLessThanOrEqual(4);
    }
  });

  it('balkt Achtelpaare auf dem Schlag', () => {
    const jakob = LIEDER.find((l) => l.id === 'jakob')!;
    const zeilen = setzeTakte(takte(jakob), jakob.takt, 360, vorspann);
    const balken = zeilen.flatMap((z) => z.balken.map(([a]) => z.noten[a].index));
    expect(balken).toEqual([14, 16, 20, 22]);
  });

  it('balkt beim Auftakt von zwei Achteln das Paar', () => {
    const susanna = LIEDER.find((l) => l.id === 'susanna')!;
    const [erste] = setzeTakte(takte(susanna), susanna.takt, 360, vorspann);
    expect(erste.balken[0]).toEqual([0, 1]);
  });
});
