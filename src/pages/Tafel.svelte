<script lang="ts">
  import HandFigur from '../components/HandFigur.svelte';
  import { spieleTon } from '../lib/klang';
  import { T } from '../lib/texte';
  import { midiVon, SILBEN, type SilbenId } from '../lib/theorie';
  import { einstellungen } from '../lib/zustand.svelte';

  const vonOben = [...SILBEN].reverse();
  let aktiv = $state<SilbenId | null>(null);

  async function spiele(id: SilbenId) {
    aktiv = id;
    // Referenz: do = c' (hohe Stimme) bzw. c (tiefe Stimme)
    await spieleTon(midiVon(einstellungen.stimmlage === 'hoch' ? 60 : 48, id));
    if (aktiv === id) aktiv = null;
  }
</script>

<h1>{T.nav.tafel}</h1>
<p class="hinweis">{T.tafel.hinweis}</p>

<ul class="tafel">
  {#each vonOben as s (s.id)}
    <li>
      <button type="button" class="karte eintrag" class:aktiv={aktiv === s.id} onclick={() => spiele(s.id)}>
        <span class="figur"><HandFigur id={s.id} /></span>
        <span class="silbe" aria-hidden="true">{s.id}</span>
        <span class="nur-sr">{s.gesprochen}</span>
      </button>
    </li>
  {/each}
</ul>

<style>
  .tafel {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }
  .eintrag {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid transparent;
    font: inherit;
    color: var(--text);
    cursor: pointer;
  }
  .eintrag:hover,
  .eintrag.aktiv {
    border-color: var(--primaer);
  }
  .figur {
    width: 100%;
    max-width: 130px;
  }
  .silbe {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: var(--primaer);
  }
</style>
