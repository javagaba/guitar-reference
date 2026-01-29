import { CHORD_FORMULAS, getNoteColor, resolveChordFormula } from "../music";
import { playChord } from "../audio";
import { useAppContext } from "../context/AppContext";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

export function ChordFormulas() {
  const { selectedKey } = useAppContext();

  return (
    <Card>
      <SectionTitle>Chords</SectionTitle>
      {CHORD_FORMULAS.map((chord, i) => {
        const resolved = selectedKey
          ? resolveChordFormula(selectedKey, chord.formula)
          : null;

        return (
          <div
            key={i}
            className="flex items-center justify-between border-b border-[#2a2a2a] py-2 text-[13px] last:border-b-0"
          >
            <span className="text-text-dim">{chord.name}</span>
            <div className="flex items-center gap-3">
              {resolved && (
                <span className="font-mono text-xs flex gap-1">
                  {resolved.map((note, j) => (
                    <span key={j} style={{ color: getNoteColor(note) }}>
                      {note}
                    </span>
                  ))}
                </span>
              )}
              <span className="font-mono text-xs text-note-d">
                {chord.formula}
              </span>
              {resolved && (
                <button
                  onClick={() => playChord(resolved)}
                  className="text-text-dim hover:text-white transition-colors cursor-pointer"
                  title="Play chord"
                >
                  ▶
                </button>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}
