// Alle Oberflächentexte an einer Stelle (Grundlage für eine spätere Übersetzung).

export const T = {
  marke: 'solmization',
  claim: 'Handzeichen vom Blatt singen – ohne Anmeldung, auch offline.',
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
    ueben: 'Handzeichen erscheinen nacheinander – du singst sie vom Blatt.',
    statistik: 'Bei welchen Silben du schon sicher bist.',
  },

  auswahl: {
    titel: 'Zeichenfolge singen',
    text: 'Du hörst eine Kadenz und den Anfangston. Dann erscheinen Handzeichen nacheinander – sing sie mit und prüf dich anschließend selbst.',
    stufe: 'Stufe',
    frei: 'Freie Auswahl',
    freiHinweis: 'Mindestens zwei Silben wählen.',
    dur: 'Dur',
    moll: 'Moll',
    stimmlage: 'Stimmlage',
    hoch: 'hohe Stimme',
    tief: 'tiefe Stimme',
    tempo: 'Tempo',
    tempoEinheit: 'Zeichen pro Minute',
    los: 'Los geht’s',
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
    auswertung: 'Auswertung',
    ergebnis: (r: number, n: number) => `${r} von ${n} Folgen richtig gesungen`,
    nochmal: 'Neue Runde',
    zurAuswahl: 'Einstellungen ändern',
    tastenHinweis: 'Tasten: Leertaste startet, L = Lösung, A = Anfangston, 1 = richtig, 2 = nicht ganz, 3 = ohne Bewertung.',
  },

  statistik: {
    leer: 'Noch keine Daten – sing einfach los!',
    silbe: 'Silbe',
    quote: 'richtig gesungen',
    erklaerung: 'Jede Silbe einer bewerteten Folge zählt mit – so siehst du, bei welchen Tönen es noch hakt.',
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
