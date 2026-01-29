export interface TimeSignature {
  beats: number;
  subdivision: number;
  label: string;
}

export const TIME_SIGNATURES: TimeSignature[] = [
  { beats: 4, subdivision: 4, label: "4/4" },
  { beats: 3, subdivision: 4, label: "3/4" },
  { beats: 6, subdivision: 8, label: "6/8" },
  { beats: 2, subdivision: 4, label: "2/4" },
  { beats: 5, subdivision: 4, label: "5/4" },
  { beats: 7, subdivision: 8, label: "7/8" },
];

export class MetronomeEngine {
  private audioCtx: AudioContext | null = null;
  private intervalId: number | null = null;
  private nextBeatTime = 0;
  private currentBeat = 0;
  private _bpm = 120;
  private _timeSig: TimeSignature = TIME_SIGNATURES[0];
  private _isPlaying = false;
  onBeat: ((beat: number) => void) | null = null;

  get bpm() { return this._bpm; }
  set bpm(v: number) { this._bpm = Math.max(30, Math.min(300, v)); }

  get timeSig() { return this._timeSig; }
  set timeSig(v: TimeSignature) { this._timeSig = v; }

  get isPlaying() { return this._isPlaying; }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  private scheduleClick(time: number, isAccent: boolean) {
    const ac = this.getAudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = isAccent ? 1000 : 800;
    gain.gain.setValueAtTime(isAccent ? 0.8 : 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.connect(gain).connect(ac.destination);
    osc.start(time);
    osc.stop(time + 0.05);
  }

  private scheduler() {
    const ac = this.getAudioContext();
    const lookahead = 0.1; // 100ms

    while (this.nextBeatTime < ac.currentTime + lookahead) {
      const isAccent = this.currentBeat === 0;
      this.scheduleClick(this.nextBeatTime, isAccent);

      const beat = this.currentBeat;
      const triggerTime = this.nextBeatTime - ac.currentTime;
      if (triggerTime > 0) {
        setTimeout(() => this.onBeat?.(beat), triggerTime * 1000);
      } else {
        this.onBeat?.(beat);
      }

      const beatDuration = 60 / this._bpm;
      this.nextBeatTime += beatDuration;
      this.currentBeat = (this.currentBeat + 1) % this._timeSig.beats;
    }
  }

  start() {
    if (this._isPlaying) return;
    const ac = this.getAudioContext();
    if (ac.state === "suspended") {
      ac.resume();
    }
    this._isPlaying = true;
    this.currentBeat = 0;
    this.nextBeatTime = ac.currentTime + 0.05;
    this.intervalId = window.setInterval(() => this.scheduler(), 25);
  }

  stop() {
    if (!this._isPlaying) return;
    this._isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentBeat = 0;
  }

  dispose() {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
