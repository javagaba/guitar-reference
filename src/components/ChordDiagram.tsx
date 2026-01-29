import { getNoteColor, noteIndex } from "../music";
import type { ChordVoicing } from "../types";

const STRINGS = 6;
const FRETS_SHOWN = 5;
const STRING_SPACING = 20;
const FRET_SPACING = 24;
const PADDING_TOP = 28;
const PADDING_LEFT = 20;
const PADDING_BOTTOM = 10;
const DOT_R = 7;
const WIDTH = PADDING_LEFT + (STRINGS - 1) * STRING_SPACING + 20;
const HEIGHT = PADDING_TOP + FRETS_SHOWN * FRET_SPACING + PADDING_BOTTOM;

// Standard tuning note names for each string (low E to high E)
const STANDARD_NOTES = ["E", "A", "D", "G", "B", "E"];
const CHROMATIC = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

function getNoteAtFret(stringIndex: number, fret: number): string {
  const openIdx = noteIndex(STANDARD_NOTES[stringIndex]);
  return CHROMATIC[(openIdx + fret) % 12];
}

interface ChordDiagramProps {
  voicing: ChordVoicing;
  highlightBass?: string;
}

export function ChordDiagram({ voicing, highlightBass }: ChordDiagramProps) {
  const { frets, fingers, barreAt, barreStrings, baseFret } = voicing;

  function stringX(s: number) {
    return PADDING_LEFT + s * STRING_SPACING;
  }
  function fretY(f: number) {
    return PADDING_TOP + f * FRET_SPACING;
  }

  // Find lowest sounding string for bass highlight
  let bassStringIndex = -1;
  if (highlightBass) {
    const bassIdx = noteIndex(highlightBass);
    for (let s = STRINGS - 1; s >= 0; s--) {
      if (frets[s] >= 0) {
        const noteAtString = getNoteAtFret(s, frets[s]);
        if (noteIndex(noteAtString) === bassIdx) {
          bassStringIndex = s;
          break;
        }
      }
    }
  }

  return (
    <svg className="w-[120px] sm:w-[140px]" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      {/* Nut or base fret indicator */}
      {baseFret === 1 ? (
        <line
          x1={stringX(0)}
          y1={fretY(0)}
          x2={stringX(STRINGS - 1)}
          y2={fretY(0)}
          stroke="#ccc"
          strokeWidth="3"
        />
      ) : (
        <text
          x={stringX(0) - 14}
          y={fretY(0.5) + 4}
          fill="#999"
          fontSize="11"
          fontFamily="'JetBrains Mono', monospace"
          textAnchor="middle"
        >
          {baseFret}
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: FRETS_SHOWN + 1 }, (_, f) => (
        <line
          key={`fret-${f}`}
          x1={stringX(0)}
          y1={fretY(f)}
          x2={stringX(STRINGS - 1)}
          y2={fretY(f)}
          stroke="#444"
          strokeWidth={1}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: STRINGS }, (_, s) => (
        <line
          key={`string-${s}`}
          x1={stringX(s)}
          y1={fretY(0)}
          x2={stringX(s)}
          y2={fretY(FRETS_SHOWN)}
          stroke="#555"
          strokeWidth="1"
        />
      ))}

      {/* Barre indicator */}
      {barreAt !== undefined && barreStrings && (
        <rect
          x={stringX(barreStrings[0]) - DOT_R}
          y={fretY(barreAt - baseFret + 1) - FRET_SPACING / 2 - DOT_R}
          width={stringX(barreStrings[1]) - stringX(barreStrings[0]) + DOT_R * 2}
          height={DOT_R * 2}
          rx={DOT_R}
          fill="white"
          opacity="0.9"
        />
      )}

      {/* Finger dots, X, O indicators */}
      {frets.map((fret, s) => {
        const x = stringX(s);
        const isBassHighlight = s === bassStringIndex;

        if (fret === -1) {
          return (
            <text
              key={`x-${s}`}
              x={x}
              y={fretY(0) - 10}
              textAnchor="middle"
              fill="#777"
              fontSize="12"
              fontFamily="'JetBrains Mono', monospace"
            >
              ×
            </text>
          );
        }

        if (fret === 0 || (baseFret > 1 && fret === baseFret && barreAt !== undefined)) {
          if (fret === 0) {
            return (
              <circle
                key={`o-${s}`}
                cx={x}
                cy={fretY(0) - 12}
                r={5}
                fill={isBassHighlight ? getNoteColor(highlightBass!) : "none"}
                stroke={isBassHighlight ? getNoteColor(highlightBass!) : "#999"}
                strokeWidth="1.5"
              />
            );
          }
        }

        const displayFret = fret - baseFret + 1;
        if (displayFret < 1 || displayFret > FRETS_SHOWN) return null;

        if (
          barreAt !== undefined &&
          barreStrings &&
          fret === barreAt &&
          s >= barreStrings[0] &&
          s <= barreStrings[1]
        ) {
          return null;
        }

        const dotColor = isBassHighlight ? getNoteColor(highlightBass!) : "white";
        const textColor = isBassHighlight ? "#fff" : "#111";

        return (
          <g key={`dot-${s}`}>
            <circle
              cx={x}
              cy={fretY(displayFret) - FRET_SPACING / 2}
              r={DOT_R}
              fill={dotColor}
            />
            {fingers[s] > 0 && (
              <text
                x={x}
                y={fretY(displayFret) - FRET_SPACING / 2 + 4}
                textAnchor="middle"
                fill={textColor}
                fontSize="10"
                fontWeight="600"
                fontFamily="'JetBrains Mono', monospace"
              >
                {fingers[s]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
