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

interface TableSection {
  subtitle: string;
  numerals: string[];
  rows: KeyChords[];
  isMinorTable?: boolean;
}

function SectionTable({ section }: { section: TableSection }) {
  const { selectedKey, isMinor, selectedChord, selectKey, selectChord } =
    useAppContext();

  function isSelectedRow(row: KeyChords): boolean {
    if (!selectedKey) return false;
    const displayKey = isMinor ? selectedKey + "m" : selectedKey;
    return row.key === displayKey && isMinor === !!section.isMinorTable;
  }

  function handleRowClick(row: KeyChords) {
    const root = row.key.endsWith("m") ? row.key.slice(0, -1) : row.key;
    selectKey(root, !!section.isMinorTable);
  }

  function handleChordClick(chord: string, e: React.MouseEvent) {
    e.stopPropagation();
    selectChord(selectedChord === chord ? null : chord);
  }

  return (
    <div>
      <h3 className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wider text-subtle first:mt-0">
        {section.subtitle}
      </h3>
      <table className="w-full min-w-[480px] border-collapse text-xs sm:text-sm">
        <caption className="sr-only">{section.subtitle} chords</caption>
        <thead>
          <tr>
            <th scope="col" className="p-2 text-center text-[11px] font-semibold text-subtle">
              Key
            </th>
            {section.numerals.map((num, i) => (
              <th scope="col" key={i} className="p-2 text-center text-[10px] font-semibold">
                <RomanNumeral num={num} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row, i) => {
            const rowSelected = isSelectedRow(row);
            return (
              <tr
                key={i}
                className="cursor-pointer transition-colors hover:bg-white/4"
                style={{
                  backgroundColor: rowSelected
                    ? "rgba(255,255,255,0.06)"
                    : i % 2 === 1
                      ? "rgba(255,255,255,0.02)"
                      : undefined,
                }}
                onClick={() => handleRowClick(row)}
              >
                <th
                  scope="row"
                  className="p-2 text-center font-mono font-semibold"
                  style={{ color: getNoteColor(row.key) }}
                >
                  {row.key}
                </th>
                {row.chords.map((chord, j) => {
                  const isChordSelected = selectedChord === chord;
                  return (
                    <td
                      key={j}
                      className="p-2 text-center font-mono text-text-dim transition-colors hover:bg-white/5"
                      style={{
                        cursor: "pointer",
                        outline: isChordSelected
                          ? `2px solid ${getNoteColor(chord)}`
                          : undefined,
                        outlineOffset: "-2px",
                        borderRadius: isChordSelected ? "4px" : undefined,
                        color: isChordSelected
                          ? getNoteColor(chord)
                          : undefined,
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
    </div>
  );
}

export function KeyChordsTable({
  title,
  sections,
}: {
  title: string;
  sections: TableSection[];
}) {
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <div className="overflow-x-auto space-y-4">
        {sections.map((section, i) => (
          <SectionTable key={i} section={section} />
        ))}
      </div>
    </Card>
  );
}
