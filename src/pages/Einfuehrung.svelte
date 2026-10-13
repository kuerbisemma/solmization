<script lang="ts">
  import HandFigur from '../components/HandFigur.svelte';
  import { href } from '../lib/router.svelte';
</script>

<h1>Einführung</h1>

<h2>Was ist Solmisation?</h2>
<p>
  Bei der Solmisation singst du statt Notennamen Silben: <strong>do re mi fa so la ti</strong>. Wir verwenden die
  <strong>relative Solmisation</strong> (Tonika-Do): „do“ ist immer der Grundton der Tonart, in der du gerade singst. Ob das ein C,
  ein F oder ein As ist, spielt keine Rolle – entscheidend ist, wie die Töne zueinander klingen.
</p>
<p>
  Dadurch hat jede Silbe ihren eigenen Charakter: „do“ klingt nach Ankommen, „ti“ will unbedingt zum „do“ hinauf, „so“ ist stabil
  und hell. Diese Beziehungen trainierst du hier, indem du Handzeichen vom Blatt singst – so wie in der Chorprobe.
</p>

<h2>Dur und Moll</h2>
<p>
  In Dur ist „do“ der Grundton. In Moll ist es „la“ – die Silben bleiben gleich, nur der Ruhepunkt verschiebt sich. Deshalb klingt
  vor jeder Folge eine kurze <strong>Kadenz</strong> (eine Akkordfolge), die dir zeigt, wo „zu Hause“ ist.
</p>

<h2>Die Handzeichen</h2>
<div class="beispiel">
  <div class="figur"><HandFigur id="do" beschriftet /></div>
  <div class="figur"><HandFigur id="mi" beschriftet /></div>
  <div class="figur"><HandFigur id="so" beschriftet /></div>
</div>
<p>
  Zu jeder Silbe gehört ein Handzeichen nach Zoltán Kodály und John Curwen. Wichtig ist nicht nur die <strong>Form</strong> der Hand,
  sondern auch ihre <strong>Höhe</strong>: „do“ zeigst du auf Bauchhöhe, je höher der Ton, desto höher die Hand – bis zum hohen
  „do'“ auf Stirnhöhe. Tiefe Töne unter dem „do“ (so, la, ti mit Komma) liegen unterhalb des Bauchs.
</p>
<p>
  Die Bilder zeigen die <strong>rechte Hand, so wie du sie bei deiner Chorleitung siehst</strong>.
</p>

<h2>Schreibweise</h2>
<p>
  Ein Komma hinter der Silbe bedeutet „eine Oktave tiefer“ (<strong>so,</strong> = tiefes so), ein Strich bedeutet „eine Oktave
  höher“ (<strong>do'</strong> = hohes do).
</p>

<h2>Und mit Noten?</h2>
<p>
  In der Übung „Noten singen“ steht eine gleich gebaute Melodie in Notenschrift. Such zuerst anhand der Vorzeichen das do – danach
  denkst du in Silben weiter. Die Statistik stellt beide Übungen nebeneinander: So siehst du, ob dir die Solmisation beim
  Notensingen hilft.
</p>

<h2>Das Wichtigste: echte Musik auf Silben</h2>
<p>
  Am meisten bringt es, <strong>so viel Musik wie möglich auf Solmisationssilben</strong> zu singen. Nimm Lieder, die du schon
  kennst, und sing sie auf do-re-mi statt mit Text – so wird das System zu deinem eigenen. In der Übung
  „<a href={href('ueben')}>Lieder singen</a>“ bekommst du dafür bekannte Lieder vorgeschlagen und kannst danach die Lösung anhören.
</p>

<h2>So übst du</h2>
<ol>
  <li>Schau dir die <a href={href('tafel')}>Handzeichen-Tafel</a> an und hör dir die Töne an.</li>
  <li>Starte mit <a href={href('ueben')}>Stufe 1</a> (so – mi) und arbeite dich hoch – du kannst jederzeit springen.</li>
  <li>Sing laut mit, sobald die Zeichen erscheinen – auch wenn niemand zuhört. 🙂</li>
  <li>Hör dir danach die Lösung an und sei ehrlich zu dir: Die Statistik zeigt dir, bei welchen Silben es noch hakt.</li>
  <li>Sing zwischendurch Lieder, die du kennst, auf Silben – in der App und auch einfach so im Alltag.</li>
</ol>

<style>
  .beispiel {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 120px));
    gap: 12px;
  }
</style>
