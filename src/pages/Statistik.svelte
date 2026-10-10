<script lang="ts">
  import { haeufigsteVerwechslungen, quote, type UebungsTyp } from '../lib/statistik';
  import { T } from '../lib/texte';
  import { SILBEN } from '../lib/theorie';
  import { setzeStatistikZurueck, statistik } from '../lib/zustand.svelte';

  const TYPEN = Object.keys(T.uebungen) as UebungsTyp[];
  const KURZ: Record<UebungsTyp, string> = {
    'zeichen-silbe': 'Z→S',
    'silbe-zeichen': 'S→Z',
    'hoeren-silbe': 'H→S',
    'hoeren-zeichen': 'H→Z',
    singen: 'Singen',
  };

  const zeilen = $derived(
    [...SILBEN].reverse().filter((s) => TYPEN.some((t) => statistik.wert.treffer[t]?.[s.id]?.gesamt)),
  );
  const verwechslungen = $derived(haeufigsteVerwechslungen(statistik.wert));

  function prozent(q: number | null): string {
    return q === null ? '–' : `${Math.round(q * 100)} %`;
  }

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
  <div class="karte tabelle-huelle">
    <table>
      <caption class="nur-sr">Trefferquote pro Silbe und Übung</caption>
      <thead>
        <tr>
          <th scope="col">{T.statistik.silbe}</th>
          {#each TYPEN as t (t)}<th scope="col"><abbr title={T.uebungen[t].titel}>{KURZ[t]}</abbr></th>{/each}
        </tr>
      </thead>
      <tbody>
        {#each zeilen as s (s.id)}
          <tr>
            <th scope="row"><span aria-hidden="true">{s.id}</span><span class="nur-sr">{s.gesprochen}</span></th>
            {#each TYPEN as t (t)}
              {@const z = statistik.wert.treffer[t]?.[s.id]}
              {@const q = quote(z)}
              <td class={stufe(q)} title={z ? `${z.richtig} von ${z.gesamt}` : undefined}>{prozent(q)}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <p class="hinweis">
    {#each TYPEN as t, i (t)}{KURZ[t]} = {T.uebungen[t].titel}{i < TYPEN.length - 1 ? ' · ' : ''}{/each}
  </p>
{/if}

<h2>{T.statistik.verwechslungen}</h2>
{#if verwechslungen.length === 0}
  <p>{T.statistik.keineVerwechslungen}</p>
{:else}
  <ol>
    {#each verwechslungen as v (v.paar.join())}
      <li><strong>{v.paar[0]} ↔ {v.paar[1]}</strong> ({T.statistik.mal(v.anzahl)})</li>
    {/each}
  </ol>
{/if}

<p><button type="button" class="knopf leise" onclick={zuruecksetzen}>{T.statistik.zuruecksetzen}</button></p>

<style>
  .tabelle-huelle {
    overflow-x: auto;
    padding: 8px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }
  th,
  td {
    padding: 6px 4px;
    text-align: center;
    border-bottom: 1px solid var(--rand);
    white-space: nowrap;
  }
  th[scope='row'] {
    font-family: 'Roboto Slab', Georgia, serif;
    color: var(--primaer);
  }
  abbr {
    text-decoration: none;
  }
  td.gut {
    color: var(--richtig);
    font-weight: 700;
  }
  td.schwach {
    color: var(--falsch);
    font-weight: 700;
  }
</style>
