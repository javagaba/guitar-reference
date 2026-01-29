import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { getBorrowedChords, getNoteColor, getSecondaryDominants } from "../music";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

export function SecondaryAndBorrowed() {
  const { selectedKey, isMinor, selectChord } = useAppContext();

  const secondaryDominants = useMemo(() => {
    if (!selectedKey) return [];
    return getSecondaryDominants(selectedKey, isMinor);
  }, [selectedKey, isMinor]);

  const borrowedChords = useMemo(() => {
    if (!selectedKey) return [];
    return getBorrowedChords(selectedKey, isMinor);
  }, [selectedKey, isMinor]);

  if (!selectedKey) return null;

  return (
    <Card className="col-span-full">
      <SectionTitle>Secondary Dominants & Borrowed Chords</SectionTitle>

      {/* Secondary Dominants */}
      <div className="mt-3">
        <div className="mb-2 text-[11px] font-medium text-subtle uppercase tracking-wide">
          Secondary Dominants
        </div>
        <div className="flex flex-wrap gap-2">
          {secondaryDominants.map((sd) => (
            <button
              key={sd.symbol}
              onClick={() => selectChord(sd.chord)}
              className="group flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs transition-colors hover:bg-card"
            >
              <span className="text-[10px] text-subtle">{sd.symbol}</span>
              <span className="font-mono font-medium" style={{ color: getNoteColor(sd.chord) }}>
                {sd.chord}
              </span>
              <span className="text-[10px] text-muted">
                → {sd.resolvesTo}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Borrowed Chords */}
      <div className="mt-4">
        <div className="mb-2 text-[11px] font-medium text-subtle uppercase tracking-wide">
          Borrowed Chords ({isMinor ? "from Parallel Major" : "from Parallel Minor"})
        </div>
        <div className="flex flex-wrap gap-2">
          {borrowedChords.map((bc) => (
            <button
              key={bc.numeral}
              onClick={() => selectChord(bc.chord)}
              className="group flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs transition-colors hover:bg-card"
            >
              <span className="text-[10px] text-subtle">{bc.numeral}</span>
              <span className="font-mono font-medium" style={{ color: getNoteColor(bc.chord) }}>
                {bc.chord}
              </span>
              <span className="text-[10px] text-muted">{bc.source}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
