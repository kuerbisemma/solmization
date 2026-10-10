# PRD: solmization

| | |
|---|---|
| **Produkt** | solmization – Übungsseite für relative Solmisation und Handzeichen |
| **URL** | https://solmization.kalikoer.com |
| **Verantwortlich** | Johannes Golda (Privatperson, Chorleiter kalikoer) |
| **Status** | Entwurf v2 – auf die Übung „Zeichenfolge singen“ fokussiert |
| **Stand** | 2026-10-10 |

---

## 1. Zusammenfassung

solmization ist eine kleine, öffentlich zugängliche Website zum Üben der relativen Solmisation (Tonika-Do) und der zugehörigen Kodály-/Curwen-Handzeichen. Sie kommt ohne Login, ohne Cookies und ohne Tracking aus, funktioniert vollständig offline (PWA) und ist primär für das Smartphone gestaltet. Im Mittelpunkt steht eine einzige Übung: **Handzeichenfolgen vom Blatt singen** – so, wie sie eine Chorleitung zeigt. Nutzer:innen singen die Folge, hören sich die Lösung an und bewerten sich selbst.

Die Seite ist ein Hobbyprojekt („ein Projekt von kalikoer“) und orientiert sich gestalterisch an https://kalikoer.com.

## 2. Problem und Ziel

**Problem:** Wer im Chor oder Musikunterricht mit Solmisation arbeitet, hat außerhalb der Probe kaum Möglichkeiten, Silben, Handzeichen und das relative Hören gezielt und spielerisch zu üben. Vorhandene Angebote sind oft englischsprachig, nutzen andere Systeme (feste Solmisation, JaLe), erfordern Accounts oder sind werbefinanziert.

**Ziel:** Eine schlanke, datenfreie Übungsseite, mit der Selbstlernende **Handzeichenfolgen vom Blatt singen** üben – jederzeit, auch offline, ohne Anmeldung. Das ist die eigentliche Praxis im Chor; reines Erkennen oder Zuordnen von Zeichen und Silben wird bewusst nicht als eigene Übung angeboten (siehe Abschnitt 11). Zum Nachschlagen dienen Einführung und Handzeichen-Tafel.

## 3. Zielgruppe

- **Primär:** Jugendliche und Erwachsene (ab ca. 12 Jahren), die selbstständig üben – insbesondere Chorsänger:innen (z. B. kalikoer) und Musikschüler:innen.
- **Sekundär:** Musikpädagog:innen und Chorleiter:innen, die die Seite im Unterricht per Beamer/Bildschirm einsetzen.
- **Vorkenntnisse:** Keine zwingend; Neulinge steigen über Einführung und Handzeichen-Tafel ein.

## 4. Fachliche Grundlagen

### 4.1 System

- **Relative Solmisation (Tonika-Do):** do re mi fa so la ti; „do“ ist der Grundton der jeweiligen Dur-Tonart, „la“ der Grundton in Moll.
- **Handzeichen:** Kodály/Curwen.
- Silben, Handzeichen und Tonstufen werden als **Daten** modelliert (nicht im Code verstreut), damit spätere Systeme (z. B. JaLe) ergänzt werden können.

### 4.2 Tonvorrat (MVP)

- Diatonisch **Dur** und **natürliches Moll** (la-basiert).
- Oktavlagen: **tiefes so, · tiefes la, · tiefes ti,** bis **hohes do'**.
- Die Oktavlage ist Teil des Zeichens: „so,“ und „so“ unterscheiden sich durch die Höhe der Hand.
- Keine Chromatik im MVP.

### 4.3 Handzeichen (Referenz für die Illustrationen)

| Silbe | Zeichen | Höhe (relativ) |
|---|---|---|
| do | geschlossene Faust | Bauchhöhe |
| re | flache Hand, schräg nach oben geneigt, Handfläche nach unten | etwas höher |
| mi | flache Hand waagerecht, Handfläche nach unten | Brusthöhe |
| fa | Faust, Daumen zeigt nach unten | |
| so | flache Hand senkrecht, Handfläche zum Körper | Schulterhöhe |
| la | Hand locker vom Handgelenk herabhängend | Kinn-/Mundhöhe |
| ti | Faust, Zeigefinger schräg nach oben | Augenhöhe |
| do' | Faust (wie do) | Stirnhöhe |
| so, la, ti, | wie so/la/ti | unterhalb der Bauchhöhe |

Darstellung: **rechte Hand aus Sicht des Gegenübers** (wie bei einer Chorleitung), die **Höhenposition** ist sichtbar Teil der Grafik (z. B. Hand vor schematischer Körpersilhouette oder an einer Höhenskala).

### 4.4 Stufen (Presets)

Stufen sind Vorschläge in Kodály-Reihenfolge – **es gibt keine Sperren**, jede Stufe ist jederzeit wählbar.

| Stufe | Silben | Modus |
|---|---|---|
| 1 | so – mi | Dur |
| 2 | so – mi – la | Dur |
| 3 | do – mi – so – la | Dur |
| 4 | do – re – mi – so – la (Pentatonik) | Dur |
| 5 | + la, und so, | Dur |
| 6 | + do' | Dur |
| 7 | + fa | Dur |
| 8 | + ti (vollständige Dur-Tonleiter) | Dur |
| 9 | la-Pentatonik (la, do re mi so la) | Moll |
| 10 | natürliches Moll vollständig | Moll |

Zusätzlich gibt es eine **freie Auswahl**: Silben (inkl. Oktavlagen) einzeln an-/abwählen, Modus Dur/Moll wählen.

## 5. Funktionale Anforderungen

### 5.1 Einführung und Handzeichen-Tafel

- **F-1** Kurze Einführung: Was ist Solmisation, was bedeuten relative Silben, wie funktionieren Handzeichen und ihre Höhen.
- **F-2** Handzeichen-Tafel: alle Zeichen des Tonvorrats mit Silbe, in Höhenanordnung (tief unten, hoch oben).
- **F-3** Antippen eines Zeichens auf der Tafel spielt den zugehörigen Ton (in der aktuellen Stimmlage, Referenz-Tonart).

### 5.2 Übung „Zeichenfolge singen“

Einzige Übung der Seite. Ablauf einer Folge: Kadenz → Anfangston → Handzeichen erscheinen nacheinander, man singt mit → Lösung anhören (optional) → Selbstbewertung.

- **F-10** Vor dem Start wählt man Stufe bzw. freie Auswahl, Stimmlage und Tempo.
- **F-11** Eine Runde besteht aus **5 Folgen**; am Ende folgt eine Zusammenfassung (Anzahl richtig gesungener Folgen).
- **F-12** Folgenlänge **3–6 Zeichen**, abhängig von der Stufe (niedrige Stufen kürzer).
- **F-13** Zeichen erscheinen **nacheinander im einstellbaren Tempo** (40–120 Zeichen pro Minute, Standard 60) – wie eine dirigierende Chorleitung – und bleiben anschließend als Reihe stehen.
- **F-14** Folgen werden nach **Singbarkeitsregeln** generiert: überwiegend Schritte und kleine Sprünge, Beginn und Ende auf Tönen des Tonika-Dreiklangs, keine Tonwiederholung, keine Sprünge größer als eine Quinte.
- **F-15** Nach dem Singen: **„Lösung anhören“** spielt die Folge, synchron hervorgehoben; danach werden die Silben unter den Zeichen angezeigt. **„Anfangston“** ist wiederholbar.
- **F-16** **Selbstbewertung** („Richtig gesungen“ / „Nicht ganz“ / „Weiter ohne Bewertung“), die in die Statistik eingeht.

### 5.3 Klang

- **F-20** Pro Folge wird eine **zufällige Tonart** gewählt, so dass der gesamte aktive Tonvorrat in der gewählten Stimmlage liegt.
- **F-21** **Stimmlage** einstellbar: *hohe Stimme* / *tiefe Stimme* (Richtwert: hoch ca. A3–F5, tief eine Oktave darunter).
- **F-22** Vor jeder Folge erklingt eine **Kadenz** (I–IV–V–I in Dur, i–iv–V–i in Moll).
- **F-23** Audio startet erst nach einer Nutzerinteraktion (Browser-Vorgabe, insbesondere iOS).

### 5.4 Statistik und Speicherung

- **F-40** Gespeichert wird ausschließlich **lokal im Browser (localStorage)**: Einstellungen (Stimmlage, Tempo, zuletzt gewählte Stufe) und Statistik. Keine Daten verlassen das Gerät.
- **F-41** Statistik-Ansicht: **Quote richtig gesungener Folgen pro Silbe** (jede Silbe einer bewerteten Folge zählt mit).
- **F-42** **Zurücksetzen**-Button (mit Rückfrage).
- **F-43** Die Seite funktioniert vollständig, auch wenn localStorage nicht verfügbar ist (z. B. privater Modus) – dann ohne Speicherung.

### 5.5 Bedienung

- **F-50** Mobile-first, Touch-optimiert, Hochformat.
- **F-51** **Tastaturkürzel** auf dem Desktop: Leertaste startet die Folge, L = Lösung anhören, A = Anfangston, 1 = richtig gesungen, 2 = nicht ganz, 3 = weiter ohne Bewertung. Kürzel werden in der Oberfläche angezeigt.
- **F-52** Auf iOS: Hinweis „Kein Ton? Prüfe den Stummschalter“, falls Audio aktiv ist.

### 5.6 Statische Seiten

- **F-60** Impressum (verantwortlich: Johannes Golda als Privatperson).
- **F-61** Datenschutzerklärung (eigener VPS als Hoster, keine IP-Speicherung, keine Cookies, localStorage nur lokal).
- **F-62** Credits: Lizenzen der Klavier-Samples, Schriften und Handzeichen-Grafiken.
- **F-63** Alle diese Seiten sind auch offline verfügbar.

## 6. Nicht-funktionale Anforderungen

### 6.1 Technische Leitplanken

- **N-1** Statische Website ohne Backend; keine Framework-Vorgabe in diesem Dokument.
- **N-2** **PWA, vollständig offlinefähig**: Nach dem ersten Besuch funktionieren alle Seiten, Übungen, Grafiken, Schriften und Samples ohne Netz. Installierbar auf dem Homescreen.
- **N-3** **Update-Hinweis**: Liegt eine neue Version vor, erscheint „Neue Version verfügbar – neu laden“.
- **N-4** Browser-Support: jeweils die letzten zwei Versionen von Chrome/Edge, Firefox, Safari (macOS und **iOS**).
- **N-5** Klavier-Samples (frei lizenziert, z. B. Salamander Grand Piano, CC BY 3.0), schlank gehalten. Bis die Samples geladen sind, wird ein synthetischer Klang (Web Audio) als Fallback genutzt.
- **N-6** Alle Texte zentral gehalten (nicht im Markup verstreut), damit eine spätere Übersetzung möglich bleibt. Sprache im MVP: nur Deutsch.

### 6.2 Betrieb (eigener VPS)

Das Deployment übernimmt der Betreiber selbst und ist nicht Teil der Umsetzung. Die Anwendung stellt folgende Anforderungen an den Server:

- **N-10** **HTTPS** verpflichtend (Voraussetzung für Service Worker/PWA).
- **N-11** **Keine IP-Adressen in Server-Logs** (abgeschaltet oder anonymisiert).
- **N-12** **Caching-Header:** Assets mit Hash im Dateinamen langfristig cachen; `index.html`, Web-App-Manifest und Service Worker nicht cachen.
- **N-13** Der Build erzeugt ein Verzeichnis mit statischen Dateien, das ohne weitere Serverlogik ausgeliefert werden kann; eine Beispielkonfiguration für den Webserver wird im Repo dokumentiert.

### 6.3 Datenschutz

- **N-20** Keine Cookies, kein Tracking, keine externen Requests (Schriften, Samples und Grafiken werden selbst gehostet). Dadurch ist kein Cookie-Banner nötig.

### 6.4 Barrierefreiheit

- **N-30** Ziel **WCAG 2.1 AA** für alle Teile, die nicht inhärent auf Hören bzw. Sehen beruhen.
- **N-31** Vollständige Tastaturbedienung, sichtbarer Fokus.
- **N-32** Ausreichende Kontraste in Hell- und Dunkelmodus.
- **N-33** Alt-Texte für alle Handzeichen (Beschreibung von Form und Höhe).
- **N-34** `prefers-reduced-motion` wird respektiert (Animationen reduziert, Zeichen erscheinen ohne Bewegungseffekte).

### 6.5 Gestaltung

Orientierung an kalikoer.com:

- **Farben:** Teal `#275D6F` (Primär), Creme `#F4F1ED` (Hintergrund), Weiß, Dunkel `#1A2630`/`#0D1A22`, Akzent `#6FA8BE` (v. a. im Dunkelmodus), Hover `#1A3D4D`.
- **Schriften:** Roboto Slab (Überschriften, Schriftzug „solmization“ in Kleinbuchstaben), Rosario (Fließtext) – selbst gehostet.
- **Formen:** pillenförmige Buttons, abgerundete Ecken.
- **Tonalität:** locker, herzlich, Du-Ansprache.
- **Hell-/Dunkelmodus** nach Systemeinstellung.
- Dezenter Verweis „ein Projekt von kalikoer“ mit Link auf kalikoer.com.
- Markenname durchgängig **„solmization“**; in Fließtexten heißt das Fach korrekt „Solmisation“.

## 7. Inhalte und Lizenzen

| Inhalt | Herkunft | Lizenz |
|---|---|---|
| Quellcode | eigen | MIT |
| Handzeichen-SVGs | im Rahmen der Umsetzung erstellt, fachlich abgenommen durch Johannes Golda | CC BY 4.0 |
| Klavier-Samples | frei lizenziertes Sample-Set (z. B. Salamander Grand Piano) | gemäß Quelle (z. B. CC BY 3.0) |
| Schriften | Roboto Slab, Rosario | SIL Open Font License |

Das Repository ist öffentlich.

## 8. Erfolgskriterien

Da bewusst keine Nutzungsdaten erhoben werden, gilt die Seite als erfolgreich, wenn:

1. sie im Umfeld (insbesondere kalikoer) tatsächlich zum Üben genutzt wird und das qualitative Feedback positiv ist,
2. Lighthouse in **Performance, Barrierefreiheit und Best Practices jeweils ≥ 90** erreicht und die PWA-Kriterien (installierbar, offlinefähig) erfüllt sind,
3. alle Handzeichen, Silbenzuordnungen und Klänge **fachlich abgenommen** sind.

## 9. Akzeptanzkriterien (MVP)

- [ ] „Zeichenfolge singen“ ist mit allen 10 Stufen und der freien Auswahl spielbar.
- [ ] Jede Folge nutzt eine zufällige Tonart in der gewählten Stimmlage und beginnt mit Kadenz und Anfangston; Anfangston und Lösung sind wiederholbar.
- [ ] Oktavlagen (so, la, ti, do') sind über die Handhöhe erkennbar.
- [ ] Handzeichen-Tafel und Einführung sind vorhanden; Zeichen auf der Tafel erklingen beim Antippen.
- [ ] Statistik (Quote pro Silbe, Reset) funktioniert und bleibt nach Neuladen erhalten.
- [ ] Nach einmaligem Besuch funktioniert die Seite im Flugmodus vollständig, inklusive Klavierklang.
- [ ] Es werden keine Cookies gesetzt und keine externen Ressourcen geladen (prüfbar in den DevTools).
- [ ] Alle Funktionen sind per Tastatur bedienbar.
- [ ] Die Seite funktioniert auf aktuellem iOS Safari inklusive Audio.
- [ ] **Alle Handzeichen-SVGs sind von Johannes Golda fachlich abgenommen.**
- [ ] Impressum, Datenschutzerklärung und Credits sind vorhanden und offline erreichbar.

## 10. Risiken

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| Fehlerhafte Handzeichen-Illustrationen | untergräbt die fachliche Glaubwürdigkeit der ganzen Seite | Referenztabelle (4.3), frühe fachliche Abnahme vor der Übungsumsetzung |
| Audio auf iOS (Autoplay-Sperre, Stummschalter) | „Seite ist kaputt“-Eindruck | Audio-Start erst nach Interaktion, Stummschalter-Hinweis, frühes Testen auf echtem Gerät |
| Größe der Sample-Dateien | lange Erstladezeit, großer Offline-Cache | reduziertes Sample-Set (z. B. jede kleine Terz, Rest per Pitch-Shift), synthetischer Fallback |
| Veraltete Versionen durch Service-Worker-Caching | Nutzer:innen hängen auf alter Version fest | korrekte Caching-Header (N-12), Update-Hinweis (N-3) |

## 11. Außerhalb des Umfangs

**Bewusst gestrichen** (nach Sichtung der ersten Version als wenig sinnvoll bewertet):

- Zeichen → Silbe (Handzeichen erkennen)
- Silbe → Zeichen (Handzeichen zuordnen)
- Hören → Silbe (Ton relativ zur Tonika bestimmen)
- Hören → Zeichen

**Phase 2+:**


- Kamera-Erkennung der selbst ausgeführten Handzeichen
- Mikrofon-/Tonhöhenerkennung beim Singen
- Melodie-Diktat (Melodie hören → Silbenfolge eingeben)
- Chromatische Silben (di, ri, fi, si, ta, le …)
- Notenschrift im Liniensystem
- JaLe und weitere Solmisationssysteme
- Statistik-Verlauf über die Zeit, Export/Import des Fortschritts
- Mehrsprachigkeit
- Deployment-Automatisierung

## 12. Offene Punkte

- ~~Kadenz in Moll~~ → **entschieden:** i–iv–V–i mit Leitton „si“ nur in der Kadenz.
- ~~Sample-Set~~ → **entschieden:** Salamander Grand Piano V3 (CC BY 3.0), 18 Samples A1–C6 im Kleinterzabstand, ca. 1,4 MB.
- ~~Tempo-Bereich~~ → **entschieden:** 40–120 Zeichen pro Minute, Standard 60. Eine Runde umfasst 5 Folgen.
- **Stimmlagen-Grenzen** (F-21: hoch A3–F5, tief A2–F4) mit echten Stimmen im Chor gegenprüfen.
- **Impressum/Datenschutz:** Anschrift und E-Mail in `src/lib/betreiber.ts` eintragen.
