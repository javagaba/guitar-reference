import { useCallback, useEffect, useRef, useState } from "react";
import { getNoteColor } from "../music";
import { TunerEngine, type TunerResult } from "../tuner";

export function Tuner() {
  const [expanded, setExpanded] = useState(false);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<TunerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<TunerEngine | null>(null);

  useEffect(() => {
    const engine = new TunerEngine();
    engineRef.current = engine;
    return () => engine.dispose();
  }, []);

  const handleResult = useCallback((r: TunerResult | null) => {
    setResult(r);
  }, []);

  const handleError = useCallback((msg: string) => {
    setError(msg);
    setListening(false);
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.onResult = handleResult;
    engine.onError = handleError;
  }, [handleResult, handleError]);

  async function toggle() {
    const engine = engineRef.current;
    if (!engine) return;
    if (listening) {
      engine.stop();
      setListening(false);
      setResult(null);
    } else {
      setError(null);
      await engine.start();
      if (engine.isListening) {
        setListening(true);
      }
    }
  }

  const noteColor = result ? getNoteColor(result.note) : undefined;
  const absCents = result ? Math.abs(result.cents) : 0;
  const dotColor = !result
    ? "bg-white/30"
    : absCents < 5
      ? "bg-green-400"
      : absCents < 15
        ? "bg-yellow-400"
        : "";

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border shadow-lg text-xs font-mono text-text hover:bg-white/10 transition-colors"
        title="Tuner"
      >
        {listening && result ? result.note : "♪"}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-64 rounded-lg bg-card border border-border shadow-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-subtle uppercase tracking-wide">
          Tuner
        </span>
        <button
          onClick={() => setExpanded(false)}
          className="text-subtle hover:text-text text-xs"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-500/30 bg-red-900/20 px-2 py-1.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Note display */}
      <div className="flex flex-col items-center mb-3">
        <div className="flex items-baseline gap-0.5">
          <span
            className="text-4xl font-bold font-mono"
            style={{ color: noteColor }}
          >
            {result ? result.note : "—"}
          </span>
          {result && (
            <span className="text-sm font-mono text-subtle">{result.octave}</span>
          )}
        </div>
        <span className="text-[11px] font-mono text-subtle">
          {result ? `${result.frequency.toFixed(1)} Hz` : "No signal"}
        </span>
      </div>

      {/* Cents gauge */}
      <div className="relative mb-3 h-5 rounded-full bg-white/5 overflow-hidden">
        {/* Center tick */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/20 -translate-x-px" />
        {/* Moving dot */}
        <div
          className={`absolute top-1/2 h-3 w-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ${dotColor}`}
          style={{
            left: result ? `${50 + result.cents}%` : "50%",
            backgroundColor:
              result && absCents >= 15 ? noteColor : undefined,
            boxShadow:
              result && absCents < 5
                ? "0 0 8px rgba(74, 222, 128, 0.6)"
                : undefined,
          }}
        />
        {/* Cents label */}
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-subtle">
          {result ? `${result.cents > 0 ? "+" : ""}${result.cents}¢` : ""}
        </span>
      </div>

      {/* Start/Stop button */}
      <button
        onClick={toggle}
        className={`w-full rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
          listening
            ? "border-red-500/50 text-red-400 hover:bg-red-900/20"
            : "border-border text-text hover:bg-white/10"
        }`}
      >
        {listening ? "Stop" : "Start"}
      </button>
    </div>
  );
}
