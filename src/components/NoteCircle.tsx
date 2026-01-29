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

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="flex items-center justify-center rounded-full font-mono font-semibold"
        title={label ? note : undefined}
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
          transition: "opacity 0.15s",
          cursor: onClick ? "pointer" : undefined,
          boxShadow: [
            isRoot ? `0 0 8px ${bgColor}` : "",
            !dimmed && emphasis === "third" ? "inset 0 0 0 2px rgba(255,255,255,0.7)" : "",
            !dimmed && emphasis === "fifth" ? "inset 0 0 0 2px rgba(255,255,255,0.4)" : "",
          ].filter(Boolean).join(", ") || undefined,
        }}
        onClick={onClick}
      >
        {label ?? note}
      </div>
    </div>
  );
}
