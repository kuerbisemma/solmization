<script lang="ts">
  import { tasteFuer, type Bewertung } from '../lib/tasten';
  import { silbe, type SilbenId } from '../lib/theorie';
  import HandFigur from './HandFigur.svelte';

  let {
    optionen,
    art,
    bewertung,
    onwahl,
  }: {
    /** von tief nach hoch sortiert */
    optionen: SilbenId[];
    art: 'silbe' | 'zeichen';
    bewertung: Bewertung;
    onwahl: (id: SilbenId) => void;
  } = $props();

  // Höchster Ton oben – wie die Handhöhe.
  const vonOben = $derived([...optionen].reverse());

  function zustand(id: SilbenId): 'richtig' | 'falsch' | '' {
    if (!bewertung) return '';
    if (id === bewertung.soll) return 'richtig';
    if (id === bewertung.gewaehlt) return 'falsch';
    return '';
  }
</script>

<ul class="leiter {art}" aria-label="Antworten, höchster Ton oben">
  {#each vonOben as id (id)}
    {@const z = zustand(id)}
    <li>
      <button
        type="button"
        class="antwort {z}"
        disabled={bewertung !== null}
        aria-label={art === 'silbe' ? silbe(id).gesprochen : undefined}
        onclick={() => onwahl(id)}
      >
        {#if art === 'silbe'}
          <span class="silbe">{id}</span>
        {:else}
          <span class="figur"><HandFigur {id} /></span>
        {/if}
        {#if z === 'richtig'}<span class="marke" aria-hidden="true">✓</span>{/if}
        {#if z === 'falsch'}<span class="marke" aria-hidden="true">✗</span>{/if}
        <kbd class="nur-tastatur" aria-hidden="true">{tasteFuer(optionen.indexOf(id))}</kbd>
      </button>
    </li>
  {/each}
</ul>

<style>
  .leiter {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }
  .leiter.zeichen {
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  }
  .antwort {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 4px 12px;
    border: 2px solid var(--rand);
    border-radius: 40px;
    background: var(--flaeche);
    color: var(--text);
    font: inherit;
    cursor: pointer;
  }
  .zeichen .antwort {
    border-radius: var(--radius);
    padding: 6px;
  }
  .antwort:hover:not(:disabled) {
    border-color: var(--primaer);
  }
  .antwort:disabled {
    cursor: default;
  }
  .antwort.richtig {
    border-color: var(--richtig);
    background: var(--richtig-flaeche);
  }
  .antwort.falsch {
    border-color: var(--falsch);
    background: var(--falsch-flaeche);
  }
  .silbe {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--primaer);
  }
  .figur {
    width: 100%;
    max-width: 110px;
  }
  .marke {
    position: absolute;
    left: 14px;
    font-weight: 700;
    font-size: 1.2rem;
  }
  .richtig .marke {
    color: var(--richtig);
  }
  .falsch .marke {
    color: var(--falsch);
  }
  kbd {
    position: absolute;
    right: 12px;
    font: inherit;
    font-size: 0.75rem;
    color: var(--text-leise);
    border: 1px solid var(--rand);
    border-radius: 4px;
    padding: 0 5px;
  }
  .zeichen kbd {
    top: 6px;
    right: 6px;
  }
  .zeichen .marke {
    top: 4px;
    left: 8px;
  }
</style>
