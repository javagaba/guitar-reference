import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import { useMemo } from "react";
import { playScale } from "../audio";
import { useAppContext } from "../context/AppContext";
import { getNoteColor, getScaleTriads, SCALE_DEFINITIONS } from "../music";
import { TUNINGS } from "../tunings";
import { SectionTitle } from "./SectionTitle";

const CHROMATIC_KEYS = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
];

const categories = [
  "Diatonic",
  "Pentatonic",
  "Blues",
  "Mode",
  "Harmonic",
  "Melodic",
  "Exotic",
] as const;

const tuningCategories = ["Standard", "Drop", "Open", "Other"] as const;

export function ScaleSelector() {
  const {
    selectedKey,
    selectedScale,
    selectedChord,
    scaleNotes,
    selectedTuning,
    selectKey,
    selectScale,
    selectChord,
    setTuning,
    clearAll,
  } = useAppContext();

  const def = SCALE_DEFINITIONS.find((s) => s.name === selectedScale);

  const triads = useMemo(() => {
    if (!selectedKey || !def) return null;
    return getScaleTriads(selectedKey, def.intervals);
  }, [selectedKey, def]);

  return (
    <div className="mx-auto max-w-[1200px]">
      <SectionTitle>Scale / Mode</SectionTitle>
      <div className="flex flex-wrap items-center gap-4">
        <SelectNative
          value={selectedKey ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val) selectKey(val, false);
            else selectKey(null);
          }}
          aria-label="Select key"
          className="w-auto font-mono"
        >
          <option value="">Key</option>
          {CHROMATIC_KEYS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </SelectNative>

        <SelectNative
          value={selectedScale}
          onChange={(e) => selectScale(e.target.value)}
          aria-label="Select scale"
          className="w-auto font-mono"
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
        </SelectNative>

        <SelectNative
          value={selectedTuning.name}
          onChange={(e) => {
            const found = TUNINGS.find((t) => t.name === e.target.value);
            if (found) setTuning(found);
          }}
          aria-label="Select tuning"
          className="w-auto font-mono"
        >
          {tuningCategories.map((cat) => (
            <optgroup key={cat} label={cat}>
              {TUNINGS.filter((t) => t.category === cat).map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({[...t.notes].reverse().join("")})
                </option>
              ))}
            </optgroup>
          ))}
        </SelectNative>

        {selectedKey && (
          <Button
            onClick={() => playScale(scaleNotes)}
            variant="outline"
            size="sm"
            aria-label="Play scale"
            title="Play scale"
          >
            &#9654;
          </Button>
        )}

        {selectedKey && (
          <Button
            onClick={clearAll}
            variant="outline"
            size="sm"
            aria-label="Clear selection"
          >
            Clear
          </Button>
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
                  style={
                    isActive
                      ? {
                          boxShadow: `0 0 0 1.5px ${color}`,
                          background: "var(--color-card)",
                        }
                      : undefined
                  }
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
