<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';
  import { href, route } from './lib/router.svelte';
  import { T } from './lib/texte';
  import Start from './pages/Start.svelte';
  import Einfuehrung from './pages/Einfuehrung.svelte';
  import Tafel from './pages/Tafel.svelte';
  import Ueben from './pages/Ueben.svelte';
  import Runde from './pages/Runde.svelte';
  import Singen from './pages/Singen.svelte';
  import Statistik from './pages/Statistik.svelte';
  import Impressum from './pages/Impressum.svelte';
  import Datenschutz from './pages/Datenschutz.svelte';
  import Credits from './pages/Credits.svelte';

  const { needRefresh, updateServiceWorker } = useRegisterSW();

  const SEITEN = {
    start: Start,
    einfuehrung: Einfuehrung,
    tafel: Tafel,
    ueben: Ueben,
    runde: Runde,
    singen: Singen,
    statistik: Statistik,
    impressum: Impressum,
    datenschutz: Datenschutz,
    credits: Credits,
  };
  const Aktuell = $derived(SEITEN[route.seite]);
</script>

<header class="kopf">
  <div class="huelle kopf-innen">
    <a class="marke" href={href('start')}>{T.marke}</a>
    <nav aria-label="Hauptnavigation">
      <a href={href('tafel')} aria-current={route.seite === 'tafel' ? 'page' : undefined}>Tafel</a>
      <a href={href('ueben')} aria-current={['ueben', 'runde', 'singen'].includes(route.seite) ? 'page' : undefined}>{T.nav.ueben}</a>
      <a href={href('statistik')} aria-current={route.seite === 'statistik' ? 'page' : undefined}>{T.nav.statistik}</a>
    </nav>
  </div>
</header>

{#if $needRefresh}
  <div class="update" role="status">
    <span>{T.update}</span>
    <button type="button" class="knopf" onclick={() => updateServiceWorker(true)}>{T.neuLaden}</button>
  </div>
{/if}

<main class="huelle">
  {#key route.seite}
    <Aktuell />
  {/key}
</main>

<footer class="fuss">
  <div class="huelle">
    <p>
      {T.projektVon} <a href="https://kalikoer.com">kalikoer</a> ·
      <a href={href('impressum')}>{T.nav.impressum}</a> ·
      <a href={href('datenschutz')}>{T.nav.datenschutz}</a> ·
      <a href={href('credits')}>{T.nav.credits}</a>
    </p>
  </div>
</footer>

<style>
  .kopf {
    background: var(--flaeche);
    box-shadow: var(--schatten);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .kopf-innen {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 56px;
    flex-wrap: wrap;
  }
  .marke {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: var(--primaer);
    text-decoration: none;
  }
  nav {
    display: flex;
    gap: 14px;
  }
  nav a {
    color: var(--text);
    text-decoration: none;
    font-weight: 700;
    padding: 10px 0;
  }
  nav a[aria-current='page'] {
    color: var(--primaer);
    box-shadow: inset 0 -3px 0 var(--primaer);
  }
  main {
    min-height: 70vh;
    padding-bottom: 32px;
  }
  .update {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 8px 16px;
    background: var(--primaer);
    color: var(--auf-primaer);
  }
  .update .knopf {
    background: var(--auf-primaer);
    color: var(--primaer);
    border-color: var(--auf-primaer);
  }
  .fuss {
    font-size: 0.9rem;
    color: var(--text-leise);
    border-top: 1px solid var(--rand);
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  }
</style>
