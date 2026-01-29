import { useCallback, useRef } from "react";
import { getNoteColor } from "../music";

interface NoteCircleProps {
  note: string;
  size?: number;
  dimmed?: boolean;
  isRoot?: boolean;
  label?: string;
  emphasis?: "third" | "fifth" | null;
  colorOverride?: string;
  onClick?: () => void;
}

export function NoteCircle({ note, size = 24, dimmed = false, isRoot = false, label, emphasis, colorOverride, onClick }: NoteCircleProps) {
  const bgColor = colorOverride ?? getNoteColor(note);
  const isAccidental = note.includes("♯") || note.includes("♭");
  const innerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (!onClick) return;
    onClick();
    const el = innerRef.current;
    if (el) {
      el.classList.add("note-ping");
      const onEnd = () => {
        el.classList.remove("note-ping");
        el.removeEventListener("animationend", onEnd);
      };
      el.addEventListener("animationend", onEnd);
    }
  }, [onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleClick();
      }
    },
    [onClick, handleClick],
  );

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        ref={innerRef}
        className={`flex items-center justify-center rounded-full font-mono font-semibold active:scale-110${onClick ? " hover:scale-110" : ""}`}
        title={label ? note : undefined}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? note : undefined}
        style={{
          width: size,
          height: size,
          backgroundColor: isAccidental ? "transparent" : bgColor,
          border: isAccidental
            ? `2px solid ${bgColor}`
            : isRoot
              ? "2px solid rgba(255,255,255,0.9)"
              : "none",
          color: isAccidental ? bgColor : "white",
          fontSize: size * 0.45,
          opacity: dimmed ? 0.15 : 1,
          transition: "opacity 0.15s, transform 0.1s",
          cursor: onClick ? "pointer" : undefined,
          userSelect: "none",
          boxShadow: [
            isRoot ? `0 0 8px ${bgColor}` : "",
            !dimmed && emphasis === "third" ? "inset 0 0 0 2px rgba(255,255,255,0.7)" : "",
            !dimmed && emphasis === "fifth" ? "inset 0 0 0 2px rgba(255,255,255,0.4)" : "",
          ].filter(Boolean).join(", ") || undefined,
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {label ?? note}
      </div>
    </div>
  );
}
