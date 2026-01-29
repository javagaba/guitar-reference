import { useAppContext } from "../context/AppContext";
import { FRET_MARKERS, FRETBOARD, isNoteInScale, noteIndex, STRING_LABELS } from "../music";
import { Card } from "./Card";
import { NoteCircle } from "./NoteCircle";
import { SectionTitle } from "./SectionTitle";

export function Fretboard() {
  const { scaleNotes, rootNote } = useAppContext();
  const hasScale = scaleNotes.length > 0;
  const rootIdx = rootNote ? noteIndex(rootNote) : -1;

  return (
    <Card className="mx-auto mt-6 max-w-[1200px]">
      <SectionTitle>Fretboard</SectionTitle>
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
                    <NoteCircle note={note} size={28} dimmed={dimmed} isRoot={isRoot} />
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
