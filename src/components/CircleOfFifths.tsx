import { CIRCLE_MAJOR, CIRCLE_MINOR, getNoteColor } from "../music";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

export function CircleOfFifths() {
  return (
    <Card className="mx-auto mt-6 max-w-[400px]">
      <SectionTitle>Circle of Fifths</SectionTitle>
      <div className="flex justify-center py-5">
        <svg viewBox="0 0 300 300" width="260" height="260">
          {CIRCLE_MAJOR.map((note, i) => {
            const angle = ((i * 30 - 90) * Math.PI) / 180;
            const x = 150 + 115 * Math.cos(angle);
            const y = 150 + 115 * Math.sin(angle);
            return (
              <g key={note}>
                <circle cx={x} cy={y} r="18" fill={getNoteColor(note)} />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {note}
                </text>
              </g>
            );
          })}

          {CIRCLE_MINOR.map((note, i) => {
            const angle = ((i * 30 - 90) * Math.PI) / 180;
            const x = 150 + 70 * Math.cos(angle);
            const y = 150 + 70 * Math.sin(angle);
            return (
              <g key={note}>
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill="#333"
                  stroke="#555"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#aaa"
                  fontSize="8"
                  fontWeight="500"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {note}
                </text>
              </g>
            );
          })}

          <text
            x="150"
            y="150"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#555"
            fontSize="8"
            fontWeight="600"
          >
            5ths →
          </text>
        </svg>
      </div>
    </Card>
  );
}
