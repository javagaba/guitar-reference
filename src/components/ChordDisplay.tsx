import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getChordVoicings } from "../chordVoicings";
import {
  getChordInversions,
  getChordTones,
  getNoteColor,
  parseChordName,
} from "../music";
import { isStandardIntervalTuning } from "../tunings";
import type { VoicingCategory } from "../types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    const parsed = parseChordName(selectedChord);
    if (!parsed) return [];
    const tones = getChordTones(selectedChord);
    if (!tones) return [];
    return getChordInversions(selectedChord, parsed.root, tones.notes);
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
    <div
      className={`collapsible${isOpen ? " collapsible-open" : ""}`}
      role="region"
      aria-live="polite"
      aria-label="Chord voicing details"
    >
      <div>
        {isOpen && (
          <Card ref={cardRef} className="mx-auto mt-6 max-w-[1200px]">
            <SectionTitle>Chord Voicing</SectionTitle>
            <Tabs value={tab} onValueChange={(val) => setTab(val as "voicings" | "inversions")}>
              <div className="flex items-center gap-3 pb-1 pt-2">
                <span
                  className="font-mono text-lg font-bold"
                  style={{ color: getNoteColor(selectedChord!) }}
                >
                  {selectedChord}
                </span>

                {inversions.length > 0 && (
                  <TabsList className="rounded-full bg-white/10 p-0.5 font-mono text-xs h-auto">
                    <TabsTrigger
                      value="voicings"
                      className="rounded-full px-3 py-1 h-auto min-w-0 text-xs data-[state=active]:bg-white/20 data-[state=active]:text-text text-subtle hover:text-text border-none shadow-none"
                    >
                      Voicings
                    </TabsTrigger>
                    <TabsTrigger
                      value="inversions"
                      className="rounded-full px-3 py-1 h-auto min-w-0 text-xs data-[state=active]:bg-white/20 data-[state=active]:text-text text-subtle hover:text-text border-none shadow-none"
                    >
                      Inversions
                    </TabsTrigger>
                  </TabsList>
                )}

                <Button
                  onClick={() => selectChord(null)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Close
                </Button>
              </div>

              {!isStandard && (
                <Alert variant="warning" className="mb-2 px-3 py-1.5 text-xs">
                  Voicings shown are for standard tuning
                </Alert>
              )}

              <TabsContent value="voicings">
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
              </TabsContent>

              <TabsContent value="inversions">
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
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
}
