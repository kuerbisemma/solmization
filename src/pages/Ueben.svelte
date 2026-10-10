<script lang="ts">
  import type { Schluessel, VorzeichenStufe } from '../lib/noten';
  import { gehe } from '../lib/router.svelte';
  import { UEBUNGEN } from '../lib/statistik';
  import { T } from '../lib/texte';
  import { SILBEN, sortiert, STUFEN, type SilbenId, type Stimmlage } from '../lib/theorie';
  import { auswahl, einstellungen, speichereAuswahl, speichereEinstellungen, TEMPO } from '../lib/zustand.svelte';

  function waehleStufe(nr: number | null) {
    auswahl.stufe = nr;
    if (nr !== null) {
      const stufe = STUFEN[nr - 1];
      auswahl.silben = [...stufe.silben];
      auswahl.modus = stufe.modus;
    }
  }

  function umschalten(id: SilbenId) {
    auswahl.silben = auswahl.silben.includes(id)
      ? auswahl.silben.filter((s) => s !== id)
      : sortiert([...auswahl.silben, id]);
  }

  const gueltig = $derived(auswahl.silben.length >= 2);
  const SCHLUESSEL: Schluessel[] = ['violin', 'tenor', 'bass'];
  const VORZEICHEN: VorzeichenStufe[] = [0, 2, 4, 6];

  /** Schlüssel und Stimmlage gehören zusammen: Violin = hohe Stimme, Violin oktaviert und Bass = tiefe Stimme. */
  function waehleStimmlage(lage: Stimmlage) {
    einstellungen.stimmlage = lage;
    einstellungen.schluessel = lage === 'hoch' ? 'violin' : 'bass';
  }

  function waehleSchluessel(s: Schluessel) {
    einstellungen.schluessel = s;
    einstellungen.stimmlage = s === 'violin' ? 'hoch' : 'tief';
  }

  function starte() {
    speichereAuswahl();
    speichereEinstellungen();
    gehe('singen');
  }
</script>

<h1>{T.nav.ueben}</h1>

<fieldset>
  <legend>{T.auswahl.uebung}</legend>
  <div class="optionen uebungen">
    {#each UEBUNGEN as u (u)}
      <label class="karte option" class:gewaehlt={einstellungen.uebung === u}>
        <input type="radio" name="uebung" value={u} bind:group={einstellungen.uebung} />
        <strong>{T.uebungen[u].titel}</strong>
        <span class="hinweis">{T.uebungen[u].text}</span>
      </label>
    {/each}
  </div>
</fieldset>

<fieldset>
  <legend>{T.auswahl.stufe}</legend>
  <div class="optionen stufen">
    {#each STUFEN as stufe (stufe.nr)}
      <label class="karte option" class:gewaehlt={auswahl.stufe === stufe.nr}>
        <input type="radio" name="stufe" checked={auswahl.stufe === stufe.nr} onchange={() => waehleStufe(stufe.nr)} />
        <strong>{stufe.nr}</strong>
        <span>{stufe.titel}</span>
        {#if stufe.modus === 'moll'}<span class="hinweis">{T.auswahl.moll}</span>{/if}
      </label>
    {/each}
    <label class="karte option" class:gewaehlt={auswahl.stufe === null}>
      <input type="radio" name="stufe" checked={auswahl.stufe === null} onchange={() => waehleStufe(null)} />
      <strong>{T.auswahl.frei}</strong>
    </label>
  </div>

  {#if auswahl.stufe === null}
    <div class="frei">
      <div class="chips" role="group" aria-label="Silben">
        {#each SILBEN as s (s.id)}
          <label class="chip" class:an={auswahl.silben.includes(s.id)}>
            <input type="checkbox" checked={auswahl.silben.includes(s.id)} onchange={() => umschalten(s.id)} />
            <span aria-hidden="true">{s.id}</span><span class="nur-sr">{s.gesprochen}</span>
          </label>
        {/each}
      </div>
      <div class="chips" role="radiogroup" aria-label="Tongeschlecht">
        <label class="chip" class:an={auswahl.modus === 'dur'}>
          <input type="radio" name="modus" value="dur" bind:group={auswahl.modus} />{T.auswahl.dur}
        </label>
        <label class="chip" class:an={auswahl.modus === 'moll'}>
          <input type="radio" name="modus" value="moll" bind:group={auswahl.modus} />{T.auswahl.moll}
        </label>
      </div>
      {#if !gueltig}<p class="hinweis" role="alert">{T.auswahl.freiHinweis}</p>{/if}
    </div>
  {/if}
</fieldset>

{#if einstellungen.uebung === 'handzeichen'}
<fieldset>
  <legend>{T.auswahl.stimmlage}</legend>
  <div class="chips">
    <label class="chip" class:an={einstellungen.stimmlage === 'hoch'}>
      <input type="radio" name="lage" checked={einstellungen.stimmlage === 'hoch'} onchange={() => waehleStimmlage('hoch')} />{T.auswahl.hoch}
    </label>
    <label class="chip" class:an={einstellungen.stimmlage === 'tief'}>
      <input type="radio" name="lage" checked={einstellungen.stimmlage === 'tief'} onchange={() => waehleStimmlage('tief')} />{T.auswahl.tief}
    </label>
  </div>
</fieldset>
{/if}

{#if einstellungen.uebung === 'noten'}
  <fieldset>
    <legend>{T.auswahl.schluessel}</legend>
    <p class="hinweis">{T.auswahl.schluesselHinweis}</p>
    <div class="chips">
      {#each SCHLUESSEL as s (s)}
        <label class="chip" class:an={einstellungen.schluessel === s}>
          <input type="radio" name="schluessel" checked={einstellungen.schluessel === s} onchange={() => waehleSchluessel(s)} />{T.auswahl.schluesselNamen[s]}
        </label>
      {/each}
    </div>
  </fieldset>

  <fieldset>
    <legend>{T.auswahl.vorzeichen}</legend>
    <div class="chips">
      {#each VORZEICHEN as v (v)}
        <label class="chip" class:an={einstellungen.vorzeichen === v}>
          <input type="radio" name="vorzeichen" value={v} bind:group={einstellungen.vorzeichen} />{T.auswahl.vorzeichenNamen[v]}
        </label>
      {/each}
    </div>
  </fieldset>
{/if}

<fieldset>
  <legend>{T.auswahl.tempo}</legend>
  <label class="tempo">
    <input type="range" min={TEMPO.min} max={TEMPO.max} step="5" bind:value={einstellungen.tempo} />
    <span>{einstellungen.tempo} {T.auswahl.tempoEinheit}</span>
  </label>
</fieldset>

<p><button type="button" class="knopf" disabled={!gueltig} onclick={starte}>{T.auswahl.los}</button></p>

<style>
  fieldset {
    border: 0;
    padding: 0;
    margin: 0 0 20px;
  }
  legend {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 1.2rem;
    color: var(--primaer);
    margin-bottom: 8px;
  }
  .optionen {
    display: grid;
    gap: 8px;
  }
  .uebungen {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  .stufen {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  .option {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px;
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
  }
  .option.gewaehlt {
    border-color: var(--primaer);
  }
  .option input,
  .chip input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
  .option:has(input:focus-visible),
  .chip:has(input:focus-visible) {
    outline: 3px solid var(--primaer);
    outline-offset: 2px;
  }
  .frei {
    margin-top: 12px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .chip {
    position: relative;
    min-width: 52px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 14px;
    border: 2px solid var(--rand);
    border-radius: 40px;
    background: var(--flaeche);
    font-weight: 700;
    cursor: pointer;
  }
  .chip.an {
    border-color: var(--primaer);
    background: var(--primaer);
    color: var(--auf-primaer);
  }
  .tempo {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .tempo input {
    flex: 1;
    min-width: 180px;
    accent-color: var(--primaer);
  }
</style>
