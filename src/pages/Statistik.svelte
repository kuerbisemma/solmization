<script lang="ts">
  import Wochenverlauf from '../components/Wochenverlauf.svelte';
  import { gesamt, proSilbe, quote, SILBEN_UEBUNGEN, silbenMitDaten, UEBUNGEN, wochenverlauf } from '../lib/statistik';
  import { T } from '../lib/texte';
  import { silbe } from '../lib/theorie';
  import { setzeStatistikZurueck, statistik } from '../lib/zustand.svelte';

  const VERLAUF_WOCHEN = 12;

  const zeilen = $derived(silbenMitDaten(statistik.wert));
  const proUebung = $derived({
    handzeichen: proSilbe(statistik.wert, 'handzeichen'),
    noten: proSilbe(statistik.wert, 'noten'),
  });
  const hatDaten = $derived(UEBUNGEN.some((u) => gesamt(statistik.wert, u).gesamt > 0));
  const wochen = $derived(wochenverlauf(statistik.wert, VERLAUF_WOCHEN));
  const hatVerlauf = $derived(wochen.some((w) => UEBUNGEN.some((u) => w.werte[u].folgen > 0)));

  const prozent = (q: number | null) => (q === null ? '–' : `${Math.round(q * 100)} %`);

  function zuruecksetzen() {
    if (confirm(T.statistik.sicher)) setzeStatistikZurueck();
  }
</script>

<h1>{T.nav.statistik}</h1>
<p class="hinweis">{T.statistik.hinweis}</p>

{#if !hatDaten}
  <p>{T.statistik.leer}</p>
{:else}
  <h2>{T.statistik.gesamt}</h2>
  <div class="kacheln">
    {#each UEBUNGEN as u (u)}
      {@const z = gesamt(statistik.wert, u)}
      <div class="karte kachel">
        <span class="kachel-titel"><i class="punkt {u}"></i>{T.uebungen[u].titel}</span>
        <span class="zahl">{prozent(quote(z))}</span>
        <span class="hinweis">{z.gesamt > 0 ? T.statistik.vonGesamt(u, z.richtig, z.gesamt) : T.statistik.keineDaten}</span>
      </div>
    {/each}
  </div>

  {#if hatVerlauf}
    <h2>{T.statistik.verlauf}</h2>
    <div class="karte">
      <Wochenverlauf {wochen} />
    </div>
    <p class="hinweis">{T.statistik.verlaufHinweis}</p>
  {/if}

  {#if zeilen.length > 0}
  <h2>{T.statistik.silben}</h2>
  <p>{T.statistik.erklaerung} {T.statistik.silbenHinweis}</p>
  <ul class="karte liste">
    {#each zeilen as id (id)}
      <li>
        <span class="silbe"><span aria-hidden="true">{id}</span><span class="nur-sr">{silbe(id).gesprochen}</span></span>
        <span class="balken">
          {#each SILBEN_UEBUNGEN as u (u)}
            {@const z = proUebung[u][id]}
            {@const q = quote(z)}
            <span class="zeile">
              <span class="spur" aria-hidden="true"><span class={u} style:width="{Math.round((q ?? 0) * 100)}%"></span></span>
              <span class="wert">
                <span class="nur-sr">{T.uebungen[u].titel}:</span>
                {prozent(q)}{#if z}&nbsp;<span class="hinweis">({z.richtig}/{z.gesamt})</span>{/if}
              </span>
            </span>
          {/each}
        </span>
      </li>
    {/each}
  </ul>
  <div class="legende" aria-hidden="true">
    {#each SILBEN_UEBUNGEN as u (u)}<span><i class="punkt {u}"></i>{T.uebungen[u].titel}</span>{/each}
  </div>
  {/if}
{/if}

<p><button type="button" class="knopf leise" onclick={zuruecksetzen}>{T.statistik.zuruecksetzen}</button></p>

<style>
  .kacheln {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }
  .kachel {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .kachel-titel {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    font-size: 0.9rem;
  }
  .zahl {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 2rem;
    color: var(--text);
  }
  .punkt {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex: none;
  }
  .punkt.handzeichen {
    background: var(--serie-handzeichen);
  }
  .punkt.noten {
    background: var(--serie-noten);
  }
  .punkt.lieder {
    background: var(--serie-lieder);
  }
  .liste {
    list-style: none;
    margin: 0 0 8px;
    padding: 8px 16px;
  }
  li {
    display: grid;
    grid-template-columns: 3ch 1fr;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
    border-bottom: 1px solid var(--rand);
  }
  li:last-child {
    border-bottom: 0;
  }
  .silbe {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    color: var(--primaer);
  }
  .balken {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .zeile {
    display: grid;
    grid-template-columns: 1fr 11ch;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
  }
  .spur {
    height: 8px;
    border-radius: 4px;
    background: color-mix(in srgb, var(--rand) 60%, transparent);
    overflow: hidden;
  }
  .spur span {
    display: block;
    height: 100%;
    border-radius: 4px;
  }
  .spur .handzeichen {
    background: var(--serie-handzeichen);
  }
  .spur .noten {
    background: var(--serie-noten);
  }
  .wert {
    text-align: right;
  }
  .legende {
    display: flex;
    gap: 16px;
    font-size: 0.9rem;
    margin-bottom: 16px;
  }
  .legende span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
</style>
