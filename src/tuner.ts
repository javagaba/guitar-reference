export interface TunerResult {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  clarity: number;
}

const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const A4 = 440;
const RMS_THRESHOLD = 0.01;
const STABILITY_FRAMES = 3;
const PEAK_THRESHOLD_RATIO = 0.9;

function frequencyToNote(freq: number): { note: string; octave: number; cents: number } {
  const semitones = 12 * Math.log2(freq / A4);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  const midi = rounded + 69;
  const note = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { note, octave, cents };
}

export class TunerEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private rafId: number | null = null;
  private buffer: Float32Array | null = null;
  private _isListening = false;
  private history: string[] = [];

  onResult: ((result: TunerResult | null) => void) | null = null;
  onError: ((error: string) => void) | null = null;

  get isListening() { return this._isListening; }

  async start() {
    if (this._isListening) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      this.onError?.("Microphone not supported in this browser");
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e: unknown) {
      const name = e instanceof DOMException ? e.name : "";
      if (name === "NotAllowedError") {
        this.onError?.("Microphone access denied");
      } else if (name === "NotFoundError") {
        this.onError?.("No microphone found");
      } else {
        this.onError?.(`Microphone error: ${name || e}`);
      }
      return;
    }

    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 4096;
    this.analyser.smoothingTimeConstant = 0;
    this.buffer = new Float32Array(this.analyser.fftSize);

    this.source = this.audioCtx.createMediaStreamSource(this.stream);
    this.source.connect(this.analyser);

    this._isListening = true;
    this.history = [];
    this.loop();
  }

  stop() {
    if (!this._isListening) return;
    this._isListening = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.source?.disconnect();
    this.source = null;
    if (this.stream) {
      for (const track of this.stream.getTracks()) track.stop();
      this.stream = null;
    }
    this.onResult?.(null);
  }

  dispose() {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.analyser = null;
    this.buffer = null;
  }

  private loop() {
    if (!this._isListening) return;
    this.rafId = requestAnimationFrame(() => this.loop());
    this.detect();
  }

  private detect() {
    if (!this.analyser || !this.buffer || !this.audioCtx) return;

    this.analyser.getFloatTimeDomainData(this.buffer);
    const buf = this.buffer;
    const n = buf.length;

    // RMS gate
    let rms = 0;
    for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / n);
    if (rms < RMS_THRESHOLD) {
      this.history = [];
      this.onResult?.(null);
      return;
    }

    // NSDF autocorrelation
    const sampleRate = this.audioCtx.sampleRate;
    const minLag = Math.floor(sampleRate / 1200); // ~1200 Hz
    const maxLag = Math.ceil(sampleRate / 60);     // ~60 Hz

    let bestCorr = -1;
    let bestLag = -1;

    for (let lag = minLag; lag <= maxLag && lag < n; lag++) {
      let num = 0;
      let den = 0;
      for (let i = 0; i < n - lag; i++) {
        num += buf[i] * buf[i + lag];
        den += buf[i] * buf[i] + buf[i + lag] * buf[i + lag];
      }
      const nsdf = den > 0 ? 2 * num / den : 0;

      if (nsdf > bestCorr) {
        bestCorr = nsdf;
        bestLag = lag;
      }
    }

    if (bestCorr < 0.5 || bestLag <= 0) {
      this.history = [];
      this.onResult?.(null);
      return;
    }

    // Find first peak above threshold
    const threshold = bestCorr * PEAK_THRESHOLD_RATIO;
    let chosenLag = bestLag;
    let prevVal = 0;
    for (let lag = minLag; lag <= maxLag && lag < n; lag++) {
      let num = 0;
      let den = 0;
      for (let i = 0; i < n - lag; i++) {
        num += buf[i] * buf[i + lag];
        den += buf[i] * buf[i] + buf[i + lag] * buf[i + lag];
      }
      const nsdf = den > 0 ? 2 * num / den : 0;

      if (nsdf >= threshold && nsdf < prevVal) {
        // We just passed a peak
        chosenLag = lag - 1;
        break;
      }
      prevVal = nsdf;
    }

    // Parabolic interpolation
    const refinedLag = this.parabolicInterp(buf, chosenLag, n, sampleRate);
    const frequency = sampleRate / refinedLag;

    if (frequency < 60 || frequency > 1200) {
      this.onResult?.(null);
      return;
    }

    const { note, octave, cents } = frequencyToNote(frequency);
    const label = note + octave;

    // Stability check
    this.history.push(label);
    if (this.history.length > STABILITY_FRAMES) this.history.shift();

    if (this.history.length >= STABILITY_FRAMES && this.history.every(h => h === label)) {
      this.onResult?.({ frequency, note, octave, cents, clarity: bestCorr });
    } else if (this.history.length >= STABILITY_FRAMES) {
      // Show result but with lower clarity to indicate instability
      this.onResult?.({ frequency, note, octave, cents, clarity: bestCorr * 0.5 });
    }
  }

  private parabolicInterp(buf: Float32Array, lag: number, n: number, sampleRate: number): number {
    if (lag <= 0 || lag >= n - 1) return lag;

    const compute = (l: number) => {
      let num = 0, den = 0;
      for (let i = 0; i < n - l; i++) {
        num += buf[i] * buf[i + l];
        den += buf[i] * buf[i] + buf[i + l] * buf[i + l];
      }
      return den > 0 ? 2 * num / den : 0;
    };

    const y0 = compute(lag - 1);
    const y1 = compute(lag);
    const y2 = compute(lag + 1);

    const denom = 2 * (2 * y1 - y2 - y0);
    if (Math.abs(denom) < 1e-10) return lag;

    const shift = (y2 - y0) / denom;
    return lag + Math.max(-1, Math.min(1, shift));
  }
}
