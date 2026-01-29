import { useMemo } from "react";
import { playScale } from "../audio";
import { useAppContext } from "../context/AppContext";
import { getNoteColor, getScaleTriads, SCALE_DEFINITIONS } from "../music";
import { SectionTitle } from "./SectionTitle";

const CHROMATIC_KEYS = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

const categories = ["Diatonic", "Pentatonic", "Blues", "Mode", "Harmonic", "Melodic", "Exotic"] as const;

export function ScaleSelector() {
  const { selectedKey, selectedScale, selectedChord, scaleNotes, selectKey, selectScale, selectChord, clearAll } = useAppContext();

  const def = SCALE_DEFINITIONS.find((s) => s.name === selectedScale);

  const triads = useMemo(() => {
    if (!selectedKey || !def) return null;
    return getScaleTriads(selectedKey, def.intervals);
  }, [selectedKey, def]);

  return (
    <div className="mx-auto max-w-[1200px]">
      <SectionTitle>Scale / Mode Selector</SectionTitle>
      <div className="flex flex-wrap items-center gap-4 py-2">
        <select
          value={selectedKey ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val) selectKey(val, false);
            else selectKey(null);
          }}
          aria-label="Select key"
          className="rounded border border-border bg-card px-3 py-2 font-mono text-sm text-text"
        >
          <option value="">Key</option>
          {CHROMATIC_KEYS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <select
          value={selectedScale}
          onChange={(e) => selectScale(e.target.value)}
          aria-label="Select scale"
          className="rounded border border-border bg-card px-3 py-2 font-mono text-sm text-text"
        >
          {categories.map((cat) => (
            <optgroup key={cat} label={cat}>
              {SCALE_DEFINITIONS.filter((s) => s.category === cat).map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {selectedKey && (
          <button
            onClick={() => playScale(scaleNotes)}
            className="rounded border border-border px-3 py-1 text-xs text-subtle transition-colors active:scale-95 hover:border-subtle hover:text-text"
            aria-label="Play scale"
            title="Play scale"
          >
            &#9654;
          </button>
        )}

        {selectedKey && (
          <button
            onClick={clearAll}
            className="rounded border border-border px-3 py-1 text-xs text-subtle transition-colors active:scale-95 hover:border-subtle hover:text-text"
            aria-label="Clear selection"
          >
            Clear
          </button>
        )}

        {triads && (
          <div className="flex items-center gap-1 border-l border-border pl-4">
            {triads.map((t) => {
              const isActive = selectedChord === t.chordName;
              const color = getNoteColor(t.root);
              return (
                <button
                  key={t.degree}
                  onClick={() => selectChord(isActive ? null : t.chordName)}
                  className="flex flex-col items-center rounded px-2 py-1 text-xs transition-colors hover:bg-card"
                  style={isActive ? { boxShadow: `0 0 0 1.5px ${color}`, background: "var(--color-card)" } : undefined}
                >
                  <span className="text-[10px] text-subtle">{t.numeral}</span>
                  <span className="font-mono font-medium" style={{ color }}>
                    {t.chordName}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
