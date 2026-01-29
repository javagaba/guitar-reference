import { PROGRESSIONS } from "../music";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

export function Progressions() {
  return (
    <Card>
      <SectionTitle>Common Progressions</SectionTitle>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PROGRESSIONS.map((group) => (
          <div key={group.type}>
            <div className={`mb-2 text-[11px] font-semibold ${group.colorClass}`}>
              {group.type.toUpperCase()}
            </div>
            {group.progressions.map((prog, i) => (
              <div
                key={i}
                className="py-1.5 font-mono text-[13px] text-text-dimmer"
              >
                {prog.join(" – ")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
