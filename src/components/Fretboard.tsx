import { playNote } from "../audio";
import { useAppContext } from "../context/AppContext";
import {
  FRET_MARKERS,
  FRETBOARD,
  getDegreeColor,
  getScaleDegree,
  isNoteInScale,
  noteIndex,
  STRING_LABELS,
} from "../music";
import { Card } from "./Card";
import { NoteCircle } from "./NoteCircle";
import { SectionTitle } from "./SectionTitle";

export function Fretboard() {
  const { scaleNotes, rootNote, showIntervals, toggleIntervals } =
    useAppContext();
  const hasScale = scaleNotes.length > 0;
  const rootIdx = rootNote ? noteIndex(rootNote) : -1;

  return (
    <Card className="mx-auto mt-6 max-w-300">
      <div className="flex items-center justify-between">
        <SectionTitle>Fretboard</SectionTitle>
        {hasScale && (
          <div className="flex rounded-full bg-white/10 p-0.5 font-mono text-xs">
            <button
              onClick={showIntervals ? toggleIntervals : undefined}
              className={`rounded-full px-3 py-1 transition-colors ${!showIntervals ? "bg-white/20 text-text" : "text-subtle hover:text-text"}`}
            >
              Notes
            </button>
            <button
              onClick={!showIntervals ? toggleIntervals : undefined}
              className={`rounded-full px-3 py-1 transition-colors ${showIntervals ? "bg-white/20 text-text" : "text-subtle hover:text-text"}`}
            >
              Intervals
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto py-4">
        <div className="min-w-200">
          {/* Fret numbers */}
          <div className="mb-2 flex items-center">
            <div className="w-7 shrink-0" />
            {FRETBOARD[0].map((_, fret) => (
              <div
                key={fret}
                className={`w-14 text-center font-mono text-[11px] ${
                  FRET_MARKERS.includes(fret) ? "text-subtle" : "text-[#555]"
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
              <div className="w-7 font-mono text-xs font-semibold text-muted">
                {stringIndex === 0 ? "e" : STRING_LABELS[stringIndex]}
              </div>
              {string.map((note, fret) => {
                const inScale = hasScale && isNoteInScale(note, scaleNotes);
                const isRoot = hasScale && noteIndex(note) === rootIdx;
                const dimmed = hasScale && !inScale;

                const degree = hasScale
                  ? getScaleDegree(note, scaleNotes)
                  : null;
                const label =
                  showIntervals && degree != null
                    ? degree === 1
                      ? "R"
                      : String(degree)
                    : undefined;

                let emphasis: "third" | "fifth" | null = null;
                if (hasScale && inScale && rootIdx >= 0) {
                  const semitones =
                    (((noteIndex(note) - rootIdx) % 12) + 12) % 12;
                  if (semitones === 3 || semitones === 4) emphasis = "third";
                  else if (semitones === 7) emphasis = "fifth";
                }

                return (
                  <div
                    key={fret}
                    className="flex w-14 justify-center py-1"
                    style={{
                      borderLeft:
                        fret === 0 ? "3px solid #555" : "1px solid #333",
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
                      colorOverride={
                        showIntervals && degree != null
                          ? getDegreeColor(degree)
                          : undefined
                      }
                      onClick={() => playNote(stringIndex, fret)}
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
                {fret === 12 || fret === 24
                  ? "••"
                  : FRET_MARKERS.includes(fret)
                    ? "•"
                    : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
