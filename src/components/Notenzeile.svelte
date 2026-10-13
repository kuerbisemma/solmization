<script lang="ts">
  import type { Ereignis, Takt } from '../lib/lieder';
  import { hilfslinien, note, position, tonartVonDo, vorzeichenPositionen, vorzeichenText, type Schluessel } from '../lib/noten';
  import { gleichmaessig, setzeTakte, type Zeile } from '../lib/notensatz';

  let {
    folge,
    takte,
    takt,
    doMidi,
    schluessel,
    aktiv = null,
    silbenZeigen = false,
  }: {
    /** Töne ohne Rhythmus (alle als Viertel, ohne Takt) – Übung „Noten singen“ */
    folge?: Ereignis[];
    /** Takte mit Rhythmus – Übung „Lieder singen“ */
    takte?: Ereignis[][];
    takt?: Takt;
    doMidi: number;
    schluessel: Schluessel;
    /** Index des hervorgehobenen Tons in der Gesamtfolge */
    aktiv?: number | null;
    silbenZeigen?: boolean;
  } = $props();

  // Maße in SVG-Einheiten: Linienabstand 10, eine Position (Linie/Zwischenraum) = 5.
  const ABSTAND = 10;
  const HALB = ABSTAND / 2;
  const KOPF = 11.8; // Breite des Notenkopfs (1,18 Linienabstände)
  const KOPF_GANZE = 16.9;
  const HALS = 35;
  const BALKEN = 5;
  /** Zeilenbreite bei Liedern – passt im Hochformat ohne Scrollen (F-28). */
  const ZEILENBREITE = 360;

  // SMuFL-Zeichen der Notenschrift „Solmi Noten“ (Auszug aus Bravura, siehe tools/notenschrift)
  const g = (code: number) => String.fromCodePoint(code);
  const GLYPHE = {
    violin: g(0xe050),
    tenor: g(0xe052),
    bass: g(0xe062),
    kreuz: g(0xe262),
    be: g(0xe260),
    ganze: g(0xe0a2),
    halbe: g(0xe0a3),
    kopf: g(0xe0a4),
    punkt: g(0xe1e7),
    fahneOben: g(0xe240),
    fahneUnten: g(0xe241),
  };
  const PAUSE: Record<number, { glyphe: string; pos: number }> = {
    8: { glyphe: g(0xe4e3), pos: 6 },
    4: { glyphe: g(0xe4e4), pos: 4 },
    2: { glyphe: g(0xe4e5), pos: 4 },
    1: { glyphe: g(0xe4e6), pos: 4 },
  };
  const ziffer = (n: number) => g(0xe080 + n);
  const NAMEN: Record<Schluessel, string> = { violin: 'Violinschlüssel', tenor: 'Violinschlüssel oktaviert', bass: 'Bassschlüssel' };

  const tonart = $derived(tonartVonDo(doMidi));
  const vorzeichen = $derived(vorzeichenPositionen(tonart, schluessel));
  const xVorzeichen = 40;
  const xTaktart = $derived(xVorzeichen + vorzeichen.length * 10 + 8);
  const vorspann = (zeile: number) => xVorzeichen + vorzeichen.length * 10 + 16 + (takt && zeile === 0 ? 24 : 0);

  const zeilen: Zeile[] = $derived(
    takte && takt ? setzeTakte(takte, takt, ZEILENBREITE, vorspann) : [gleichmaessig(folge ?? [], vorspann(0))],
  );

  interface Gezeichnet {
    index: number;
    x: number;
    id: string | null;
    dauer: number;
    pos: number;
    /** Hals nach oben? */
    oben: boolean;
    /** Ende des Halses (Position im System) */
    halsEnde: number;
    gebalkt: boolean;
  }

  function zeichne(zeile: Zeile): Gezeichnet[] {
    const noten: Gezeichnet[] = zeile.noten.map((n) => {
      const pos = n.ereignis.id ? position(note(doMidi, n.ereignis.id), schluessel) : 4;
      const oben = pos < 4;
      return { index: n.index, x: n.x, id: n.ereignis.id, dauer: n.ereignis.dauer, pos, oben, halsEnde: oben ? pos + HALS / HALB : pos - HALS / HALB, gebalkt: false };
    });
    for (const [a, b] of zeile.balken) {
      const oben = (noten[a].pos + noten[b].pos) / 2 < 4;
      const ende = oben
        ? Math.max(noten[a].pos, noten[b].pos) + HALS / HALB
        : Math.min(noten[a].pos, noten[b].pos) - HALS / HALB;
      for (const i of [a, b]) Object.assign(noten[i], { oben, halsEnde: ende, gebalkt: true });
    }
    return noten;
  }

  const gezeichnet = $derived(zeilen.map(zeichne));
  const halsX = (n: Gezeichnet) => (n.oben ? n.x + KOPF - 0.6 : n.x + 0.6);

  function hoehen(noten: Gezeichnet[]) {
    const mitHals = (n: Gezeichnet) => n.id !== null && n.dauer < 8;
    const oberster = Math.max(10, ...noten.map((n) => (mitHals(n) && n.oben ? n.halsEnde : n.pos) + 1));
    const unterster = Math.min(-3, ...noten.map((n) => (mitHals(n) && !n.oben ? n.halsEnde : n.pos) - 1));
    const oben = 6;
    const y = (pos: number) => oben + (oberster - pos) * HALB;
    const silbenZeile = y(unterster) + 16;
    return { y, silbenZeile, hoehe: silbenZeile + (silbenZeigen ? 10 : 0) + 4 };
  }

  const anzahl = $derived(zeilen.reduce((s, z) => s + z.noten.filter((n) => n.ereignis.id).length, 0));
  const beschreibung = $derived(
    takte && takt
      ? `Liedanfang mit ${takte.length} Takten im ${takt.viertel}/4-Takt, ${NAMEN[schluessel]}, ${vorzeichenText(tonart)}`
      : `Melodie mit ${anzahl} Noten, ${NAMEN[schluessel]}, ${vorzeichenText(tonart)}`,
  );
</script>

<div class="notenzeile" role="img" aria-label={beschreibung}>
  {#each zeilen as zeile, z (z)}
    {@const noten = gezeichnet[z]}
    {@const { y, silbenZeile, hoehe } = hoehen(noten)}
    {@const letzte = z === zeilen.length - 1}
    {@const breite = takt ? ZEILENBREITE + 6 : zeile.ende + 6}
    <svg viewBox="0 0 {breite} {hoehe}" style:max-width={takt ? `${(breite / ZEILENBREITE) * 560}px` : '560px'} aria-hidden="true">
      {#each [0, 2, 4, 6, 8] as p (p)}
        <line class="linie" x1="0" x2={zeile.ende} y1={y(p)} y2={y(p)} />
      {/each}
      {#each zeile.taktstriche as x (x)}
        <line class="linie" x1={x} x2={x} y1={y(8)} y2={y(0)} />
      {/each}
      {#if letzte}
        <line class="linie" x1={zeile.ende - 4} x2={zeile.ende - 4} y1={y(8)} y2={y(0)} />
        <line class="schluss" x1={zeile.ende + 2} x2={zeile.ende + 2} y1={y(8)} y2={y(0)} />
      {:else}
        <line class="linie" x1={zeile.ende} x2={zeile.ende} y1={y(8)} y2={y(0)} />
      {/if}

      <text class="glyphe" x="4" y={y(schluessel === 'bass' ? 6 : 2)}>{GLYPHE[schluessel]}</text>
      {#each vorzeichen as p, i (i)}
        <text class="glyphe" x={xVorzeichen + i * 10} y={y(p)}>{tonart.vorzeichen > 0 ? GLYPHE.kreuz : GLYPHE.be}</text>
      {/each}
      {#if takt && z === 0}
        <text class="glyphe" x={xTaktart} y={y(6)}>{ziffer(takt.viertel)}</text>
        <text class="glyphe" x={xTaktart} y={y(2)}>{ziffer(4)}</text>
      {/if}

      {#each noten as n, i (n.index)}
        {#if aktiv === n.index}
          <rect class="marke" x={n.x - 8} y={y(8) - 14} width={KOPF + 16} height={y(0) - y(8) + 28} rx="6" />
        {/if}
        {#if n.id === null}
          <text class="glyphe" x={n.x} y={y(PAUSE[n.dauer].pos)}>{PAUSE[n.dauer].glyphe}</text>
        {:else}
          {#each hilfslinien(n.pos) as p (p)}
            <line class="linie" x1={n.x - 4} x2={n.x + (n.dauer >= 8 ? KOPF_GANZE : KOPF) + 4} y1={y(p)} y2={y(p)} />
          {/each}
          <text class="glyphe" x={n.x} y={y(n.pos)}>{n.dauer >= 8 ? GLYPHE.ganze : n.dauer >= 4 ? GLYPHE.halbe : GLYPHE.kopf}</text>
          {#if n.dauer < 8}
            <line class="hals" x1={halsX(n)} x2={halsX(n)} y1={y(n.pos) + (n.oben ? -1.7 : 1.7)} y2={y(n.halsEnde)} />
          {/if}
          {#if n.dauer === 1 && !n.gebalkt}
            <text class="glyphe" x={halsX(n) - 0.6} y={y(n.halsEnde)}>{n.oben ? GLYPHE.fahneOben : GLYPHE.fahneUnten}</text>
          {/if}
          {#if n.dauer === 3 || n.dauer === 6}
            <text class="glyphe" x={n.x + KOPF + 3} y={y(n.pos % 2 === 0 ? n.pos + 1 : n.pos)}>{GLYPHE.punkt}</text>
          {/if}
          {#if silbenZeigen}
            <text class="silbe" x={n.x + KOPF / 2} y={silbenZeile}>{n.id}</text>
          {/if}
        {/if}
        {#if zeile.balken.some(([a]) => a === i)}
          {@const b = noten[i + 1]}
          {@const ye = y(n.halsEnde)}
          <polygon
            class="balken"
            points="{halsX(n) - 0.6},{n.oben ? ye : ye - BALKEN} {halsX(b) + 0.6},{n.oben ? ye : ye - BALKEN} {halsX(b) + 0.6},{n.oben ? ye + BALKEN : ye} {halsX(n) - 0.6},{n.oben ? ye + BALKEN : ye}"
          />
        {/if}
      {/each}
    </svg>
  {/each}
</div>

<style>
  .notenzeile {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--text);
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    margin: 0 auto;
  }
  .linie {
    stroke: currentColor;
    stroke-width: 1.1;
  }
  .schluss {
    stroke: currentColor;
    stroke-width: 4;
  }
  .hals {
    stroke: currentColor;
    stroke-width: 1.2;
  }
  .balken {
    fill: currentColor;
  }
  .glyphe {
    font-family: 'Solmi Noten';
    font-size: 40px;
    fill: currentColor;
  }
  .marke {
    fill: color-mix(in srgb, var(--primaer) 18%, transparent);
  }
  .silbe {
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 11px;
    text-anchor: middle;
    fill: var(--primaer);
  }
</style>
