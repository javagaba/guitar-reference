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

export function ChordDiagram({ voicing }: { voicing: ChordVoicing }) {
  const { frets, fingers, barreAt, barreStrings, baseFret } = voicing;
  const showBaseFret = baseFret > 1;

  function stringX(s: number) {
    return PADDING_LEFT + s * STRING_SPACING;
  }
  function fretY(f: number) {
    return PADDING_TOP + f * FRET_SPACING;
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
          strokeWidth={f === 0 && baseFret > 1 ? 1 : 1}
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

        if (fret === -1) {
          // Muted string
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
          // Open string (only for baseFret === 1)
          if (fret === 0) {
            return (
              <circle
                key={`o-${s}`}
                cx={x}
                cy={fretY(0) - 12}
                r={5}
                fill="none"
                stroke="#999"
                strokeWidth="1.5"
              />
            );
          }
        }

        // Finger position
        const displayFret = fret - baseFret + 1;
        if (displayFret < 1 || displayFret > FRETS_SHOWN) return null;

        // Skip individual dots if they're covered by barre
        if (
          barreAt !== undefined &&
          barreStrings &&
          fret === barreAt &&
          s >= barreStrings[0] &&
          s <= barreStrings[1]
        ) {
          return null;
        }

        return (
          <g key={`dot-${s}`}>
            <circle
              cx={x}
              cy={fretY(displayFret) - FRET_SPACING / 2}
              r={DOT_R}
              fill="white"
            />
            {fingers[s] > 0 && (
              <text
                x={x}
                y={fretY(displayFret) - FRET_SPACING / 2 + 4}
                textAnchor="middle"
                fill="#111"
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
