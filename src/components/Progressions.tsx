import { useCallback } from "react";
import { playChord } from "../audio";
import { useAppStore } from "../stores/appStore";
import { useLongPress } from "../hooks/useLongPress";
import { getChordTones, getNoteColor, PROGRESSIONS, resolveProgression } from "../music";
import { Button } from "@/components/ui/button";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

function ChordButton({ chord, onSelect }: { chord: string; onSelect: (c: string) => void }) {
  const handleShortPress = useCallback(() => {
    const tones = getChordTones(chord);
    if (tones) playChord(tones.notes);
  }, [chord]);

  const handleLongPress = useCallback(() => {
    onSelect(chord);
  }, [chord, onSelect]);

  const longPressHandlers = useLongPress({
    onShortPress: handleShortPress,
    onLongPress: handleLongPress,
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      className="select-none touch-manipulation px-1.5 py-1 hover:bg-white/5 hover:brightness-125"
      style={{ color: getNoteColor(chord) }}
      title="Tap to play · hold to select"
      {...longPressHandlers}
    >
      ({chord})
    </Button>
  );
}

export function Progressions() {
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectChord = useAppStore((s) => s.selectChord);

  return (
    <Card>
      <SectionTitle>Progressions</SectionTitle>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PROGRESSIONS.map((group) => (
          <div key={group.type}>
            <div
              className={`mb-2 text-[11px] font-semibold ${group.colorClass}`}
            >
              {group.type.toUpperCase()}
            </div>
            {group.progressions.map((prog, i) => {
              const resolved = selectedKey
                ? resolveProgression(prog.chords, selectedKey, group.isMinor)
                : null;
              return (
                <div key={i} className="py-1.5">
                  {prog.name && (
                    <div className="text-[11px] text-text-dimmest">
                      {prog.name}
                    </div>
                  )}
                  <div className="font-mono text-[13px] text-text-dimmer">
                    {prog.chords.map((chord, j) => (
                      <span key={j}>
                        {chord}
                        {resolved && (
                          <>
                            {" "}
                            <ChordButton chord={resolved[j]} onSelect={selectChord} />
                          </>
                        )}
                        {j < prog.chords.length - 1 && " – "}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}
