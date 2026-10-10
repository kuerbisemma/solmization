// Tonausgabe über Web Audio: Klavier-Samples (Salamander Grand Piano), bis zum Laden synthetischer Ersatzklang.
// Der AudioContext entsteht erst bei einer Nutzerinteraktion (Autoplay-Regeln, insbesondere iOS).

/** Vorhandene Samples (alle kleinen Terzen) mit ihrer MIDI-Nummer. */
const SAMPLES: [string, number][] = [
  ['A1', 33],
  ...[2, 3, 4, 5].flatMap((okt): [string, number][] => {
    const c = 12 * (okt + 1);
    return [[`C${okt}`, c], [`Ds${okt}`, c + 3], [`Fs${okt}`, c + 6], [`A${okt}`, c + 9]];
  }),
  ['C6', 84],
];

let ctx: AudioContext | null = null;
let ausgang: GainNode | null = null;
const puffer = new Map<number, AudioBuffer>();
let laufend: { quelle: AudioScheduledSourceNode; gain: GainNode }[] = [];
let timer: number[] = [];

function laden(c: AudioContext) {
  for (const [name, midi] of SAMPLES) {
    fetch(`${import.meta.env.BASE_URL}samples/${name}.mp3`)
      .then((r) => r.arrayBuffer())
      .then((daten) => c.decodeAudioData(daten))
      .then((b) => puffer.set(midi, b))
      .catch(() => {
        // Ohne dieses Sample greift der synthetische Klang.
      });
  }
}

/** iPadOS meldet sich als Mac – daher zusätzlich Touch prüfen. */
export const IST_IOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1);

/** Eine Zehntelsekunde Stille als WAV (8 kHz, 8 Bit, mono). */
function stilleWav(): string {
  const n = 800;
  const b = new DataView(new ArrayBuffer(44 + n));
  const text = (o: number, s: string) => [...s].forEach((c, i) => b.setUint8(o + i, c.charCodeAt(0)));
  text(0, 'RIFF');
  b.setUint32(4, 36 + n, true);
  text(8, 'WAVEfmt ');
  b.setUint32(16, 16, true);
  b.setUint16(20, 1, true);
  b.setUint16(22, 1, true);
  b.setUint32(24, 8000, true);
  b.setUint32(28, 8000, true);
  b.setUint16(32, 1, true);
  b.setUint16(34, 8, true);
  text(36, 'data');
  b.setUint32(40, n, true);
  for (let i = 0; i < n; i++) b.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
}

/**
 * iOS schaltet Web Audio mit dem Stummschalter stumm. Als „Wiedergabe“ angemeldet klingt die Seite trotzdem –
 * über navigator.audioSession (Safari 17+) oder, auf älteren Geräten, über ein stilles HTML-Audio-Element.
 */
function alsWiedergabeAnmelden() {
  const nav = navigator as Navigator & { audioSession?: { type: string } };
  if (nav.audioSession) {
    try {
      nav.audioSession.type = 'playback';
    } catch {
      // ignorieren
    }
    return;
  }
  if (!IST_IOS) return;
  const stille = new Audio(stilleWav());
  stille.loop = true;
  void stille.play().catch(() => {
    // Ohne Erfolg bleibt nur der Hinweis auf den Stummschalter.
  });
}

/** Muss in einem Klick-/Tasten-Handler aufgerufen werden. */
export function aktiviereKlang(): AudioContext {
  if (!ctx) {
    alsWiedergabeAnmelden();
    ctx = new AudioContext();
    ausgang = ctx.createGain();
    ausgang.gain.value = 0.8;
    ausgang.connect(ctx.destination);
    laden(ctx);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function naechstesSample(midi: number): [number, AudioBuffer] | null {
  let best: [number, AudioBuffer] | null = null;
  for (const [m, b] of puffer) {
    if (!best || Math.abs(m - midi) < Math.abs(best[0] - midi)) best = [m, b];
  }
  return best && Math.abs(best[0] - midi) <= 3 ? best : null;
}

function ton(midi: number, start: number, dauer: number, lautstaerke: number) {
  const c = aktiviereKlang();
  const gain = c.createGain();
  gain.connect(ausgang!);
  const sample = naechstesSample(midi);
  let quelle: AudioScheduledSourceNode;

  if (sample) {
    const src = c.createBufferSource();
    src.buffer = sample[1];
    src.playbackRate.value = 2 ** ((midi - sample[0]) / 12);
    gain.gain.setValueAtTime(lautstaerke, start);
    gain.gain.setTargetAtTime(0, start + dauer, 0.12);
    quelle = src;
  } else {
    const osc = c.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(lautstaerke * 0.5, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dauer + 0.3);
    quelle = osc;
  }
  quelle.connect(gain);
  quelle.start(start);
  quelle.stop(start + dauer + 0.8);
  const eintrag = { quelle, gain };
  laufend.push(eintrag);
  quelle.onended = () => {
    laufend = laufend.filter((e) => e !== eintrag);
    gain.disconnect();
  };
}

/** Bricht alles ab, was gerade klingt oder geplant ist. */
export function stoppe(): void {
  timer.forEach(clearTimeout);
  timer = [];
  if (!ctx) return;
  const jetzt = ctx.currentTime;
  for (const { quelle, gain } of laufend) {
    gain.gain.cancelScheduledValues(jetzt);
    gain.gain.setTargetAtTime(0, jetzt, 0.03);
    try {
      quelle.stop(jetzt + 0.2);
    } catch {
      // bereits gestoppt
    }
  }
  laufend = [];
}

function nachAblauf(sekunden: number): Promise<void> {
  return new Promise((fertig) => timer.push(window.setTimeout(fertig, sekunden * 1000)));
}

export function spieleTon(midi: number, dauer = 1.2): Promise<void> {
  stoppe();
  const c = aktiviereKlang();
  ton(midi, c.currentTime + 0.05, dauer, 0.9);
  return nachAblauf(dauer);
}

export function spieleKadenz(akkorde: number[][], proAkkord = 0.9): Promise<void> {
  stoppe();
  const c = aktiviereKlang();
  const start = c.currentTime + 0.05;
  akkorde.forEach((akkord, i) => {
    const letzter = i === akkorde.length - 1;
    akkord.forEach((m) => ton(m, start + i * proAkkord, letzter ? proAkkord * 1.6 : proAkkord * 0.95, 0.45));
  });
  return nachAblauf(akkorde.length * proAkkord + 0.5);
}

/** Spielt Töne nacheinander; `beiTon` wird synchron zu jedem Ton aufgerufen (z. B. zum Hervorheben). */
export function spieleFolge(midis: number[], proTon: number, beiTon?: (i: number) => void): Promise<void> {
  stoppe();
  const c = aktiviereKlang();
  const start = c.currentTime + 0.05;
  midis.forEach((m, i) => {
    ton(m, start + i * proTon, proTon * 0.95, 0.9);
    if (beiTon) timer.push(window.setTimeout(() => beiTon(i), (0.05 + i * proTon) * 1000));
  });
  return nachAblauf(midis.length * proTon + 0.3);
}
