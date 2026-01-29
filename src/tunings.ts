export interface GuitarTuning {
  name: string;
  category: "Standard" | "Drop" | "Open" | "Other";
  notes: string[];      // 6 strings, high-to-low (matching STANDARD_TUNING order)
  midiNotes: number[];  // MIDI values, high-to-low
}

// Standard: E4 B3 G3 D3 A2 E2
export const TUNINGS: GuitarTuning[] = [
  {
    name: "Standard",
    category: "Standard",
    notes: ["E", "B", "G", "D", "A", "E"],
    midiNotes: [64, 59, 55, 50, 45, 40],
  },
  {
    name: "Half-Step Down",
    category: "Standard",
    notes: ["D♯", "A♯", "F♯", "C♯", "G♯", "D♯"],
    midiNotes: [63, 58, 54, 49, 44, 39],
  },
  {
    name: "Full-Step Down",
    category: "Standard",
    notes: ["D", "A", "F", "C", "G", "D"],
    midiNotes: [62, 57, 53, 48, 43, 38],
  },
  {
    name: "Drop D",
    category: "Drop",
    notes: ["E", "B", "G", "D", "A", "D"],
    midiNotes: [64, 59, 55, 50, 45, 38],
  },
  {
    name: "Drop C",
    category: "Drop",
    notes: ["D", "A", "F", "C", "G", "C"],
    midiNotes: [62, 57, 53, 48, 43, 36],
  },
  {
    name: "Open G",
    category: "Open",
    notes: ["D", "B", "G", "D", "G", "D"],
    midiNotes: [62, 59, 55, 50, 43, 38],
  },
  {
    name: "Open D",
    category: "Open",
    notes: ["D", "A", "F♯", "D", "A", "D"],
    midiNotes: [62, 57, 54, 50, 45, 38],
  },
  {
    name: "Open E",
    category: "Open",
    notes: ["E", "B", "G♯", "E", "B", "E"],
    midiNotes: [64, 59, 56, 52, 47, 40],
  },
  {
    name: "DADGAD",
    category: "Other",
    notes: ["D", "A", "G", "D", "A", "D"],
    midiNotes: [62, 57, 55, 50, 45, 38],
  },
];

export const DEFAULT_TUNING = TUNINGS[0];

// Check if a tuning has standard interval spacing (5,5,5,4,5 semitones low-to-high)
// This determines if CAGED patterns and standard voicings apply
export function isStandardIntervalTuning(tuning: GuitarTuning): boolean {
  const m = tuning.midiNotes;
  // midiNotes is high-to-low, so reverse for low-to-high intervals
  const intervals = [
    m[4] - m[5], // low E to A
    m[3] - m[4], // A to D
    m[2] - m[3], // D to G
    m[1] - m[2], // G to B
    m[0] - m[1], // B to high E
  ];
  return (
    intervals[0] === 5 &&
    intervals[1] === 5 &&
    intervals[2] === 5 &&
    intervals[3] === 4 &&
    intervals[4] === 5
  );
}

export function buildCustomTuning(notes: string[], midiNotes: number[]): GuitarTuning {
  return {
    name: "Custom",
    category: "Other",
    notes,
    midiNotes,
  };
}
