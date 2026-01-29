import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getChordVoicings } from "../chordVoicings";
import {
  CHORD_FORMULAS,
  getChordInversions,
  getNoteColor,
  resolveChordFormula,
} from "../music";
import { isStandardIntervalTuning } from "../tunings";
import type { VoicingCategory } from "../types";
import { Card } from "./Card";
import { ChordDiagram } from "./ChordDiagram";
import { SectionTitle } from "./SectionTitle";

const CATEGORY_LABELS: Record<VoicingCategory, string> = {
  open: "Open",
  "barre-e": "E-Form Barre",
  "barre-a": "A-Form Barre",
  shell: "Shell",
  drop2: "Drop-2",
  drop3: "Drop-3",
  partial: "Partial",
};

function parseChordRoot(chord: string): string {
  const match = chord.match(/^([A-G][♯♭]?)/);
  return match ? match[1] : chord;
}

function findChordFormula(chord: string): string | null {
  const root = parseChordRoot(chord);
  const quality = chord.slice(root.length);

  // Map quality suffix to formula name
  const qualityMap: Record<string, string> = {
    "": "Major",
    "m": "Minor",
    "7": "Dominant 7",
    "maj7": "Major 7",
    "m7": "Minor 7",
    "m7♭5": "Half-Dim (m7♭5)",
    "°": "Diminished",
    "°7": "Diminished 7",
    "+": "Augmented",
    "sus2": "Sus2",
    "sus4": "Sus4",
    "6": "6",
    "m6": "Minor 6",
    "9": "9",
    "maj9": "Major 9",
    "m9": "Minor 9",
    "add9": "Add9",
    "5": "Power (5)",
  };

  const formulaName = qualityMap[quality];
  if (!formulaName) return null;
  const formula = CHORD_FORMULAS.find((f) => f.name === formulaName);
  return formula?.formula ?? null;
}

export function ChordDisplay() {
  const { selectedChord, selectChord, selectedTuning } = useAppContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"voicings" | "inversions">("voicings");

  useEffect(() => {
    if (selectedChord && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    setTab("voicings");
  }, [selectedChord]);

  const isStandard = useMemo(
    () => isStandardIntervalTuning(selectedTuning),
    [selectedTuning],
  );

  const voicings = selectedChord ? getChordVoicings(selectedChord) : [];
  const isOpen = !!selectedChord;

  // Group voicings by category
  const grouped = useMemo(() => {
    const groups = new Map<VoicingCategory | "uncategorized", typeof voicings>();
    for (const v of voicings) {
      const cat = v.category ?? "uncategorized";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(v);
    }
    return groups;
  }, [voicings]);

  // Inversions
  const inversions = useMemo(() => {
    if (!selectedChord) return [];
    const root = parseChordRoot(selectedChord);
    const formula = findChordFormula(selectedChord);
    if (!formula) return [];
    const notes = resolveChordFormula(root, formula);
    return getChordInversions(selectedChord, root, notes);
  }, [selectedChord]);

  // Get voicings for a specific bass note
  const inversionVoicings = useMemo(() => {
    if (!selectedChord) return new Map<string, typeof voicings>();
    const map = new Map<string, typeof voicings>();
    for (const inv of inversions) {
      const matching = voicings.filter((v) => v.bassNote === inv.bassNote);
      if (matching.length > 0) {
        map.set(inv.bassNote, matching);
      }
    }
    return map;
  }, [selectedChord, inversions, voicings]);

  return (
    <div className={`collapsible${isOpen ? " collapsible-open" : ""}`}>
      <div>
        {isOpen && (
          <Card ref={cardRef} className="mx-auto mt-6 max-w-[1200px]">
            <SectionTitle>Chord Voicing</SectionTitle>
            <div className="flex items-center gap-3 pb-1 pt-2">
              <span
                className="font-mono text-lg font-bold"
                style={{ color: getNoteColor(selectedChord!) }}
              >
                {selectedChord}
              </span>

              {inversions.length > 0 && (
                <div className="flex rounded-full bg-white/10 p-0.5 font-mono text-xs">
                  <button
                    onClick={() => setTab("voicings")}
                    className={`rounded-full px-3 py-1 transition-colors ${tab === "voicings" ? "bg-white/20 text-text" : "text-subtle hover:text-text"}`}
                  >
                    Voicings
                  </button>
                  <button
                    onClick={() => setTab("inversions")}
                    className={`rounded-full px-3 py-1 transition-colors ${tab === "inversions" ? "bg-white/20 text-text" : "text-subtle hover:text-text"}`}
                  >
                    Inversions
                  </button>
                </div>
              )}

              <button
                onClick={() => selectChord(null)}
                className="rounded border border-border px-3 py-1.5 text-xs text-subtle transition-colors hover:border-subtle hover:text-text"
              >
                Close
              </button>
            </div>

            {!isStandard && (
              <div className="mb-2 rounded bg-yellow-900/20 px-3 py-1.5 text-xs text-yellow-400/80">
                Voicings shown are for standard tuning
              </div>
            )}

            {tab === "voicings" && (
              <>
                {voicings.length > 0 ? (
                  grouped.size > 1 ? (
                    // Multiple categories: show grouped
                    <div className="space-y-4 py-3">
                      {[...grouped.entries()].map(([cat, vList]) => (
                        <div key={cat}>
                          <div className="mb-1 text-[11px] font-medium text-subtle uppercase tracking-wide">
                            {cat === "uncategorized"
                              ? ""
                              : CATEGORY_LABELS[cat as VoicingCategory] ?? cat}
                          </div>
                          <div className="flex gap-3 sm:gap-6 overflow-x-auto">
                            {vList.map((v, i) => (
                              <div key={i} className="flex flex-col items-center gap-1">
                                <ChordDiagram voicing={v} />
                                <span className="text-[9px] text-subtle">
                                  {v.label ?? (v.baseFret > 1 ? `Fret ${v.baseFret}` : "")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Single category or uncategorized
                    <div className="flex gap-3 sm:gap-6 overflow-x-auto py-3">
                      {voicings.map((v, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <ChordDiagram voicing={v} />
                          <span className="text-[9px] text-subtle">
                            {v.label ?? (v.baseFret > 1 ? `Fret ${v.baseFret}` : "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="py-4 text-center text-xs text-subtle">
                    No voicing data available for {selectedChord}
                  </div>
                )}
              </>
            )}

            {tab === "inversions" && (
              <div className="space-y-4 py-3">
                {inversions.map((inv) => {
                  const matchingVoicings = inversionVoicings.get(inv.bassNote) ?? [];
                  return (
                    <div key={inv.inversionNumber}>
                      <div className="mb-1 flex items-center gap-3">
                        <span className="font-mono text-sm font-medium text-text">
                          {inv.slashNotation}
                        </span>
                        <span className="text-[11px] text-subtle">{inv.label}</span>
                        <span className="text-[11px] text-muted">
                          Bass: {inv.bassNote}
                        </span>
                      </div>
                      <div className="text-[11px] text-subtle mb-2">
                        {inv.notes.join(" - ")}
                      </div>
                      {matchingVoicings.length > 0 && (
                        <div className="flex gap-3 sm:gap-6 overflow-x-auto">
                          {matchingVoicings.map((v, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <ChordDiagram voicing={v} highlightBass={inv.bassNote} />
                              <span className="text-[9px] text-subtle">
                                {v.label ?? (v.baseFret > 1 ? `Fret ${v.baseFret}` : "")}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
