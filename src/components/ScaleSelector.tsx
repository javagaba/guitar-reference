import { playScale } from "../audio";
import { useAppContext } from "../context/AppContext";
import { SCALE_DEFINITIONS } from "../music";
import { SectionTitle } from "./SectionTitle";

const CHROMATIC_KEYS = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

const categories = ["Diatonic", "Pentatonic", "Blues", "Mode", "Harmonic", "Melodic", "Exotic"] as const;

export function ScaleSelector() {
  const { selectedKey, selectedScale, scaleNotes, selectKey, selectScale, clearAll } = useAppContext();

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
          className="rounded border border-border bg-card px-2 py-1 font-mono text-sm text-text"
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
          className="rounded border border-border bg-card px-2 py-1 font-mono text-sm text-text"
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

      </div>
    </div>
  );
}
