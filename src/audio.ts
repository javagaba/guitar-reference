// Web Audio API engine for fretboard note playback

const NOTE_TO_SEMITONE: Record<string, number> = {
  "C": 0, "C♯": 1, "D♭": 1, "D": 2, "D♯": 3, "E♭": 3, "E": 4,
  "F": 5, "F♯": 6, "G♭": 6, "G": 7, "G♯": 8, "A♭": 8, "A": 9,
  "A♯": 10, "B♭": 10, "B": 11,
};

let ctx: AudioContext | null = null;
let scaleAbort: AbortController | null = null;

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

// MIDI note numbers for open strings (high E to low E, matching FRETBOARD order)
const OPEN_STRING_MIDI = [64, 59, 55, 50, 45, 40];

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

const DURATION = 2.5;

export function playNote(stringIndex: number, fret: number): void {
  const ac = getContext();
  const t = ac.currentTime;
  const freq = midiToFreq(OPEN_STRING_MIDI[stringIndex] + fret);

  const master = ac.createGain();
  master.gain.setValueAtTime(0.5, t);
  master.gain.exponentialRampToValueAtTime(0.001, t + DURATION);
  master.connect(ac.destination);

  // Fundamental — warm sawtooth shaped by a low-pass filter
  const osc1 = ac.createOscillator();
  const lpf = ac.createBiquadFilter();
  osc1.type = "sawtooth";
  osc1.frequency.value = freq;
  lpf.type = "lowpass";
  // Bright attack that darkens as the note decays (like a real string)
  lpf.frequency.setValueAtTime(freq * 6, t);
  lpf.frequency.exponentialRampToValueAtTime(freq * 1.5, t + DURATION);
  lpf.Q.value = 1;
  const g1 = ac.createGain();
  g1.gain.value = 0.6;
  osc1.connect(lpf).connect(g1).connect(master);

  // Second harmonic with slight detune for richness
  const osc2 = ac.createOscillator();
  osc2.type = "triangle";
  osc2.frequency.value = freq * 2.0;
  osc2.detune.value = 3;
  const g2 = ac.createGain();
  g2.gain.value = 0.15;
  osc2.connect(g2).connect(master);

  // Sub-octave sine for body
  const osc3 = ac.createOscillator();
  osc3.type = "sine";
  osc3.frequency.value = freq;
  const g3 = ac.createGain();
  g3.gain.value = 0.25;
  osc3.connect(g3).connect(master);

  // Short noise burst for pluck attack
  const bufLen = ac.sampleRate * 0.04;
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
  const noise = ac.createBufferSource();
  noise.buffer = buf;
  const noiseBpf = ac.createBiquadFilter();
  noiseBpf.type = "bandpass";
  noiseBpf.frequency.value = freq * 3;
  noiseBpf.Q.value = 2;
  const gn = ac.createGain();
  gn.gain.value = 0.3;
  noise.connect(noiseBpf).connect(gn).connect(master);

  osc1.start(t);
  osc2.start(t);
  osc3.start(t);
  noise.start(t);

  osc1.stop(t + DURATION);
  osc2.stop(t + DURATION);
  osc3.stop(t + DURATION);
}

function scheduleNote(ac: AudioContext, freq: number, t: number, gain = 0.5): void {
  const master = ac.createGain();
  master.gain.setValueAtTime(gain, t);
  master.gain.exponentialRampToValueAtTime(0.001, t + DURATION);
  master.connect(ac.destination);

  const osc1 = ac.createOscillator();
  const lpf = ac.createBiquadFilter();
  osc1.type = "sawtooth";
  osc1.frequency.value = freq;
  lpf.type = "lowpass";
  lpf.frequency.setValueAtTime(freq * 6, t);
  lpf.frequency.exponentialRampToValueAtTime(freq * 1.5, t + DURATION);
  lpf.Q.value = 1;
  const g1 = ac.createGain();
  g1.gain.value = 0.6;
  osc1.connect(lpf).connect(g1).connect(master);

  const osc2 = ac.createOscillator();
  osc2.type = "triangle";
  osc2.frequency.value = freq * 2.0;
  osc2.detune.value = 3;
  const g2 = ac.createGain();
  g2.gain.value = 0.15;
  osc2.connect(g2).connect(master);

  const osc3 = ac.createOscillator();
  osc3.type = "sine";
  osc3.frequency.value = freq;
  const g3 = ac.createGain();
  g3.gain.value = 0.25;
  osc3.connect(g3).connect(master);

  const bufLen = ac.sampleRate * 0.04;
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
  const noise = ac.createBufferSource();
  noise.buffer = buf;
  const noiseBpf = ac.createBiquadFilter();
  noiseBpf.type = "bandpass";
  noiseBpf.frequency.value = freq * 3;
  noiseBpf.Q.value = 2;
  const gn = ac.createGain();
  gn.gain.value = 0.3;
  noise.connect(noiseBpf).connect(gn).connect(master);

  osc1.start(t);
  osc2.start(t);
  osc3.start(t);
  noise.start(t);

  osc1.stop(t + DURATION);
  osc2.stop(t + DURATION);
  osc3.stop(t + DURATION);
}

function playFreq(freq: number): void {
  const ac = getContext();
  scheduleNote(ac, freq, ac.currentTime);
}

function scaleToMidi(notes: string[]): number[] {
  const midis: number[] = [];
  let octave = 60;
  for (let i = 0; i < notes.length; i++) {
    const semitone = NOTE_TO_SEMITONE[notes[i]] ?? 0;
    let midi = octave + semitone;
    // If this note would be lower than the previous, bump up an octave
    if (i > 0 && midi <= midis[i - 1]) {
      octave += 12;
      midi = octave + semitone;
    }
    midis.push(midi);
  }
  return midis;
}

export function playChord(notes: string[]): void {
  const ac = getContext();
  const midis = scaleToMidi(notes);
  const t = ac.currentTime;
  for (let i = 0; i < midis.length; i++) {
    scheduleNote(ac, midiToFreq(midis[i]), t + i * 0.04, 0.35);
  }
}

export async function playScale(notes: string[]): Promise<void> {
  scaleAbort?.abort();
  const abort = new AbortController();
  scaleAbort = abort;

  const midis = scaleToMidi(notes);
  // Append root an octave above the first note
  midis.push(midis[0] + 12);

  for (let i = 0; i < midis.length; i++) {
    if (abort.signal.aborted) return;
    playFreq(midiToFreq(midis[i]));
    if (i < midis.length - 1) {
      await new Promise<void>((resolve, reject) => {
        const id = setTimeout(resolve, 300);
        abort.signal.addEventListener("abort", () => { clearTimeout(id); reject(); }, { once: true });
      }).catch(() => {});
    }
  }
}
