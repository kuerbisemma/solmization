<script lang="ts">
  import { hilfslinien, note, position, tonartVonDo, vorzeichenPositionen, vorzeichenText, type Schluessel } from '../lib/noten';
  import type { SilbenId } from '../lib/theorie';

  let {
    folge,
    doMidi,
    schluessel,
    aktiv = null,
    silbenZeigen = false,
  }: {
    folge: SilbenId[];
    doMidi: number;
    schluessel: Schluessel;
    /** Index der hervorgehobenen Note */
    aktiv?: number | null;
    silbenZeigen?: boolean;
  } = $props();

  // Maße in SVG-Einheiten: Linienabstand 10, eine Position (Linie/Zwischenraum) = 5.
  const ABSTAND = 10;
  const HALB = ABSTAND / 2;
  const NOTENABSTAND = 44;
  const KOPF = 11.8; // Breite des Notenkopfs (1,18 Linienabstände)
  const HALS = 35;

  // SMuFL-Zeichen der Notenschrift „Solmi Noten“ (Auszug aus Bravura)
  const GLYPHE = {
    violin: '',
    tenor: '',
    bass: '',
    kreuz: '',
    be: '',
    kopf: '',
  };
  const NAMEN: Record<Schluessel, string> = { violin: 'Violinschlüssel', tenor: 'Violinschlüssel oktaviert', bass: 'Bassschlüssel' };

  const tonart = $derived(tonartVonDo(doMidi));
  const vorzeichen = $derived(vorzeichenPositionen(tonart, schluessel));
  const noten = $derived(folge.map((id) => ({ id, pos: position(note(doMidi, id), schluessel) })));

  const obersterPunkt = $derived(Math.max(10, ...noten.map((n) => n.pos + (n.pos < 4 ? HALS / HALB : 0) + 1)));
  const untersterPunkt = $derived(Math.min(-3, ...noten.map((n) => n.pos - (n.pos >= 4 ? HALS / HALB : 0) - 1)));
  const oben = 6;
  const y = (pos: number) => oben + (obersterPunkt - pos) * HALB;
  const silbenZeile = $derived(y(untersterPunkt) + 16);
  const hoehe = $derived(silbenZeile + (silbenZeigen ? 10 : 0) + 4);

  const xVorzeichen = 40;
  const xNoten = $derived(xVorzeichen + vorzeichen.length * 10 + 16);
  const breite = $derived(xNoten + noten.length * NOTENABSTAND + 6);
  const xNote = (i: number) => xNoten + i * NOTENABSTAND;

  const beschreibung = $derived(`Melodie mit ${folge.length} Noten, ${NAMEN[schluessel]}, ${vorzeichenText(tonart)}`);
</script>

<svg class="notenzeile" viewBox="0 0 {breite} {hoehe}" role="img" aria-label={beschreibung}>
  {#each [0, 2, 4, 6, 8] as p (p)}
    <line class="linie" x1="0" x2={breite - 6} y1={y(p)} y2={y(p)} />
  {/each}
  <!-- Schlussstrich -->
  <line class="linie" x1={breite - 10} x2={breite - 10} y1={y(8)} y2={y(0)} />
  <line class="schluss" x1={breite - 4} x2={breite - 4} y1={y(8)} y2={y(0)} />

  <text class="glyphe" x="4" y={y(schluessel === 'bass' ? 6 : 2)}>{GLYPHE[schluessel]}</text>
  {#each vorzeichen as p, i (i)}
    <text class="glyphe" x={xVorzeichen + i * 10} y={y(p)}>{tonart.vorzeichen > 0 ? GLYPHE.kreuz : GLYPHE.be}</text>
  {/each}

  {#each noten as n, i (i)}
    {@const x = xNote(i)}
    {#if aktiv === i}
      <rect class="marke" x={x - 8} y={y(8) - 14} width={KOPF + 16} height={y(0) - y(8) + 28} rx="6" />
    {/if}
    {#each hilfslinien(n.pos) as p (p)}
      <line class="linie" x1={x - 4} x2={x + KOPF + 4} y1={y(p)} y2={y(p)} />
    {/each}
    <text class="glyphe" {x} y={y(n.pos)}>{GLYPHE.kopf}</text>
    {#if n.pos >= 4}
      <line class="hals" x1={x + 0.6} x2={x + 0.6} y1={y(n.pos) + 1.7} y2={y(n.pos) + HALS} />
    {:else}
      <line class="hals" x1={x + KOPF - 0.6} x2={x + KOPF - 0.6} y1={y(n.pos) - 1.7} y2={y(n.pos) - HALS} />
    {/if}
    {#if silbenZeigen}
      <text class="silbe" x={x + KOPF / 2} y={silbenZeile}>{n.id}</text>
    {/if}
  {/each}
</svg>

<style>
  .notenzeile {
    display: block;
    width: 100%;
    max-width: 560px;
    height: auto;
    margin: 0 auto;
    color: var(--text);
  }
  .linie {
    stroke: currentColor;
    stroke-width: 1.1;
  }
  .schluss {
    stroke: currentColor;
    stroke-width: 4;
  }
  .hals {
    stroke: currentColor;
    stroke-width: 1.2;
  }
  .glyphe {
    font-family: 'Solmi Noten';
    font-size: 40px;
    fill: currentColor;
  }
  .marke {
    fill: color-mix(in srgb, var(--primaer) 18%, transparent);
  }
  .silbe {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 11px;
    text-anchor: middle;
    fill: var(--primaer);
  }
</style>
