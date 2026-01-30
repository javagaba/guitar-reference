import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tuner } from "./Tuner";
import { Metronome } from "./Metronome";

export function ToolsTray() {
  const [tunerOpen, setTunerOpen] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const [bpmDisplay, setBpmDisplay] = useState(120);

  function openTuner(open: boolean) {
    setTunerOpen(open);
    if (open) setMetronomeOpen(false);
  }

  function openMetronome(open: boolean) {
    setMetronomeOpen(open);
    if (open) setTunerOpen(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Combined pill tray */}
      <div className="flex rounded-full bg-card border border-border shadow-lg overflow-hidden">
        <Popover open={tunerOpen} onOpenChange={openTuner}>
          <PopoverTrigger asChild>
            <button
              className={`flex h-10 w-10 items-center justify-center transition-colors ${
                tunerOpen
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
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={8}
            className="w-auto p-0 border-none bg-transparent shadow-none"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Tuner active={tunerOpen} onClose={() => setTunerOpen(false)} />
          </PopoverContent>
        </Popover>

        <div className="w-px bg-border" />

        <Popover open={metronomeOpen} onOpenChange={openMetronome}>
          <PopoverTrigger asChild>
            <button
              className={`flex h-10 min-w-[40px] items-center justify-center px-2 font-mono text-xs transition-colors ${
                metronomeOpen
                  ? "bg-white/10 text-text"
                  : "text-subtle hover:text-text hover:bg-white/5"
              }`}
              title="Metronome"
            >
              {bpmDisplay}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={8}
            className="w-auto p-0 border-none bg-transparent shadow-none"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Metronome
              active={metronomeOpen}
              onClose={() => setMetronomeOpen(false)}
              onBpmChange={setBpmDisplay}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
