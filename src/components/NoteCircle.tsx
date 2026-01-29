import { getNoteColor } from "../music";

interface NoteCircleProps {
  note: string;
  size?: number;
  dimmed?: boolean;
  isRoot?: boolean;
  onClick?: () => void;
}

export function NoteCircle({ note, size = 24, dimmed = false, isRoot = false, onClick }: NoteCircleProps) {
  const bgColor = getNoteColor(note);
  const isAccidental = note.includes("♯") || note.includes("♭");

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="flex items-center justify-center rounded-full font-mono font-semibold"
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
          boxShadow: isRoot ? `0 0 8px ${bgColor}` : undefined,
        }}
        onClick={onClick}
      >
        {note}
      </div>
    </div>
  );
}
