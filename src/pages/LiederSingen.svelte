<script lang="ts">
  import IosHinweis from '../components/IosHinweis.svelte';
  import Notenzeile from '../components/Notenzeile.svelte';
  import { spieleKadenz, spieleMelodie, spieleTon, stoppe } from '../lib/klang';
  import { ereignisse, liedSilben, passendeLieder, takte, waehleLieder, type Lied } from '../lib/lieder';
  import { erlaubteDoKlassen, tonartName } from '../lib/noten';
  import { gehe } from '../lib/router.svelte';
  import { heute, verbuche } from '../lib/statistik';
  import { istEigeneEingabe } from '../lib/tasten';
  import { T } from '../lib/texte';
  import { kadenz, midiVon, silbe, waehleDo } from '../lib/theorie';
  import { aktualisiereStatistik, auswahl, einstellungen, statistik } from '../lib/zustand.svelte';

  const vorrat = passendeLieder(auswahl.silben, auswahl.modus);
  const gueltig = vorrat.length > 0;
  if (!gueltig) gehe('ueben');
  const erlaubt = erlaubteDoKlassen(einstellungen.vorzeichen);

  type Phase = 'bereit' | 'orientierung' | 'bewerten' | 'fertig';
  let phase = $state<Phase>('bereit');
  let runde = $state<Lied[]>(waehleLieder(vorrat));
  let nummer = $state(1);
  let loesungGezeigt = $state(false);
  let hervorgehoben = $state<number | null>(null);
  let bewertungen = $state<boolean[]>([]);
  let doMidi = $state(60);
  let lauf = 0;

  const lied = $derived(runde[nummer - 1]);
  const liedTakte = $derived(lied ? takte(lied) : []);
  const toene = $derived(lied ? ereignisse(lied) : []);
  const ersterTon = $derived(toene.find((e) => e.id !== null)?.id ?? 'do');

  function neuesLied() {
    const l = runde[nummer - 1];
    if (l) doMidi = waehleDo(liedSilben(l), einstellungen.stimmlage, Math.random, erlaubt);
    loesungGezeigt = false;
    hervorgehoben = null;
    phase = 'bereit';
  }
  neuesLied();

  function abbrechen() {
    lauf++;
    stoppe();
    hervorgehoben = null;
  }

  const anfangston = () => spieleTon(midiVon(doMidi, ersterTon), 1.5);

  async function starte() {
    abbrechen();
    const meinLauf = lauf;
    phase = 'orientierung';
    await spieleKadenz(kadenz(doMidi, lied.modus, einstellungen.stimmlage));
    if (meinLauf !== lauf) return;
    await anfangston();
    if (meinLauf !== lauf) return;
    phase = 'bewerten';
  }

  async function spiele() {
    abbrechen();
    const meinLauf = lauf;
    const achtel = 30 / lied.tempo;
    await spieleMelodie(
      toene.map((e) => ({ midi: e.id ? midiVon(doMidi, e.id) : null, dauer: e.dauer * achtel })),
      (i) => (hervorgehoben = i),
    );
    if (meinLauf === lauf) hervorgehoben = null;
  }

  function vorspielen() {
    if (phase === 'orientierung') phase = 'bereit';
    void spiele();
  }

  function loesung() {
    loesungGezeigt = true;
    void spiele();
  }

  function weiter() {
    if (nummer >= runde.length) {
      phase = 'fertig';
      return;
    }
    nummer += 1;
    neuesLied();
  }

  function bewerte(gut: boolean | null) {
    abbrechen();
    if (gut !== null) {
      aktualisiereStatistik(verbuche(statistik.wert, { tag: heute(), uebung: 'lieder', silben: [], richtig: gut, lied: lied.id }));
      bewertungen.push(gut);
    }
    weiter();
  }

  function kenneIchNicht() {
    abbrechen();
    weiter();
  }

  function nochmal() {
    runde = waehleLieder(vorrat);
    nummer = 1;
    bewertungen = [];
    neuesLied();
  }

  function taste(e: KeyboardEvent) {
    if (istEigeneEingabe(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (phase === 'bereit' && k === ' ') {
      e.preventDefault();
      void starte();
    } else if ((phase === 'bereit' || phase === 'bewerten') && k === 'v' && !loesungGezeigt) vorspielen();
    else if ((phase === 'bereit' || phase === 'bewerten') && k === 'k') kenneIchNicht();
    else if (phase === 'bewerten') {
      if (k === 'l') loesung();
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
  <h1>{T.uebungen.lieder.titel}</h1>

  {#if phase !== 'fertig' && lied}
    <p class="fortschritt">{T.lieder.lied(nummer, runde.length)}</p>
    <p class="hinweis">{T.uebungen.lieder.anleitung}</p>
    <IosHinweis />

    <section class="karte lied">
      <h2>{lied.titel}</h2>
      <p class="text">„{lied.text} …“</p>
      <div class="notenblatt">
        <Notenzeile
          takte={liedTakte}
          takt={lied.takt}
          {doMidi}
          schluessel={einstellungen.schluessel}
          aktiv={hervorgehoben}
          silbenZeigen={loesungGezeigt}
        />
        {#if loesungGezeigt}
          <p class="tonart">
            {tonartName(doMidi, lied.modus)} · {T.lieder.beginnt(silbe(ersterTon).gesprochen)}
          </p>
        {/if}
      </div>
    </section>

    {#if phase === 'bereit'}
      <div class="knopfreihe">
        <button type="button" class="knopf" onclick={starte}>🔊 {T.lieder.start}</button>
        <button type="button" class="knopf leise" onclick={vorspielen}>{T.lieder.vorspielen}</button>
        <button type="button" class="knopf leise" onclick={kenneIchNicht}>{T.lieder.kenneIchNicht}</button>
      </div>
    {:else if phase === 'bewerten'}
      {#if !loesungGezeigt}<p>{T.lieder.jetztSingen}</p>{/if}
      <div class="knopfreihe">
        <button type="button" class="knopf leise" onclick={loesung}>{T.singen.loesung}</button>
        <button type="button" class="knopf leise" onclick={anfangston}>{T.singen.anfangston}</button>
        {#if !loesungGezeigt}
          <button type="button" class="knopf leise" onclick={vorspielen}>{T.lieder.vorspielen}</button>
        {/if}
        <button type="button" class="knopf leise" onclick={kenneIchNicht}>{T.lieder.kenneIchNicht}</button>
      </div>
      <h2>{T.singen.frageSelbst}</h2>
      <div class="knopfreihe">
        <button type="button" class="knopf" onclick={() => bewerte(true)}>✓ {T.singen.gut}</button>
        <button type="button" class="knopf" onclick={() => bewerte(false)}>✗ {T.singen.nichtGanz}</button>
        <button type="button" class="knopf leise" onclick={() => bewerte(null)}>{T.singen.ohneBewertung}</button>
      </div>
    {/if}
    {#if phase !== 'orientierung'}
      <p class="hinweis nur-tastatur">{T.lieder.tastenHinweis}</p>
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
{/if}

<style>
  .fortschritt {
    font-weight: 700;
    margin-bottom: 0;
  }
  .lied {
    margin: 12px 0;
  }
  .lied h2 {
    margin: 0;
  }
  .text {
    font-style: italic;
    margin: 4px 0 0;
  }
  .notenblatt {
    margin-top: 12px;
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
</style>
