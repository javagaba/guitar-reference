import { useCallback, useEffect, useRef, useState } from "react";
import { MetronomeEngine, TIME_SIGNATURES, type TimeSignature } from "../metronome";

export function Metronome() {
  const [expanded, setExpanded] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [timeSig, setTimeSig] = useState<TimeSignature>(TIME_SIGNATURES[0]);
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const engineRef = useRef<MetronomeEngine | null>(null);
  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    const engine = new MetronomeEngine();
    engineRef.current = engine;
    return () => engine.dispose();
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.bpm = bpm;
  }, [bpm]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.timeSig = timeSig;
  }, [timeSig]);

  const handleBeat = useCallback((beat: number) => {
    setCurrentBeat(beat);
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.onBeat = handleBeat;
  }, [handleBeat]);

  function toggle() {
    const engine = engineRef.current;
    if (!engine) return;
    if (playing) {
      engine.stop();
      setPlaying(false);
      setCurrentBeat(-1);
    } else {
      engine.start();
      setPlaying(true);
    }
  }

  function handleTap() {
    const now = performance.now();
    const taps = tapTimesRef.current;
    taps.push(now);
    // Keep last 6 taps
    if (taps.length > 6) taps.shift();
    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.round(60000 / avg);
      if (newBpm >= 30 && newBpm <= 300) {
        setBpm(newBpm);
      }
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border shadow-lg text-xs font-mono text-text hover:bg-white/10 transition-colors"
        title="Metronome"
      >
        {bpm}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-56 rounded-lg bg-card border border-border shadow-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-subtle uppercase tracking-wide">Metronome</span>
        <button
          onClick={() => setExpanded(false)}
          className="text-subtle hover:text-text text-xs"
        >
          ×
        </button>
      </div>

      {/* BPM Display & Input */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="number"
          min={30}
          max={300}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value) || 120)}
          className="w-16 rounded border border-border bg-bg px-2 py-1 font-mono text-sm text-text text-center"
        />
        <span className="text-[11px] text-subtle">BPM</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={30}
        max={300}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="w-full mb-3 accent-blue-500"
      />

      {/* Time Signature */}
      <select
        value={timeSig.label}
        onChange={(e) => {
          const found = TIME_SIGNATURES.find((ts) => ts.label === e.target.value);
          if (found) setTimeSig(found);
        }}
        className="w-full rounded border border-border bg-bg px-2 py-1 font-mono text-sm text-text mb-3"
      >
        {TIME_SIGNATURES.map((ts) => (
          <option key={ts.label} value={ts.label}>
            {ts.label}
          </option>
        ))}
      </select>

      {/* Beat Indicator */}
      <div className="flex justify-center gap-1.5 mb-3">
        {Array.from({ length: timeSig.beats }, (_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-all ${
              i === currentBeat
                ? i === 0
                  ? "bg-blue-400 beat-pulse"
                  : "bg-white/70 beat-pulse"
                : "bg-white/15"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={toggle}
          className={`flex-1 rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
            playing
              ? "border-red-500/50 text-red-400 hover:bg-red-900/20"
              : "border-border text-text hover:bg-white/10"
          }`}
        >
          {playing ? "Stop" : "Play"}
        </button>
        <button
          onClick={handleTap}
          className="flex-1 rounded border border-border px-3 py-1.5 font-mono text-xs text-subtle hover:bg-white/10 hover:text-text transition-colors"
        >
          Tap
        </button>
      </div>
    </div>
  );
}
