// Alle Oberflächentexte an einer Stelle (Grundlage für eine spätere Übersetzung).

export const T = {
  marke: 'solmization',
  claim: 'Handzeichen und Noten vom Blatt singen, Lieder auf Silben umsingen – ohne Anmeldung, auch offline.',
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
    ueben: 'Handzeichen oder Noten vom Blatt singen – oder bekannte Lieder auf Silben.',
    statistik: 'Wie sicher du bist – und ob dir die Solmisation beim Notensingen hilft.',
  },

  uebungen: {
    handzeichen: {
      titel: 'Handzeichen singen',
      text: 'Handzeichen erscheinen nacheinander – sing sie mit, wie in der Chorprobe.',
      anleitung: 'Hör die Orientierung und den Anfangston, dann sing die Zeichen mit, sobald sie erscheinen.',
    },
    noten: {
      titel: 'Noten singen',
      text: 'Dieselbe Art Melodie in Notenschrift. So siehst du, ob dir die Solmisation beim Notensingen hilft.',
      anleitung: 'Hör die Orientierung und den Anfangston, dann sing die Noten im Tempo der Markierung. Tipp: Such zuerst das do.',
    },
    lieder: {
      titel: 'Lieder singen',
      text: 'Sing Lieder, die du kennst, auf do-re-mi – mit den Noten vor Augen.',
      anleitung: 'Hör die Orientierung und den Anfangston, dann sing das Lied auf Silben. Die Lösung zeigt dir die Silben unter den Noten.',
    },
  },

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
    tempo: 'Tempo',
    tempoEinheit: 'Töne pro Minute',
    schluessel: 'Notenschlüssel',
    schluesselNamen: { violin: 'Violin', tenor: 'Violin oktaviert (Tenor)', bass: 'Bass' },
    schluesselHinweis: 'Der Schlüssel legt auch die Stimmlage fest: Violin für hohe Stimmen, Violin oktaviert und Bass für tiefe.',
    vorzeichen: 'Vorzeichen',
    vorzeichenNamen: { 0: 'nur C-Dur / a-Moll', 2: 'bis 2', 4: 'bis 4', 6: 'bis 6' },
    los: 'Los geht’s',
    lieder: (n: number) => (n === 1 ? '1 Lied passt zu dieser Auswahl.' : `${n} Lieder passen zu dieser Auswahl.`),
    keineLieder: 'Zu dieser Auswahl gibt es noch kein Lied. Wähl eine höhere Stufe oder mehr Silben.',
    liedTempo: 'Jedes Lied klingt in seinem eigenen Tempo.',
  },

  singen: {
    folge: (n: number, von: number) => `Folge ${n} von ${von}`,
    start: 'Folge starten',
    anfangston: 'Anfangston',
    loesung: 'Lösung anhören',
    frageSelbst: 'Wie lief’s?',
    gut: 'Richtig gesungen',
    nichtGanz: 'Nicht ganz',
    ohneBewertung: 'Weiter ohne Bewertung',
    auswertung: 'Auswertung',
    ergebnis: (r: number, n: number) => `${r} von ${n} richtig gesungen`,
    nochmal: 'Neue Runde',
    zurAuswahl: 'Einstellungen ändern',
    tastenHinweis: 'Tasten: Leertaste startet, L = Lösung, A = Anfangston, 1 = richtig, 2 = nicht ganz, 3 = ohne Bewertung.',
  },

  lieder: {
    lied: (n: number, von: number) => `Lied ${n} von ${von}`,
    start: 'Lied starten',
    vorspielen: 'Melodie vorspielen',
    kenneIchNicht: 'Kenne ich nicht',
    jetztSingen: 'Jetzt sing das Lied auf Silben – im eigenen Tempo.',
    beginnt: (silbe: string) => `Beginnt auf ${silbe}.`,
    tastenHinweis:
      'Tasten: Leertaste startet, V = Melodie vorspielen, K = kenne ich nicht, L = Lösung, A = Anfangston, 1 = richtig, 2 = nicht ganz, 3 = ohne Bewertung.',
  },

  statistik: {
    leer: 'Noch keine Daten – sing einfach los!',
    gesamt: 'Gesamtquote',
    keineDaten: 'noch keine Daten',
    silben: 'Pro Silbe',
    verlauf: 'Verlauf pro Woche',
    verlaufHinweis: 'Liegt „Noten singen“ mit der Zeit näher an „Handzeichen singen“, hilft dir die Solmisation beim Notensingen.',
    anzahl: (u: 'handzeichen' | 'noten' | 'lieder', n: number) =>
      u === 'lieder' ? `${n} ${n === 1 ? 'Lied' : 'Lieder'}` : `${n} ${n === 1 ? 'Folge' : 'Folgen'}`,
    vonGesamt: (u: 'handzeichen' | 'noten' | 'lieder', r: number, n: number) =>
      u === 'lieder' ? `${r} von ${n} Liedern` : `${r} von ${n} Tönen`,
    silbenHinweis: '„Lieder singen“ wird je Lied bewertet und zählt hier nicht mit.',
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
