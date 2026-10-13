<script lang="ts">
  import HandFigur from '../components/HandFigur.svelte';
  import IosHinweis from '../components/IosHinweis.svelte';
  import Notenzeile from '../components/Notenzeile.svelte';
  import { erzeugeFolge, FOLGEN_PRO_RUNDE } from '../lib/aufgaben';
  import { spieleFolge, spieleKadenz, spieleTon, stoppe } from '../lib/klang';
  import { gehe } from '../lib/router.svelte';
  import { erlaubteDoKlassen, tonartName } from '../lib/noten';
  import { heute, verbuche } from '../lib/statistik';
  import { istEigeneEingabe } from '../lib/tasten';
  import { T } from '../lib/texte';
  import { folgenLaengeFuer, kadenz, midiVon, silbe, sortiert, STUFEN, waehleDo, type SilbenId } from '../lib/theorie';
  import { aktualisiereStatistik, auswahl, einstellungen, statistik } from '../lib/zustand.svelte';

  const optionen = sortiert(auswahl.silben);
  const gueltig = optionen.length >= 2;
  if (!gueltig) gehe('ueben');
  const uebung = einstellungen.uebung;
  const noten = uebung === 'noten';
  const erlaubt = noten ? erlaubteDoKlassen(einstellungen.vorzeichen) : undefined;
  const laenge = auswahl.stufe ? STUFEN[auswahl.stufe - 1].folgenLaenge : folgenLaengeFuer(optionen.length);

  type Phase = 'bereit' | 'zeigen' | 'bewerten' | 'fertig';
  let phase = $state<Phase>('bereit');
  let nummer = $state(1);
  let folge = $state<SilbenId[]>([]);
  let sichtbar = $state(0);
  let hervorgehoben = $state<number | null>(null);
  let loesungGezeigt = $state(false);
  let bewertungen = $state<boolean[]>([]);
  let doMidi = $state(60);
  let lauf = 0;
  let timer: number[] = [];

  function neueFolge() {
    folge = gueltig ? erzeugeFolge(optionen, auswahl.modus, laenge) : [];
    doMidi = waehleDo(optionen, einstellungen.stimmlage, Math.random, erlaubt);
    sichtbar = 0;
    hervorgehoben = null;
    loesungGezeigt = false;
  }
  neueFolge();

  function abbrechen() {
    lauf++;
    timer.forEach(clearTimeout);
    timer = [];
    stoppe();
  }

  const midis = () => folge.map((id) => midiVon(doMidi, id));
  const anfangston = () => spieleTon(midis()[0], 1.5);

  async function starte() {
    abbrechen();
    const meinLauf = lauf;
    phase = 'zeigen';
    await spieleKadenz(kadenz(doMidi, auswahl.modus, einstellungen.stimmlage));
    if (meinLauf !== lauf) return;
    await anfangston();
    if (meinLauf !== lauf) return;
    const proZeichen = 60_000 / einstellungen.tempo;
    folge.forEach((_, i) => {
      timer.push(window.setTimeout(() => (sichtbar = i + 1), i * proZeichen));
    });
    timer.push(window.setTimeout(() => (phase = 'bewerten'), folge.length * proZeichen));
  }

  async function loesung() {
    abbrechen();
    sichtbar = folge.length;
    loesungGezeigt = true;
    await spieleFolge(midis(), 60 / einstellungen.tempo, (i) => (hervorgehoben = i));
    hervorgehoben = null;
  }

  function bewerte(gut: boolean | null) {
    abbrechen();
    if (gut !== null) {
      aktualisiereStatistik(verbuche(statistik.wert, { tag: heute(), uebung, silben: [...folge], richtig: gut }));
      bewertungen.push(gut);
    }
    if (nummer >= FOLGEN_PRO_RUNDE) {
      phase = 'fertig';
      return;
    }
    nummer += 1;
    neueFolge();
    void starte();
  }

  function nochmal() {
    nummer = 1;
    bewertungen = [];
    neueFolge();
    void starte();
  }

  function taste(e: KeyboardEvent) {
    if (istEigeneEingabe(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (phase === 'bereit' && k === ' ') {
      e.preventDefault();
      void starte();
    } else if (phase === 'bewerten') {
      if (k === 'l') void loesung();
      else if (k === 'a') void anfangston();
      else if (k === '1') bewerte(true);
      else if (k === '2') bewerte(false);
      else if (k === '3') bewerte(null);
    }
  }

  $effect(() => abbrechen);
</script>

<svelte:window onkeydown={taste} />

{#if gueltig}
  <h1>{T.uebungen[uebung].titel}</h1>

  {#if phase !== 'fertig'}
    <p class="fortschritt">{T.singen.folge(nummer, FOLGEN_PRO_RUNDE)}</p>
    <p class="hinweis">{T.uebungen[uebung].anleitung}</p>
    <IosHinweis />

    {#if noten}
      <div class="karte notenblatt">
        <Notenzeile
          folge={folge.map((id) => ({ id, dauer: 2 }))}
          {doMidi}
          schluessel={einstellungen.schluessel}
          aktiv={hervorgehoben ?? (phase === 'zeigen' && sichtbar > 0 ? sichtbar - 1 : null)}
          silbenZeigen={loesungGezeigt}
        />
        {#if loesungGezeigt}<p class="tonart">{tonartName(doMidi, auswahl.modus)}</p>{/if}
      </div>
    {:else}
      <ol class="folge karte" aria-label="Zeichenfolge">
        {#each folge as id, i (i)}
          <li class:sichtbar={i < sichtbar} class:aktiv={hervorgehoben === i} aria-hidden={i >= sichtbar}>
            {#if i < sichtbar}
              <HandFigur {id} />
              {#if loesungGezeigt}<span class="silbe">{id}</span>{/if}
            {/if}
          </li>
        {/each}
      </ol>
    {/if}

    {#if phase === 'bereit'}
      <button type="button" class="knopf" onclick={starte}>🔊 {T.singen.start}</button>
    {:else if phase === 'bewerten'}
      <div class="knopfreihe">
        <button type="button" class="knopf leise" onclick={loesung}>{T.singen.loesung}</button>
        <button type="button" class="knopf leise" onclick={anfangston}>{T.singen.anfangston}</button>
      </div>
      <h2>{T.singen.frageSelbst}</h2>
      <div class="knopfreihe">
        <button type="button" class="knopf" onclick={() => bewerte(true)}>✓ {T.singen.gut}</button>
        <button type="button" class="knopf" onclick={() => bewerte(false)}>✗ {T.singen.nichtGanz}</button>
        <button type="button" class="knopf leise" onclick={() => bewerte(null)}>{T.singen.ohneBewertung}</button>
      </div>
    {/if}
    {#if phase !== 'zeigen'}
      <p class="hinweis nur-tastatur">{T.singen.tastenHinweis}</p>
    {/if}
  {:else}
    <section class="karte">
      <h2>{T.singen.auswertung}</h2>
      {#if bewertungen.length > 0}
        <p class="ergebnis">{T.singen.ergebnis(bewertungen.filter(Boolean).length, bewertungen.length)}</p>
      {/if}
      <div class="knopfreihe">
        <button type="button" class="knopf" onclick={nochmal}>{T.singen.nochmal}</button>
        <button type="button" class="knopf leise" onclick={() => gehe('ueben')}>{T.singen.zurAuswahl}</button>
      </div>
    </section>
  {/if}

  <p class="nur-sr" aria-live="polite">
    {#if !noten && sichtbar > 0 && phase === 'zeigen'}{silbe(folge[sichtbar - 1]).gesprochen}{/if}
  </p>
{/if}

<style>
  .fortschritt {
    font-weight: 700;
    margin-bottom: 0;
  }
  .folge {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 12px 0;
    padding: 12px;
  }
  @media (min-width: 560px) {
    .folge {
      grid-template-columns: repeat(6, 1fr);
    }
  }
  .folge li {
    min-height: 90px;
    border-radius: var(--radius);
    border: 2px dashed var(--rand);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .folge li.sichtbar {
    border-style: solid;
    animation: auftauchen 0.25s ease-out;
  }
  .folge li.aktiv {
    border-color: var(--primaer);
    background: color-mix(in srgb, var(--primaer) 12%, transparent);
  }
  .silbe {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    color: var(--primaer);
  }
  .notenblatt {
    margin: 12px 0;
  }
  .tonart {
    text-align: center;
    font-weight: 700;
    color: var(--primaer);
    margin: 4px 0 0;
  }
  .ergebnis {
    font-size: 1.4rem;
    font-weight: 700;
  }
  @keyframes auftauchen {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }
</style>
