import { useCallback, useEffect, useRef, useState } from "react";
import { MetronomeEngine, TIME_SIGNATURES, type TimeSignature } from "../metronome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { Slider } from "@/components/ui/slider";

interface MetronomeProps {
  active: boolean;
  onClose: () => void;
  onBpmChange?: (bpm: number) => void;
}

export function Metronome({ active: _active, onClose, onBpmChange }: MetronomeProps) {
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
    onBpmChange?.(bpm);
  }, [bpm, onBpmChange]);

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

  return (
    <div role="region" aria-label="Metronome" className="w-56 rounded-lg bg-card border border-border shadow-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-subtle uppercase tracking-wide">Metronome</span>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon-xs"
          aria-label="Close metronome"
          className="text-subtle hover:text-text"
        >
          x
        </Button>
      </div>

      {/* BPM Display & Input */}
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="number"
          min={30}
          max={300}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value) || 120)}
          aria-label="BPM"
          className="w-16 h-7 px-2 font-mono text-sm text-center"
        />
        <span className="text-[11px] text-subtle">BPM</span>
      </div>

      {/* Slider */}
      <Slider
        min={30}
        max={300}
        value={[bpm]}
        onValueChange={([v]) => setBpm(v)}
        aria-label="BPM slider"
        className="w-full mb-3"
      />

      {/* Time Signature */}
      <SelectNative
        value={timeSig.label}
        onChange={(e) => {
          const found = TIME_SIGNATURES.find((ts) => ts.label === e.target.value);
          if (found) setTimeSig(found);
        }}
        aria-label="Time signature"
        className="w-full font-mono mb-3"
      >
        {TIME_SIGNATURES.map((ts) => (
          <option key={ts.label} value={ts.label}>
            {ts.label}
          </option>
        ))}
      </SelectNative>

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
        <Button
          onClick={toggle}
          variant="outline"
          size="sm"
          className={`flex-1 font-mono text-xs ${
            playing
              ? "border-red-500/50 text-red-400 hover:bg-red-900/20"
              : ""
          }`}
        >
          {playing ? "Stop" : "Play"}
        </Button>
        <Button
          onClick={handleTap}
          variant="outline"
          size="sm"
          className="flex-1 font-mono text-xs text-subtle hover:text-text"
        >
          Tap
        </Button>
      </div>
    </div>
  );
}
