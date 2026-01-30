import { useCallback, useEffect, useRef, useState } from "react";
import { getNoteColor } from "../music";
import { TunerEngine, STANDARD_TUNING, type TunerResult } from "../tuner";

interface TunerProps {
  active: boolean;
  onClose: () => void;
}

export function Tuner({ active, onClose }: TunerProps) {
  const [result, setResult] = useState<TunerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [targetString, setTargetString] = useState<number | null>(null);
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
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.onResult = handleResult;
    engine.onError = handleError;
  }, [handleResult, handleError]);

  // Auto-start/stop when active changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (active) {
      setError(null);
      engine.start();
    } else {
      engine.stop();
      setResult(null);
    }
  }, [active]);

  // Find closest matching string
  const closestString = result
    ? STANDARD_TUNING.reduce((best, s) => {
        const diff = Math.abs(result.frequency - s.freq);
        const bestDiff = Math.abs(result.frequency - best.freq);
        return diff < bestDiff ? s : best;
      })
    : null;

  // Compute cents deviation from target string if one is selected
  const displayCents = (() => {
    if (!result) return 0;
    if (targetString !== null) {
      const target = STANDARD_TUNING.find((s) => s.string === targetString);
      if (target) {
        const semitones = 12 * Math.log2(result.frequency / target.freq);
        return Math.round(semitones * 100);
      }
    }
    return result.cents;
  })();

  const clampedCents = Math.max(-50, Math.min(50, displayCents));
  const noteColor = result ? getNoteColor(result.note) : undefined;
  const absCents = Math.abs(clampedCents);
  const inTune = absCents < 5;

  // Arc gauge geometry
  const arcRadius = 70;
  const arcCx = 80;
  const arcCy = 80;
  const startAngle = -135;
  const endAngle = -45;
  const needleAngle = startAngle + ((clampedCents + 50) / 100) * (endAngle - startAngle);

  function polarToCart(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(r: number, a1: number, a2: number) {
    const s = polarToCart(arcCx, arcCy, r, a1);
    const e = polarToCart(arcCx, arcCy, r, a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const needleTip = polarToCart(arcCx, arcCy, arcRadius - 4, needleAngle);
  const needleBase = polarToCart(arcCx, arcCy, 12, needleAngle);

  // Map ±5¢ and ±15¢ to arc angle ranges
  const greenStart = startAngle + (45 / 100) * (endAngle - startAngle);
  const greenEnd = startAngle + (55 / 100) * (endAngle - startAngle);
  const yellowStartL = startAngle + (35 / 100) * (endAngle - startAngle);
  const yellowEndR = startAngle + (65 / 100) * (endAngle - startAngle);

  return (
    <div className="w-72 rounded-lg bg-card border border-border shadow-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-subtle uppercase tracking-wide">
          Tuner
        </span>
        <button onClick={onClose} className="text-subtle hover:text-text text-xs">
          x
        </button>
      </div>

      {error && (
        <div className="mb-2 rounded border border-red-500/30 bg-red-900/20 px-2 py-1.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Note display */}
      <div className="flex flex-col items-center mb-1">
        <div className="flex items-baseline gap-0.5">
          <span
            className="text-4xl font-bold font-mono"
            style={{ color: noteColor }}
          >
            {result ? result.note : "--"}
          </span>
          {result && (
            <span className="text-sm font-mono text-subtle">{result.octave}</span>
          )}
        </div>
        <span className="text-[11px] font-mono text-subtle">
          {result ? `${result.frequency.toFixed(1)} Hz` : "Listening..."}
        </span>
      </div>

      {/* Arc gauge */}
      <div className="flex justify-center mb-1">
        <svg width="160" height="100" viewBox="0 0 160 100">
          {/* Background arc */}
          <path
            d={arcPath(arcRadius, startAngle, endAngle)}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Yellow bands */}
          <path
            d={arcPath(arcRadius, yellowStartL, greenStart)}
            fill="none"
            stroke="rgba(234,179,8,0.3)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d={arcPath(arcRadius, greenEnd, yellowEndR)}
            fill="none"
            stroke="rgba(234,179,8,0.3)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Green center band */}
          <path
            d={arcPath(arcRadius, greenStart, greenEnd)}
            fill="none"
            stroke="rgba(74,222,128,0.4)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Center tick */}
          {(() => {
            const t = polarToCart(arcCx, arcCy, arcRadius - 6, (startAngle + endAngle) / 2);
            const t2 = polarToCart(arcCx, arcCy, arcRadius + 4, (startAngle + endAngle) / 2);
            return (
              <line
                x1={t.x} y1={t.y} x2={t2.x} y2={t2.y}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
              />
            );
          })()}
          {/* Needle */}
          <line
            x1={needleBase.x}
            y1={needleBase.y}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke={
              !result
                ? "rgba(255,255,255,0.2)"
                : inTune
                  ? "#4ade80"
                  : absCents < 15
                    ? "#eab308"
                    : noteColor || "#e8e8e8"
            }
            strokeWidth="2"
            strokeLinecap="round"
            className="tuner-needle"
          />
          {/* Center dot */}
          <circle cx={arcCx} cy={arcCy} r="3" fill="rgba(255,255,255,0.4)" />
          {/* In-tune glow */}
          {result && inTune && (
            <circle
              cx={needleTip.x}
              cy={needleTip.y}
              r="5"
              fill="#4ade80"
              opacity="0.4"
              className="tuner-glow"
            />
          )}
          {/* Cents label */}
          <text
            x={arcCx}
            y={arcCy + 18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
          >
            {result
              ? `${clampedCents > 0 ? "+" : ""}${clampedCents}¢`
              : ""}
          </text>
        </svg>
      </div>

      {/* String targets */}
      <div className="flex justify-center gap-1.5">
        {STANDARD_TUNING.map((s) => {
          const isClosest =
            closestString && s.string === closestString.string && !targetString;
          const isTarget = targetString === s.string;
          const isHighlighted = isClosest || isTarget;
          const stringNoteColor = getNoteColor(s.note);

          return (
            <button
              key={s.string}
              onClick={() =>
                setTargetString((prev) =>
                  prev === s.string ? null : s.string
                )
              }
              className={`flex flex-col items-center rounded px-1.5 py-1 text-[10px] font-mono transition-all ${
                isTarget
                  ? "bg-white/10 ring-1 ring-white/30"
                  : isHighlighted
                    ? "bg-white/5"
                    : "hover:bg-white/5"
              }`}
              style={{
                color: isHighlighted ? stringNoteColor : "rgba(255,255,255,0.4)",
              }}
              title={`String ${s.string}: ${s.note}${s.octave} (${s.freq} Hz)`}
            >
              <span className="font-semibold text-xs leading-none">
                {s.note}
                <sub className="text-[8px] opacity-60">{s.octave}</sub>
              </span>
              <span className="text-[8px] opacity-50">{s.string}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
