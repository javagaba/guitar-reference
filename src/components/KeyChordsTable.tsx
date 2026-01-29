import { useAppContext } from "../context/AppContext";
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
  isMinorTable = false,
}: {
  title: string;
  numerals: string[];
  rows: KeyChords[];
  isMinorTable?: boolean;
}) {
  const { selectedKey, isMinor, selectedChord, selectKey, selectChord } = useAppContext();

  function isSelectedRow(row: KeyChords): boolean {
    if (!selectedKey) return false;
    const displayKey = isMinor ? selectedKey + "m" : selectedKey;
    return row.key === displayKey && isMinor === isMinorTable;
  }

  function handleRowClick(row: KeyChords) {
    // Extract root from key label (strip trailing "m")
    const root = row.key.endsWith("m") ? row.key.slice(0, -1) : row.key;
    selectKey(root, isMinorTable);
  }

  function handleChordClick(chord: string, e: React.MouseEvent) {
    e.stopPropagation();
    selectChord(selectedChord === chord ? null : chord);
  }

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
          {rows.map((row, i) => {
            const rowSelected = isSelectedRow(row);
            return (
              <tr
                key={i}
                className="cursor-pointer transition-colors hover:bg-white/[0.04]"
                style={{
                  backgroundColor: rowSelected
                    ? "rgba(255,255,255,0.06)"
                    : i % 2 === 1
                      ? "rgba(255,255,255,0.02)"
                      : undefined,
                }}
                onClick={() => handleRowClick(row)}
              >
                <td
                  className="p-1.5 text-center font-mono font-semibold"
                  style={{ color: getNoteColor(row.key) }}
                >
                  {row.key}
                </td>
                {row.chords.map((chord, j) => {
                  const isChordSelected = selectedChord === chord;
                  return (
                    <td
                      key={j}
                      className="p-1.5 text-center font-mono text-text-dim"
                      style={{
                        cursor: "pointer",
                        outline: isChordSelected
                          ? `2px solid ${getNoteColor(chord)}`
                          : undefined,
                        outlineOffset: "-2px",
                        borderRadius: isChordSelected ? "4px" : undefined,
                        color: isChordSelected ? getNoteColor(chord) : undefined,
                      }}
                      onClick={(e) => handleChordClick(chord, e)}
                    >
                      {chord}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
