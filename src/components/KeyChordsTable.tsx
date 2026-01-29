import { getNoteColor } from "../music";
import type { KeyChords } from "../types";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

function RomanNumeral({ num }: { num: string }) {
  const className = num.includes("°")
    ? "text-dim"
    : num === num.toLowerCase()
      ? "text-minor"
      : "text-major";

  return <span className={className}>{num}</span>;
}

export function KeyChordsTable({
  title,
  numerals,
  rows,
}: {
  title: string;
  numerals: string[];
  rows: KeyChords[];
}) {
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="p-2 text-center text-[11px] font-semibold text-subtle">
              Key
            </th>
            {numerals.map((num, i) => (
              <th
                key={i}
                className="p-2 text-center text-[10px] font-semibold"
              >
                <RomanNumeral num={num} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="even:bg-white/[0.02]">
              <td
                className="p-1.5 text-center font-mono font-semibold"
                style={{ color: getNoteColor(row.key) }}
              >
                {row.key}
              </td>
              {row.chords.map((chord, j) => (
                <td
                  key={j}
                  className="p-1.5 text-center font-mono text-text-dim"
                >
                  {chord}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
