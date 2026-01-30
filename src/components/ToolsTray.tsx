import { useState } from "react";
import { Tuner } from "./Tuner";
import { Metronome } from "./Metronome";

type Panel = "tuner" | "metronome" | null;

export function ToolsTray() {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [bpmDisplay, setBpmDisplay] = useState(120);

  function toggle(panel: Panel) {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Expanded panel */}
      {activePanel === "tuner" && <Tuner active onClose={() => setActivePanel(null)} />}
      {activePanel === "metronome" && (
        <Metronome
          active
          onClose={() => setActivePanel(null)}
          onBpmChange={setBpmDisplay}
        />
      )}

      {/* Button tray */}
      <div className="flex rounded-full bg-card border border-border shadow-lg overflow-hidden">
        <button
          onClick={() => toggle("tuner")}
          className={`flex h-10 w-10 items-center justify-center transition-colors ${
            activePanel === "tuner"
              ? "bg-white/10 text-text"
              : "text-subtle hover:text-text hover:bg-white/5"
          }`}
          title="Tuner"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 3v6a3 3 0 0 0 6 0V3" />
            <line x1="12" y1="9" x2="12" y2="21" />
            <circle cx="12" cy="21" r="1" fill="currentColor" />
          </svg>
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={() => toggle("metronome")}
          className={`flex h-10 min-w-[40px] items-center justify-center px-2 font-mono text-xs transition-colors ${
            activePanel === "metronome"
              ? "bg-white/10 text-text"
              : "text-subtle hover:text-text hover:bg-white/5"
          }`}
          title="Metronome"
        >
          {bpmDisplay}
        </button>
      </div>
    </div>
  );
}
