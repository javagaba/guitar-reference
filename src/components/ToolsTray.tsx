import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [metronomePlaying, setMetronomePlaying] = useState(false);
  const [bpmDisplay, setBpmDisplay] = useState(120);
  const [beatFlash, setBeatFlash] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function openTuner(open: boolean) {
    setTunerOpen(open);
    if (open) setMetronomeOpen(false);
  }

  function openMetronome(open: boolean) {
    setMetronomeOpen(open);
    if (open) setTunerOpen(false);
  }

  // Click-outside to close metronome panel
  useEffect(() => {
    if (!metronomeOpen) return;
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      )
        return;
      setMetronomeOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [metronomeOpen]);

  // Brief flash on each beat for the tray button
  const handleBeat = useCallback(() => {
    setBeatFlash(true);
    const id = setTimeout(() => setBeatFlash(false), 80);
    return () => clearTimeout(id);
  }, []);

  // Keep Metronome mounted while playing or open so the engine stays alive
  const metronomeMounted = metronomeOpen || metronomePlaying;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Metronome panel rendered outside Popover so it survives close */}
      {metronomeMounted && (
        <div
          ref={panelRef}
          className="absolute bottom-full right-0 mb-2"
          style={{ display: metronomeOpen ? undefined : "none" }}
        >
          <Metronome
            active={metronomeOpen}
            onClose={() => setMetronomeOpen(false)}
            onBpmChange={setBpmDisplay}
            onPlayingChange={setMetronomePlaying}
            onBeat={handleBeat}
          />
        </div>
      )}

      {/* Combined pill tray */}
      <div className="flex rounded-full bg-card border border-border shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden">
        <Popover open={tunerOpen} onOpenChange={openTuner}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className={`rounded-none ${
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
            </Button>
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

        <Button
          ref={buttonRef}
          variant="ghost"
          onClick={() => openMetronome(!metronomeOpen)}
          className={`relative h-10 min-w-[40px] rounded-none px-2 font-mono text-xs ${
            metronomeOpen
              ? "bg-white/10 text-text"
              : metronomePlaying
                ? "text-text"
                : "text-subtle hover:text-text hover:bg-white/5"
          }`}
          title="Metronome"
        >
          {metronomePlaying && beatFlash && (
            <span className="absolute inset-0 bg-white/10 pointer-events-none" />
          )}
          {bpmDisplay}
        </Button>
      </div>
    </div>
  );
}
