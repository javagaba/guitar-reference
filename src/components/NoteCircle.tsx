import { getNoteColor } from "../music";

export function NoteCircle({ note, size = 24 }: { note: string; size?: number }) {
  const bgColor = getNoteColor(note);
  const isAccidental = note.includes("♯") || note.includes("♭");

  return (
    <div
      className="flex items-center justify-center rounded-full font-mono font-semibold"
      style={{
        width: size,
        height: size,
        backgroundColor: isAccidental ? "transparent" : bgColor,
        border: isAccidental ? `2px solid ${bgColor}` : "none",
        color: isAccidental ? bgColor : "white",
        fontSize: size * 0.45,
      }}
    >
      {note}
    </div>
  );
}
