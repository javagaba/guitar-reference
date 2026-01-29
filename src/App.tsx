import {
  CHORD_FORMULAS,
  MAJOR_KEY_CHORDS,
  MINOR_KEY_CHORDS,
  FRETBOARD,
  STRING_LABELS,
  FRET_MARKERS,
  PROGRESSIONS,
  CIRCLE_MAJOR,
  CIRCLE_MINOR,
  getNoteColor,
} from "./music";

function NoteCircle({ note, size = 24 }: { note: string; size?: number }) {
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 border-b border-border pb-2 text-[11px] font-semibold uppercase tracking-widest text-subtle">
      {children}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-bg p-8 font-sans text-text">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-[28px] font-bold tracking-tight text-white">
          Guitar Reference
        </h1>
        <p className="mt-2 text-[13px] text-muted">
          Chords &bull; Keys &bull; Fretboard
        </p>
      </div>

      {/* Main Grid */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {/* Chord Formulas */}
        <Card>
          <SectionTitle>Chord Formulas</SectionTitle>
          {CHORD_FORMULAS.map((chord, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-[#2a2a2a] py-2 text-[13px] last:border-b-0"
            >
              <span className="text-text-dim">{chord.name}</span>
              <span className="font-mono text-xs text-note-d">
                {chord.formula}
              </span>
            </div>
          ))}
        </Card>

        {/* Major Keys */}
        <Card>
          <SectionTitle>Major Key Chords</SectionTitle>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-center text-[11px] font-semibold text-subtle">
                  Key
                </th>
                {["I", "ii", "iii", "IV", "V", "vi", "vii°"].map(
                  (num, i) => (
                    <th
                      key={i}
                      className="p-2 text-center text-[10px] font-semibold"
                    >
                      <span
                        className={
                          num.includes("°")
                            ? "text-dim"
                            : num === num.toLowerCase()
                              ? "text-minor"
                              : "text-major"
                        }
                      >
                        {num}
                      </span>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {MAJOR_KEY_CHORDS.map((row, i) => (
                <tr key={i} className="even:bg-white/[0.02]">
                  <td
                    className="p-1.5 text-center font-mono font-semibold"
                    style={{ color: getNoteColor(row.key) }}
                  >
                    {row.key}
                  </td>
                  {row.chords.map((chord, j) => (
                    <td
                      key={j}
                      className="p-1.5 text-center font-mono text-text-dim"
                    >
                      {chord}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Minor Keys */}
        <Card>
          <SectionTitle>Minor Key Chords</SectionTitle>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-center text-[11px] font-semibold text-subtle">
                  Key
                </th>
                {["i", "ii°", "III", "iv", "v", "VI", "VII"].map(
                  (num, i) => (
                    <th
                      key={i}
                      className="p-2 text-center text-[10px] font-semibold"
                    >
                      <span
                        className={
                          num.includes("°")
                            ? "text-dim"
                            : num === num.toLowerCase()
                              ? "text-minor"
                              : "text-major"
                        }
                      >
                        {num}
                      </span>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {MINOR_KEY_CHORDS.map((row, i) => (
                <tr key={i} className="even:bg-white/[0.02]">
                  <td className="p-1.5 text-center font-mono font-semibold text-minor">
                    {row.key}
                  </td>
                  {row.chords.map((chord, j) => (
                    <td
                      key={j}
                      className="p-1.5 text-center font-mono text-text-dim"
                    >
                      {chord}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Progressions */}
        <Card>
          <SectionTitle>Common Progressions</SectionTitle>
          <div className="grid grid-cols-2 gap-6">
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
      </div>

      {/* Fretboard */}
      <Card className="mx-auto mt-6 max-w-[1200px]">
        <SectionTitle>Fretboard Notes</SectionTitle>
        <div className="overflow-x-auto py-4">
          <div className="min-w-[800px]">
            {/* Fret numbers */}
            <div className="mb-2 flex pl-8">
              {Array.from({ length: 13 }, (_, fret) => (
                <div
                  key={fret}
                  className={`w-14 text-center font-mono text-[10px] ${
                    FRET_MARKERS.includes(fret)
                      ? "text-subtle"
                      : "text-[#555]"
                  }`}
                >
                  {fret === 0 ? "Open" : fret}
                </div>
              ))}
            </div>

            {/* Strings */}
            {FRETBOARD.map((string, stringIndex) => (
              <div key={stringIndex} className="mb-1 flex items-center">
                <div className="w-7 font-mono text-[11px] font-semibold text-muted">
                  {STRING_LABELS[stringIndex]}
                </div>
                {string.map((note, fret) => (
                  <div
                    key={fret}
                    className="flex w-14 justify-center py-1"
                    style={{
                      borderLeft:
                        fret === 0
                          ? "3px solid #555"
                          : "1px solid #333",
                      backgroundColor: FRET_MARKERS.includes(fret)
                        ? "rgba(255,255,255,0.02)"
                        : "transparent",
                    }}
                  >
                    <NoteCircle note={note} size={28} />
                  </div>
                ))}
              </div>
            ))}

            {/* Fret dot markers */}
            <div className="mt-2 flex pl-8">
              {Array.from({ length: 13 }, (_, fret) => (
                <div key={fret} className="w-14 text-center text-subtle">
                  {fret === 12 ? "••" : FRET_MARKERS.includes(fret) ? "•" : ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Circle of Fifths */}
      <Card className="mx-auto mt-6 max-w-[400px]">
        <SectionTitle>Circle of Fifths</SectionTitle>
        <div className="flex justify-center py-5">
          <svg viewBox="0 0 300 300" width="260" height="260">
            {CIRCLE_MAJOR.map((note, i) => {
              const angle = ((i * 30 - 90) * Math.PI) / 180;
              const x = 150 + 115 * Math.cos(angle);
              const y = 150 + 115 * Math.sin(angle);
              return (
                <g key={note}>
                  <circle cx={x} cy={y} r="18" fill={getNoteColor(note)} />
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {note}
                  </text>
                </g>
              );
            })}

            {CIRCLE_MINOR.map((note, i) => {
              const angle = ((i * 30 - 90) * Math.PI) / 180;
              const x = 150 + 70 * Math.cos(angle);
              const y = 150 + 70 * Math.sin(angle);
              return (
                <g key={note}>
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="#333"
                    stroke="#555"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#aaa"
                    fontSize="8"
                    fontWeight="500"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {note}
                  </text>
                </g>
              );
            })}

            <text
              x="150"
              y="150"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#555"
              fontSize="8"
              fontWeight="600"
            >
              5ths →
            </text>
          </svg>
        </div>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-[11px] text-[#444]">
        Standard Tuning (EADGBE)
      </div>
    </div>
  );
}
