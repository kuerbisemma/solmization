import { describe, expect, it } from 'vitest';
import { gesamt, leereStatistik, migriere, proSilbe, verbuche, verdichte, wochenbeginn, wochenverlauf } from '../statistik';

const MONTAG = wochenbeginn(20_000);

describe('Statistik', () => {
  it('zählt silbengewichtet je Übung', () => {
    let s = leereStatistik();
    s = verbuche(s, { tag: MONTAG, uebung: 'noten', silben: ['do', 'mi', 'so'], richtig: true });
    s = verbuche(s, { tag: MONTAG, uebung: 'noten', silben: ['so', 'mi'], richtig: false });
    expect(gesamt(s, 'noten')).toEqual({ richtig: 3, gesamt: 5 });
    expect(proSilbe(s, 'noten').so).toEqual({ richtig: 1, gesamt: 2 });
    expect(gesamt(s, 'handzeichen')).toEqual({ richtig: 0, gesamt: 0 });
  });

  it('übernimmt Daten aus Version 2 als Handzeichen-Summen', () => {
    const s = migriere({ treffer: { so: { richtig: 2, gesamt: 3 } } });
    expect(s.version).toBe(3);
    expect(proSilbe(s, 'handzeichen').so).toEqual({ richtig: 2, gesamt: 3 });
    expect(wochenverlauf(s, 4).every((w) => w.werte.handzeichen.folgen === 0)).toBe(true);
  });

  it('erkennt den Montag als Wochenbeginn', () => {
    expect(new Date(wochenbeginn(20_000) * 86_400_000).getUTCDay()).toBe(1);
  });

  it('liefert Wochenwerte mit Anzahl der Folgen', () => {
    let s = leereStatistik();
    s = verbuche(s, { tag: MONTAG + 2, uebung: 'handzeichen', silben: ['do', 're'], richtig: true });
    s = verbuche(s, { tag: MONTAG - 3, uebung: 'handzeichen', silben: ['do', 're'], richtig: false });
    const [vorher, diese] = wochenverlauf(s, 2, MONTAG + 4);
    expect(diese.werte.handzeichen).toEqual({ quote: 1, folgen: 1 });
    expect(vorher.werte.handzeichen).toEqual({ quote: 0, folgen: 1 });
    expect(diese.werte.noten).toEqual({ quote: null, folgen: 0 });
  });

  it('verdichtet Einträge älter als 52 Wochen, ohne Quoten zu verändern', () => {
    let s = leereStatistik();
    s = verbuche(s, { tag: MONTAG - 60 * 7, uebung: 'noten', silben: ['la'], richtig: true });
    s = verbuche(s, { tag: MONTAG, uebung: 'noten', silben: ['la'], richtig: false });
    const v = verdichte(s, MONTAG);
    expect(v.eintraege).toHaveLength(1);
    expect(proSilbe(v, 'noten').la).toEqual({ richtig: 1, gesamt: 2 });
  });
});
