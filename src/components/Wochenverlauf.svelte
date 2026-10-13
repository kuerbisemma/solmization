<script lang="ts">
  import { UEBUNGEN, type Uebung, type Woche } from '../lib/statistik';
  import { T } from '../lib/texte';

  let { wochen }: { wochen: Woche[] } = $props();

  const B = 340;
  const H = 180;
  const RAND = { links: 34, rechts: 8, oben: 10, unten: 24 };
  const innenB = B - RAND.links - RAND.rechts;
  const innenH = H - RAND.oben - RAND.unten;

  const x = (i: number) => RAND.links + (wochen.length === 1 ? innenB / 2 : (i * innenB) / (wochen.length - 1));
  const y = (q: number) => RAND.oben + (1 - q) * innenH;
  const schritt = $derived(wochen.length > 1 ? innenB / (wochen.length - 1) : innenB);

  function datum(tag: number): string {
    const d = new Date(tag * 86_400_000);
    return `${d.getUTCDate()}.${d.getUTCMonth() + 1}.`;
  }

  /** Linienzüge je Übung; Wochen ohne Daten unterbrechen die Linie. */
  function pfad(u: Uebung): string {
    let d = '';
    let offen = false;
    wochen.forEach((w, i) => {
      const q = w.werte[u].quote;
      if (q === null) {
        offen = false;
        return;
      }
      d += `${offen ? 'L' : 'M'} ${x(i)} ${y(q)} `;
      offen = true;
    });
    return d;
  }

  const prozent = (q: number | null) => (q === null ? '–' : `${Math.round(q * 100)} %`);

  let hover = $state<number | null>(null);
  const tooltipLinks = $derived(hover === null ? 0 : (x(hover) / B) * 100);
</script>

<div class="legende" aria-hidden="true">
  {#each UEBUNGEN as u (u)}
    <span><i class="punkt {u}"></i>{T.uebungen[u].titel}</span>
  {/each}
</div>

<div class="diagramm">
  <svg viewBox="0 0 {B} {H}" aria-hidden="true">
    {#each [0, 0.5, 1] as q (q)}
      <line class="raster" x1={RAND.links} x2={B - RAND.rechts} y1={y(q)} y2={y(q)} />
      <text class="achse" x={RAND.links - 6} y={y(q) + 3.5} text-anchor="end">{q * 100} %</text>
    {/each}
    {#each wochen as w, i (w.beginn)}
      {#if i % 2 === (wochen.length - 1) % 2}
        <text class="achse" x={x(i)} y={H - 6} text-anchor="middle">{datum(w.beginn)}</text>
      {/if}
    {/each}
    {#if hover !== null}
      <line class="fadenkreuz" x1={x(hover)} x2={x(hover)} y1={RAND.oben} y2={RAND.oben + innenH} />
    {/if}
    {#each UEBUNGEN as u (u)}
      <path class="linie {u}" d={pfad(u)} />
      {#each wochen as w, i (w.beginn)}
        {#if w.werte[u].quote !== null}
          <circle class="markierung {u}" cx={x(i)} cy={y(w.werte[u].quote!)} r={hover === i ? 5.5 : 4} />
        {/if}
      {/each}
    {/each}
    {#each wochen as w, i (w.beginn)}
      <rect
        class="treffer"
        x={x(i) - schritt / 2}
        y={RAND.oben}
        width={schritt}
        height={innenH}
        role="presentation"
        onpointerenter={() => (hover = i)}
        onpointerleave={() => (hover = null)}
      />
    {/each}
  </svg>

  {#if hover !== null}
    {@const w = wochen[hover]}
    <div class="tooltip" style:left="{tooltipLinks}%" class:rechts={tooltipLinks > 60}>
      <strong>Woche ab {datum(w.beginn)}</strong>
      {#each UEBUNGEN as u (u)}
        <span><i class="punkt {u}"></i>{T.uebungen[u].titel}: {prozent(w.werte[u].quote)} ({T.statistik.anzahl(u, w.werte[u].folgen)})</span>
      {/each}
    </div>
  {/if}
</div>

<details>
  <summary>Als Tabelle anzeigen</summary>
  <table>
    <thead>
      <tr>
        <th scope="col">Woche ab</th>
        {#each UEBUNGEN as u (u)}<th scope="col">{T.uebungen[u].titel}</th>{/each}
      </tr>
    </thead>
    <tbody>
      {#each wochen as w (w.beginn)}
        <tr>
          <th scope="row">{datum(w.beginn)}</th>
          {#each UEBUNGEN as u (u)}
            <td>{prozent(w.werte[u].quote)} <span class="hinweis">({w.werte[u].folgen})</span></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</details>

<style>
  .legende {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    font-size: 0.9rem;
    margin-bottom: 6px;
  }
  .legende span,
  .tooltip span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .punkt {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
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
  .diagramm {
    position: relative;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .raster {
    stroke: var(--rand);
    stroke-width: 1;
  }
  .achse {
    font-size: 9px;
    fill: var(--text-leise);
    font-variant-numeric: tabular-nums;
  }
  .fadenkreuz {
    stroke: var(--text-leise);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }
  .linie {
    fill: none;
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
  .linie.handzeichen {
    stroke: var(--serie-handzeichen);
  }
  .linie.noten {
    stroke: var(--serie-noten);
  }
  .linie.lieder {
    stroke: var(--serie-lieder);
  }
  .markierung {
    stroke: var(--flaeche);
    stroke-width: 2;
  }
  .markierung.handzeichen {
    fill: var(--serie-handzeichen);
  }
  .markierung.noten {
    fill: var(--serie-noten);
  }
  .markierung.lieder {
    fill: var(--serie-lieder);
  }
  .treffer {
    fill: transparent;
  }
  .tooltip {
    position: absolute;
    top: 0;
    transform: translateX(8px);
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    background: var(--flaeche);
    border: 1px solid var(--rand);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
    font-size: 0.85rem;
    white-space: nowrap;
    pointer-events: none;
  }
  .tooltip.rechts {
    transform: translateX(calc(-100% - 8px));
  }
  details {
    margin-top: 8px;
    font-size: 0.9rem;
  }
  summary {
    cursor: pointer;
    color: var(--primaer);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
    font-variant-numeric: tabular-nums;
  }
  th,
  td {
    text-align: left;
    padding: 4px 6px;
    border-bottom: 1px solid var(--rand);
  }
</style>
