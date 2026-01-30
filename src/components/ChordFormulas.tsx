import { playChord } from "../audio";
import { useAppStore } from "../stores/appStore";
import { CHORD_FORMULAS, getNoteColor, resolveChordFormula } from "../music";
import { Button } from "@/components/ui/button";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

export function ChordFormulas() {
  const selectedKey = useAppStore((s) => s.selectedKey);

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
                <Button
                  onClick={() => playChord(resolved)}
                  variant="ghost"
                  size="icon-xs"
                  className="text-text-dim hover:text-white"
                  title="Play chord"
                >
                  ▶
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}
