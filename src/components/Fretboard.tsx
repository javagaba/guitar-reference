import { FRETBOARD, STRING_LABELS, FRET_MARKERS } from "../music";
import { NoteCircle } from "./NoteCircle";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

export function Fretboard() {
  return (
    <Card className="mx-auto mt-6 max-w-[1200px]">
      <SectionTitle>Fretboard Notes</SectionTitle>
      <div className="overflow-x-auto py-4">
        <div className="min-w-[800px]">
          {/* Fret numbers */}
          <div className="mb-2 flex pl-8">
            {Array.from({ length: 13 }, (_, fret) => (
              <div
                key={fret}
                className={`w-14 text-center font-mono text-[10px] ${
                  FRET_MARKERS.includes(fret)
                    ? "text-subtle"
                    : "text-[#555]"
                }`}
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
              {string.map((note, fret) => (
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
                  <NoteCircle note={note} size={28} />
                </div>
              ))}
            </div>
          ))}

          {/* Fret dot markers */}
          <div className="mt-2 flex pl-8">
            {Array.from({ length: 13 }, (_, fret) => (
              <div key={fret} className="w-14 text-center text-subtle">
                {fret === 12 ? "••" : FRET_MARKERS.includes(fret) ? "•" : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
