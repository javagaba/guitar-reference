import { playDrumSound } from './drumSynth';
import { getPatternForTimeSig, type DrumPattern } from './drumPatterns';
import type { DrumSound } from './drumSynth';

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

// Get the number of subdivisions per beat for a time signature
function getSubdivisionsPerBeat(timeSig: TimeSignature): number {
  // x/8 = 1 step per beat (eighth note IS the beat, no subdivision)
  // x/4 = 4 steps per beat (sixteenth note subdivision)
  return timeSig.subdivision === 8 ? 1 : 4;
}

export class MetronomeEngine {
  private audioCtx: AudioContext | null = null;
  private intervalId: number | null = null;
  private nextBeatTime = 0;
  private currentBeat = 0;
  private currentStep = 0; // 16th note step within the pattern
  private _bpm = 120;
  private _timeSig: TimeSignature = TIME_SIGNATURES[0];
  private _isPlaying = false;
  private _drumPattern: DrumPattern | null = null;
  private _drumsEnabled = false;
  private _drumVolume = 0.7;
  private _clickEnabled = true;
  onBeat: ((beat: number) => void) | null = null;

  get bpm() { return this._bpm; }
  set bpm(v: number) { this._bpm = Math.max(30, Math.min(300, v)); }

  get timeSig() { return this._timeSig; }
  set timeSig(v: TimeSignature) { this._timeSig = v; }

  get isPlaying() { return this._isPlaying; }

  get drumPattern() { return this._drumPattern; }
  set drumPattern(v: DrumPattern | null) { this._drumPattern = v; }

  get drumsEnabled() { return this._drumsEnabled; }
  set drumsEnabled(v: boolean) { this._drumsEnabled = v; }

  get drumVolume() { return this._drumVolume; }
  set drumVolume(v: number) { this._drumVolume = Math.max(0, Math.min(1, v)); }

  get clickEnabled() { return this._clickEnabled; }
  set clickEnabled(v: boolean) { this._clickEnabled = v; }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  private scheduleClick(time: number, isAccent: boolean) {
    if (!this._clickEnabled) return;

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

  private scheduleDrums(beatTime: number, beatDuration: number) {
    if (!this._drumsEnabled || !this._drumPattern) return;

    const pattern = getPatternForTimeSig(this._drumPattern, this._timeSig.label);
    if (!pattern) return;

    const ac = this.getAudioContext();
    const subsPerBeat = getSubdivisionsPerBeat(this._timeSig);
    const sixteenthDuration = beatDuration / subsPerBeat;

    // Schedule subdivisions for this beat
    for (let i = 0; i < subsPerBeat; i++) {
      const stepIndex = (this.currentStep + i) % pattern.length;
      const stepTime = beatTime + (i * sixteenthDuration);
      const sounds: DrumSound[] = pattern[stepIndex];

      for (const sound of sounds) {
        playDrumSound(ac, sound, stepTime, this._drumVolume);
      }
    }
  }

  private scheduler() {
    const ac = this.getAudioContext();
    const lookahead = 0.1; // 100ms

    while (this.nextBeatTime < ac.currentTime + lookahead) {
      const isAccent = this.currentBeat === 0;
      // For x/8 time signatures, BPM refers to the dotted-quarter (compound beat)
      // Each eighth note is 1/3 of that duration
      const beatDuration = this._timeSig.subdivision === 8
        ? (60 / this._bpm) / 3
        : 60 / this._bpm;

      // For x/8 compound meters, only click on the main beats (every 3 eighth notes)
      // 6/8 clicks on beats 0,3 (two-feel); 7/8 clicks on 0,3,5 (3+2+2 grouping)
      const shouldClick = this._timeSig.subdivision === 8
        ? (this._timeSig.beats === 6 ? this.currentBeat % 3 === 0 : [0, 3, 5].includes(this.currentBeat))
        : true;
      if (shouldClick) {
        this.scheduleClick(this.nextBeatTime, isAccent);
      }
      this.scheduleDrums(this.nextBeatTime, beatDuration);

      const beat = this.currentBeat;
      const triggerTime = this.nextBeatTime - ac.currentTime;
      if (triggerTime > 0) {
        setTimeout(() => this.onBeat?.(beat), triggerTime * 1000);
      } else {
        this.onBeat?.(beat);
      }

      // Advance timing
      this.nextBeatTime += beatDuration;
      this.currentBeat = (this.currentBeat + 1) % this._timeSig.beats;

      // Advance step counter by subdivisions per beat
      const subsPerBeat = getSubdivisionsPerBeat(this._timeSig);
      const pattern = this._drumPattern ? getPatternForTimeSig(this._drumPattern, this._timeSig.label) : null;
      const patternLength = pattern?.length || 16;
      this.currentStep = (this.currentStep + subsPerBeat) % patternLength;
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
    this.currentStep = 0;
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
    this.currentStep = 0;
  }

  dispose() {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
