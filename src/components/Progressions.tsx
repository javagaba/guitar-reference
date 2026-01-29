import { PROGRESSIONS, resolveProgression, getNoteColor } from "../music";
import { useAppContext } from "../context/AppContext";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

export function Progressions() {
  const { selectedKey, selectChord } = useAppContext();

  return (
    <Card>
      <SectionTitle>Common Progressions</SectionTitle>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PROGRESSIONS.map((group) => (
          <div key={group.type}>
            <div className={`mb-2 text-[11px] font-semibold ${group.colorClass}`}>
              {group.type.toUpperCase()}
            </div>
            {group.progressions.map((prog, i) => {
              const resolved = selectedKey
                ? resolveProgression(prog.chords, selectedKey, group.isMinor)
                : null;
              return (
                <div key={i} className="py-1.5">
                  {prog.name && (
                    <div className="text-[10px] text-text-dimmest">
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
                            <button
                              type="button"
                              className="hover:brightness-125 cursor-pointer"
                              style={{ color: getNoteColor(resolved[j]) }}
                              onClick={() => selectChord(resolved[j])}
                            >
                              ({resolved[j]})
                            </button>
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
