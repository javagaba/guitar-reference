import { useAppContext } from "../context/AppContext";
import { FRET_MARKERS, FRETBOARD, getDegreeColor, getScaleDegree, isNoteInScale, noteIndex, STRING_LABELS } from "../music";
import { Card } from "./Card";
import { NoteCircle } from "./NoteCircle";
import { SectionTitle } from "./SectionTitle";

export function Fretboard() {
  const { scaleNotes, rootNote, showIntervals, toggleIntervals } = useAppContext();
  const hasScale = scaleNotes.length > 0;
  const rootIdx = rootNote ? noteIndex(rootNote) : -1;

  return (
    <Card className="mx-auto mt-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <SectionTitle>Fretboard</SectionTitle>
        {hasScale && (
          <button
            onClick={toggleIntervals}
            className="rounded-md bg-white/10 px-3 py-1 font-mono text-xs text-subtle transition-colors hover:bg-white/15"
          >
            {showIntervals ? "Intervals" : "Notes"}
          </button>
        )}
      </div>
      <div className="overflow-x-auto py-4">
        <div className="min-w-[800px]">
          {/* Fret numbers */}
          <div className="mb-2 flex items-center">
            <div className="w-7 shrink-0" />
            {FRETBOARD[0].map((_, fret) => (
              <div
                key={fret}
                className={`w-14 text-center font-mono text-[10px] ${
                  FRET_MARKERS.includes(fret)
                    ? "text-subtle"
                    : "text-[#555]"
                }`}
                style={{
                  borderLeft:
                    fret === 0
                      ? "3px solid transparent"
                      : "1px solid transparent",
                }}
              >
                {fret === 0 ? "Open" : fret}
              </div>
            ))}
          </div>

          {/* Strings */}
          {FRETBOARD.map((string, stringIndex) => (
            <div key={stringIndex} className="mb-1 flex items-center">
              <div className="w-7 font-mono text-[11px] font-semibold text-muted">
                {STRING_LABELS[stringIndex]}
              </div>
              {string.map((note, fret) => {
                const inScale = hasScale && isNoteInScale(note, scaleNotes);
                const isRoot = hasScale && noteIndex(note) === rootIdx;
                const dimmed = hasScale && !inScale;

                const degree = hasScale ? getScaleDegree(note, scaleNotes) : null;
                const label = showIntervals && degree != null
                  ? degree === 1 ? "R" : String(degree)
                  : undefined;

                let emphasis: "third" | "fifth" | null = null;
                if (hasScale && inScale && rootIdx >= 0) {
                  const semitones = ((noteIndex(note) - rootIdx) % 12 + 12) % 12;
                  if (semitones === 3 || semitones === 4) emphasis = "third";
                  else if (semitones === 7) emphasis = "fifth";
                }

                return (
                  <div
                    key={fret}
                    className="flex w-14 justify-center py-1"
                    style={{
                      borderLeft:
                        fret === 0
                          ? "3px solid #555"
                          : "1px solid #333",
                      backgroundColor: FRET_MARKERS.includes(fret)
                        ? "rgba(255,255,255,0.02)"
                        : "transparent",
                    }}
                  >
                    <NoteCircle
                      note={note}
                      size={28}
                      dimmed={dimmed}
                      isRoot={isRoot}
                      label={label}
                      emphasis={emphasis}
                      colorOverride={showIntervals && degree != null ? getDegreeColor(degree) : undefined}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Fret dot markers */}
          <div className="mt-2 flex items-center">
            <div className="w-7 shrink-0" />
            {FRETBOARD[0].map((_, fret) => (
              <div
                key={fret}
                className="w-14 text-center text-subtle"
                style={{
                  borderLeft:
                    fret === 0
                      ? "3px solid transparent"
                      : "1px solid transparent",
                }}
              >
                {fret === 12 || fret === 24 ? "••" : FRET_MARKERS.includes(fret) ? "•" : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
