<script lang="ts">
  import { BETREIBER } from '../lib/betreiber';
</script>

<h1>Impressum</h1>

<h2>Angaben gemäß § 5 DDG</h2>
<p>
  {BETREIBER.name}<br />
  {BETREIBER.strasse}<br />
  {BETREIBER.ort}
</p>

<h2>Kontakt</h2>
<p>E-Mail: {BETREIBER.email}</p>

<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>{BETREIBER.name}, Anschrift wie oben</p>

<h2>Haftung für Links</h2>
<p>
  Diese Seite enthält Links zu externen Websites, auf deren Inhalte ich keinen Einfluss habe. Für die Inhalte der verlinkten Seiten
  ist stets der jeweilige Anbieter verantwortlich.
</p>
