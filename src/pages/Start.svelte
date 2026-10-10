<script lang="ts">
  import HandFigur from '../components/HandFigur.svelte';
  import { href, type Seite } from '../lib/router.svelte';
  import { T } from '../lib/texte';

  const kacheln: { seite: Seite; titel: string; text: string }[] = [
    { seite: 'einfuehrung', titel: T.nav.einfuehrung, text: T.start.einfuehrung },
    { seite: 'tafel', titel: T.nav.tafel, text: T.start.tafel },
    { seite: 'ueben', titel: T.nav.ueben, text: T.start.ueben },
    { seite: 'statistik', titel: T.nav.statistik, text: T.start.statistik },
  ];
</script>

<section class="held">
  <div class="figur"><HandFigur id="so" /></div>
  <div>
    <h1>Hallo! 👋</h1>
    <p>{T.claim}</p>
    <a class="knopf" href={href('ueben')}>{T.nav.ueben}</a>
  </div>
</section>

<ul class="kacheln">
  {#each kacheln as k (k.seite)}
    <li>
      <a class="karte kachel" href={href(k.seite)}>
        <h2>{k.titel}</h2>
        <p>{k.text}</p>
      </a>
    </li>
  {/each}
</ul>

<style>
  .held {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 16px;
    align-items: center;
    margin-top: 16px;
  }
  .held h1 {
    margin-top: 0;
  }
  .kacheln {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
  }
  .kachel {
    display: block;
    height: 100%;
    text-decoration: none;
    color: var(--text);
    border: 2px solid transparent;
  }
  .kachel:hover {
    border-color: var(--primaer);
  }
  .kachel h2 {
    margin-top: 0;
  }
  .kachel p {
    margin-bottom: 0;
  }
</style>
