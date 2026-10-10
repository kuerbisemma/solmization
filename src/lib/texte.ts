// Alle Oberflächentexte an einer Stelle (Grundlage für eine spätere Übersetzung).

import type { UebungsTyp } from './statistik';

export const T = {
  marke: 'solmization',
  claim: 'Solmisation und Handzeichen üben – ohne Anmeldung, auch offline.',
  projektVon: 'ein Projekt von',

  nav: {
    start: 'Start',
    einfuehrung: 'Einführung',
    tafel: 'Handzeichen-Tafel',
    ueben: 'Üben',
    statistik: 'Statistik',
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
    credits: 'Credits',
    zurueck: 'Zurück',
  },

  start: {
    einfuehrung: 'Neu hier? Was Solmisation ist und wie die Handzeichen funktionieren.',
    tafel: 'Alle Handzeichen auf einen Blick – antippen zum Anhören.',
    ueben: 'Zeichen erkennen, Töne hören, Folgen singen.',
    statistik: 'Wo du sicher bist und was du noch verwechselst.',
  },

  uebungen: {
    'zeichen-silbe': { titel: 'Zeichen → Silbe', text: 'Du siehst ein Handzeichen und wählst die Silbe.' },
    'silbe-zeichen': { titel: 'Silbe → Zeichen', text: 'Du siehst eine Silbe und wählst das Handzeichen.' },
    'hoeren-silbe': { titel: 'Hören → Silbe', text: 'Du hörst einen Ton und bestimmst die Silbe.' },
    'hoeren-zeichen': { titel: 'Hören → Zeichen', text: 'Du hörst einen Ton und wählst das Handzeichen.' },
    singen: { titel: 'Zeichenfolge singen', text: 'Du singst eine Folge von Handzeichen und prüfst dich selbst.' },
  } satisfies Record<UebungsTyp, { titel: string; text: string }>,

  auswahl: {
    uebung: 'Übung',
    stufe: 'Stufe',
    frei: 'Freie Auswahl',
    freiHinweis: 'Mindestens zwei Silben wählen.',
    dur: 'Dur',
    moll: 'Moll',
    stimmlage: 'Stimmlage',
    hoch: 'hohe Stimme',
    tief: 'tiefe Stimme',
    tempo: 'Tempo beim Singen',
    tempoEinheit: 'Zeichen pro Minute',
    los: 'Los geht’s',
  },

  runde: {
    aufgabe: (n: number, von: number) => `Aufgabe ${n} von ${von}`,
    frageZeichen: 'Welche Silbe ist das?',
    frageSilbe: 'Welches Handzeichen gehört dazu?',
    frageHoeren: 'Welcher Ton war das?',
    orientierung: 'Orientierung',
    tonWiederholen: 'Ton nochmal',
    starten: 'Ton abspielen',
    richtig: 'Richtig!',
    falsch: (soll: string) => `Nicht ganz – richtig ist ${soll}.`,
    deineAntwort: 'deine Antwort',
    weiter: 'Weiter',
    auswertung: 'Auswertung',
    ergebnis: (r: number, n: number) => `${r} von ${n} richtig`,
    fehler: 'Daran kannst du noch arbeiten:',
    fehlerfrei: 'Fehlerfrei – stark! 🎉',
    nochmal: 'Neue Runde',
    zurAuswahl: 'Andere Übung',
    tastenHinweis: 'Tasten: Ziffern für Antworten, Leertaste für weiter.',
    tastenHinweisHoeren: 'Tasten: Ziffern für Antworten, Leertaste für weiter, O für Orientierung, W für Ton.',
  },

  singen: {
    folge: (n: number, von: number) => `Folge ${n} von ${von}`,
    anleitung: 'Hör die Orientierung und den Anfangston, dann sing die Zeichen mit, sobald sie erscheinen.',
    start: 'Folge starten',
    anfangston: 'Anfangston',
    loesung: 'Lösung anhören',
    frageSelbst: 'Wie lief’s?',
    gut: 'Richtig gesungen',
    nichtGanz: 'Nicht ganz',
    ohneBewertung: 'Weiter ohne Bewertung',
    ergebnis: (r: number, n: number) => `${r} von ${n} Folgen richtig gesungen`,
  },

  statistik: {
    leer: 'Noch keine Daten – leg einfach los!',
    silbe: 'Silbe',
    verwechslungen: 'Häufigste Verwechslungen',
    keineVerwechslungen: 'Bisher keine Verwechslungen.',
    mal: (n: number) => `${n}×`,
    zuruecksetzen: 'Statistik zurücksetzen',
    sicher: 'Statistik wirklich löschen?',
    hinweis: 'Die Statistik liegt nur in diesem Browser auf diesem Gerät.',
  },

  tafel: {
    hinweis: 'Antippen spielt den Ton (do = c). Die Höhe der Hand gehört zum Zeichen.',
  },

  ios: 'Kein Ton? Prüfe den Stummschalter deines iPhones.',
  update: 'Neue Version verfügbar.',
  neuLaden: 'Neu laden',
  offlineBereit: 'solmization funktioniert jetzt auch offline.',
};
