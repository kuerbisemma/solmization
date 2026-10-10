<script lang="ts">
  import { tick } from 'svelte';
  import Antwortleiter from '../components/Antwortleiter.svelte';
  import HandFigur from '../components/HandFigur.svelte';
  import IosHinweis from '../components/IosHinweis.svelte';
  import { erzeugeRunde } from '../lib/aufgaben';
  import { spieleKadenz, spieleTon, stoppe } from '../lib/klang';
  import { gehe } from '../lib/router.svelte';
  import { verbuche, verbucheVerwechslung } from '../lib/statistik';
  import { istEigeneEingabe, optionFuerTaste, type Bewertung } from '../lib/tasten';
  import { T } from '../lib/texte';
  import { kadenz, midiVon, silbe, sortiert, waehleDo, type SilbenId } from '../lib/theorie';
  import { aktualisiereStatistik, auswahl, einstellungen, statistik } from '../lib/zustand.svelte';

  const typ = auswahl.typ;
  const hoeren = typ === 'hoeren-silbe' || typ === 'hoeren-zeichen';
  const antwortArt = typ === 'zeichen-silbe' || typ === 'hoeren-silbe' ? 'silbe' : 'zeichen';
  const optionen = sortiert(auswahl.silben);
  const gueltig = typ !== 'singen' && optionen.length >= 2;
  if (!gueltig) gehe('ueben');

  let aufgaben = $state<SilbenId[]>([]);
  let index = $state(0);
  let bewertung = $state<Bewertung>(null);
  let ergebnisse = $state<{ soll: SilbenId; gewaehlt: SilbenId }[]>([]);
  let doMidi = $state(60);
  /** Hörübungen warten auf einen Klick, damit der Browser Audio erlaubt. */
  let gestartet = $state(!hoeren);
  let fragekopf = $state<HTMLElement>();
  let weiterKnopf = $state<HTMLButtonElement>();

  const aktuell = $derived(aufgaben[index]);
  const fertig = $derived(aufgaben.length > 0 && index >= aufgaben.length);
  const richtigAnzahl = $derived(ergebnisse.filter((e) => e.soll === e.gewaehlt).length);
  const fehler = $derived(ergebnisse.filter((e) => e.soll !== e.gewaehlt));

  function neueRunde() {
    aufgaben = erzeugeRunde(optionen);
    index = 0;
    bewertung = null;
    ergebnisse = [];
    doMidi = waehleDo(optionen, einstellungen.stimmlage);
  }
  if (gueltig) neueRunde();

  const akkorde = () => kadenz(doMidi, auswahl.modus, einstellungen.stimmlage);
  const tonDerAufgabe = () => spieleTon(midiVon(doMidi, aktuell));

  async function starteHoeren() {
    gestartet = true;
    await spieleKadenz(akkorde());
    await tonDerAufgabe();
  }

  async function antworte(id: SilbenId) {
    if (bewertung || !aktuell) return;
    bewertung = { gewaehlt: id, soll: aktuell };
    ergebnisse.push({ soll: aktuell, gewaehlt: id });
    let s = verbuche(statistik.wert, typ, aktuell, id === aktuell);
    s = verbucheVerwechslung(s, aktuell, id);
    aktualisiereStatistik(s);
    void tonDerAufgabe();
    await tick();
    weiterKnopf?.focus();
  }

  async function weiter() {
    stoppe();
    bewertung = null;
    index += 1;
    await tick();
    if (!fertig) {
      fragekopf?.focus();
      if (hoeren) void tonDerAufgabe();
    }
  }

  async function nochmal() {
    neueRunde();
    if (hoeren) await starteHoeren();
  }

  function taste(e: KeyboardEvent) {
    if (istEigeneEingabe(e) || e.ctrlKey || e.metaKey || e.altKey || fertig) return;
    if (!gestartet) return;
    if (!bewertung) {
      const id = optionFuerTaste(optionen, e.key);
      if (id) {
        e.preventDefault();
        void antworte(id);
        return;
      }
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      void weiter();
      return;
    }
    if (hoeren && e.key.toLowerCase() === 'o') void spieleKadenz(akkorde());
    if (hoeren && e.key.toLowerCase() === 'w') void tonDerAufgabe();
  }

  $effect(() => stoppe);
</script>

<svelte:window onkeydown={taste} />

{#if gueltig}
  <h1>{T.uebungen[typ].titel}</h1>

  {#if !fertig}
    <p class="fortschritt" bind:this={fragekopf} tabindex="-1" aria-live="polite">
      {T.runde.aufgabe(index + 1, aufgaben.length)}
    </p>
    <progress max={aufgaben.length} value={index} aria-hidden="true"></progress>

    <section class="karte frage">
      {#if typ === 'zeichen-silbe'}
        <h2 class="nur-sr">{T.runde.frageZeichen}</h2>
        <div class="grossfigur"><HandFigur id={aktuell} /></div>
      {:else if typ === 'silbe-zeichen'}
        <h2 class="nur-sr">{T.runde.frageSilbe}</h2>
        <p class="grosssilbe"><span aria-hidden="true">{aktuell}</span><span class="nur-sr">{silbe(aktuell).gesprochen}</span></p>
      {:else}
        <h2>{T.runde.frageHoeren}</h2>
        {#if !gestartet}
          <button type="button" class="knopf" onclick={starteHoeren}>🔊 {T.runde.starten}</button>
        {:else}
          <div class="knopfreihe">
            <button type="button" class="knopf leise" onclick={() => spieleKadenz(akkorde())}>
              {T.runde.orientierung} <kbd class="nur-tastatur">O</kbd>
            </button>
            <button type="button" class="knopf leise" onclick={tonDerAufgabe}>
              {T.runde.tonWiederholen} <kbd class="nur-tastatur">W</kbd>
            </button>
          </div>
        {/if}
        <IosHinweis />
      {/if}
    </section>

    <div role="status" aria-live="polite">
      {#if bewertung}
        {@const richtig = bewertung.gewaehlt === bewertung.soll}
        <section class="karte rueckmeldung" class:richtig class:falsch={!richtig}>
          <div class="kleinfigur"><HandFigur id={bewertung.soll} /></div>
          <div>
            <p class="urteil">
              <span aria-hidden="true">{richtig ? '✓' : '✗'}</span>
              {richtig ? T.runde.richtig : T.runde.falsch(bewertung.soll)}
            </p>
            <p class="loesung">{bewertung.soll}</p>
            <button type="button" class="knopf" bind:this={weiterKnopf} onclick={weiter}>{T.runde.weiter}</button>
          </div>
        </section>
      {/if}
    </div>

    {#if gestartet}
      <Antwortleiter {optionen} art={antwortArt} {bewertung} onwahl={antworte} />
      <p class="hinweis nur-tastatur">{hoeren ? T.runde.tastenHinweisHoeren : T.runde.tastenHinweis}</p>
    {/if}
  {:else}
    <section class="karte">
      <h2>{T.runde.auswertung}</h2>
      <p class="ergebnis">{T.runde.ergebnis(richtigAnzahl, ergebnisse.length)}</p>
      {#if fehler.length === 0}
        <p>{T.runde.fehlerfrei}</p>
      {:else}
        <p>{T.runde.fehler}</p>
        <ul>
          {#each fehler as f, i (i)}
            <li><strong>{f.soll}</strong> – {T.runde.deineAntwort}: {f.gewaehlt}</li>
          {/each}
        </ul>
      {/if}
      <div class="knopfreihe">
        <button type="button" class="knopf" onclick={nochmal}>{T.runde.nochmal}</button>
        <button type="button" class="knopf leise" onclick={() => gehe('ueben')}>{T.runde.zurAuswahl}</button>
      </div>
    </section>
  {/if}
{/if}

<style>
  .fortschritt {
    margin: 0 0 4px;
    font-weight: 700;
  }
  progress {
    width: 100%;
    height: 6px;
    accent-color: var(--primaer);
    margin-bottom: 12px;
  }
  .frage {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 12px;
  }
  .frage h2 {
    margin-top: 0;
  }
  .grossfigur {
    width: min(200px, 52vw);
  }
  .grosssilbe {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 3.5rem;
    color: var(--primaer);
    margin: 8px 0;
  }
  .rueckmeldung {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
    border: 2px solid;
  }
  .rueckmeldung.richtig {
    border-color: var(--richtig);
    background: var(--richtig-flaeche);
  }
  .rueckmeldung.falsch {
    border-color: var(--falsch);
    background: var(--falsch-flaeche);
  }
  .urteil {
    margin: 0;
    font-weight: 700;
  }
  .richtig .urteil {
    color: var(--richtig);
  }
  .falsch .urteil {
    color: var(--falsch);
  }
  .loesung {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 2rem;
    color: var(--primaer);
    margin: 0 0 8px;
  }
  .ergebnis {
    font-size: 1.4rem;
    font-weight: 700;
  }
  kbd {
    font: inherit;
    font-size: 0.75em;
    border: 1px solid currentColor;
    border-radius: 4px;
    padding: 0 4px;
  }
</style>
