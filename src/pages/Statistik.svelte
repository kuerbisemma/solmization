<script lang="ts">
  import { quote } from '../lib/statistik';
  import { T } from '../lib/texte';
  import { SILBEN } from '../lib/theorie';
  import { setzeStatistikZurueck, statistik } from '../lib/zustand.svelte';

  const zeilen = $derived([...SILBEN].reverse().filter((s) => statistik.wert.treffer[s.id]?.gesamt));

  function stufe(q: number | null): string {
    if (q === null) return '';
    return q >= 0.8 ? 'gut' : q >= 0.5 ? 'mittel' : 'schwach';
  }

  function zuruecksetzen() {
    if (confirm(T.statistik.sicher)) setzeStatistikZurueck();
  }
</script>

<h1>{T.nav.statistik}</h1>
<p class="hinweis">{T.statistik.hinweis}</p>

{#if zeilen.length === 0}
  <p>{T.statistik.leer}</p>
{:else}
  <p>{T.statistik.erklaerung}</p>
  <ul class="karte liste">
    {#each zeilen as s (s.id)}
      {@const z = statistik.wert.treffer[s.id]!}
      {@const q = quote(z) ?? 0}
      <li>
        <span class="silbe"><span aria-hidden="true">{s.id}</span><span class="nur-sr">{s.gesprochen}</span></span>
        <span class="balken" aria-hidden="true"><span class={stufe(q)} style:width="{Math.round(q * 100)}%"></span></span>
        <span class="wert">{Math.round(q * 100)} % <span class="hinweis">({z.richtig}/{z.gesamt})</span></span>
      </li>
    {/each}
  </ul>
{/if}

<p><button type="button" class="knopf leise" onclick={zuruecksetzen}>{T.statistik.zuruecksetzen}</button></p>

<style>
  .liste {
    list-style: none;
    margin: 0 0 16px;
    padding: 12px 16px;
  }
  li {
    display: grid;
    grid-template-columns: 3ch 1fr auto;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
    font-variant-numeric: tabular-nums;
  }
  .silbe {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    color: var(--primaer);
  }
  .balken {
    height: 10px;
    border-radius: 5px;
    background: var(--rand);
    overflow: hidden;
  }
  .balken span {
    display: block;
    height: 100%;
    background: var(--primaer);
  }
  .balken .gut {
    background: var(--richtig);
  }
  .balken .schwach {
    background: var(--falsch);
  }
  .wert {
    min-width: 9ch;
    text-align: right;
  }
</style>
