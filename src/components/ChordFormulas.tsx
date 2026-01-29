import { CHORD_FORMULAS } from "../music";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

export function ChordFormulas() {
  return (
    <Card>
      <SectionTitle>Chord Formulas</SectionTitle>
      {CHORD_FORMULAS.map((chord, i) => (
        <div
          key={i}
          className="flex justify-between border-b border-[#2a2a2a] py-2 text-[13px] last:border-b-0"
        >
          <span className="text-text-dim">{chord.name}</span>
          <span className="font-mono text-xs text-note-d">
            {chord.formula}
          </span>
        </div>
      ))}
    </Card>
  );
}
