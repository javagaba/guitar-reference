import { useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { getChordVoicings } from "../chordVoicings";
import { getNoteColor } from "../music";
import { Card } from "./Card";
import { ChordDiagram } from "./ChordDiagram";
import { SectionTitle } from "./SectionTitle";

export function ChordDisplay() {
  const { selectedChord, selectChord } = useAppContext();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChord && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedChord]);

  const voicings = selectedChord ? getChordVoicings(selectedChord) : [];
  const isOpen = !!selectedChord;

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
              <button
                onClick={() => selectChord(null)}
                className="rounded border border-border px-2 py-0.5 text-[10px] text-subtle transition-colors hover:border-subtle hover:text-text"
              >
                Close
              </button>
            </div>
            {voicings.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto py-3">
                {voicings.map((v, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <ChordDiagram voicing={v} />
                    {v.baseFret > 1 && (
                      <span className="text-[9px] text-subtle">Fret {v.baseFret}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-subtle">
                No voicing data available for {selectedChord}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
