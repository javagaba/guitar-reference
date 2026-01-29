import type { ChordFormula, KeyChords, NoteName, ProgressionGroup } from "./types";

// ── Foundational constants ──────────────────────────────────────────

const CHROMATIC_NOTES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const CHROMATIC_FLATS = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const STANDARD_TUNING = ["E", "B", "G", "D", "A", "E"]; // high to low
const NATURAL_NOTES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const NUM_FRETS = 12;

const FLAT_KEYS = new Set(["F", "B♭", "E♭", "A♭", "D♭", "Fm", "Cm", "Gm", "Dm", "B♭m"]);

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MAJOR_CHORD_QUALITIES = ["", "m", "m", "", "", "m", "°"];

const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
const MINOR_CHORD_QUALITIES = ["m", "°", "", "m", "m", "", ""];

// ── Helper functions ────────────────────────────────────────────────

function noteIndex(note: string): number {
  const i = CHROMATIC_NOTES.indexOf(note);
  if (i >= 0) return i;
  return CHROMATIC_FLATS.indexOf(note);
}

function noteName(semitone: number, useFlats: boolean): string {
  const idx = ((semitone % 12) + 12) % 12;
  return useFlats ? CHROMATIC_FLATS[idx] : CHROMATIC_NOTES[idx];
}

// ── Derived values ──────────────────────────────────────────────────

function buildNoteColors(): Record<NoteName, string> {
  const colors = {} as Record<NoteName, string>;
  for (const n of NATURAL_NOTES) {
    colors[n] = `var(--color-note-${n.toLowerCase()})`;
  }
  return colors;
}

function buildFretboard(): string[][] {
  return STANDARD_TUNING.map((open) => {
    const start = noteIndex(open);
    return Array.from({ length: NUM_FRETS + 1 }, (_, i) => CHROMATIC_NOTES[(start + i) % 12]);
  });
}

function buildCircleMajor(): string[] {
  const circle: string[] = [];
  let idx = 0; // start at C
  for (let i = 0; i < 12; i++) {
    // Keys past F♯ (positions 7–11) use flat names
    circle.push(i >= 7 ? CHROMATIC_FLATS[idx] : CHROMATIC_NOTES[idx]);
    idx = (idx + 7) % 12;
  }
  return circle;
}

function buildCircleMinor(majors: string[]): string[] {
  return majors.map((major, i) => {
    const majorIdx = noteIndex(major);
    const minorIdx = ((majorIdx - 3) + 12) % 12;
    // Positions 6+ on the circle use flat spellings (F♯/G♭ boundary and beyond)
    const useFlats = i >= 6;
    return noteName(minorIdx, useFlats) + "m";
  });
}

function buildKeyChords(
  keys: string[],
  intervals: number[],
  qualities: string[],
  isMinor: boolean,
): KeyChords[] {
  return keys.map((key) => {
    const keyLabel = isMinor ? key + "m" : key;
    const useFlats = FLAT_KEYS.has(keyLabel);
    const root = noteIndex(key);
    const chords = intervals.map((interval, i) => {
      const note = noteName(root + interval, useFlats);
      return note + qualities[i];
    });
    return { key: keyLabel, chords };
  });
}

// ── Exports (same names as before) ──────────────────────────────────

export const NOTE_COLORS = buildNoteColors();

export const CHORD_FORMULAS: ChordFormula[] = [
  { name: "Major", formula: "1, 3, 5" },
  { name: "Minor", formula: "1, ♭3, 5" },
  { name: "Major 7", formula: "1, 3, 5, 7" },
  { name: "Minor 7", formula: "1, ♭3, 5, ♭7" },
  { name: "Dominant 7", formula: "1, 3, 5, ♭7" },
  { name: "Sus2", formula: "1, 2, 5" },
  { name: "Sus4", formula: "1, 4, 5" },
  { name: "Diminished", formula: "1, ♭3, ♭5" },
  { name: "Augmented", formula: "1, 3, ♯5" },
  { name: "Add9", formula: "1, 3, 5, 9" },
];

export const MAJOR_KEY_CHORDS = buildKeyChords(
  ["C", "D", "E", "F", "G", "A", "B"],
  MAJOR_SCALE_INTERVALS,
  MAJOR_CHORD_QUALITIES,
  false,
);

export const MINOR_KEY_CHORDS = buildKeyChords(
  ["A", "B", "C", "D", "E", "F", "G"],
  MINOR_SCALE_INTERVALS,
  MINOR_CHORD_QUALITIES,
  true,
);

export const FRETBOARD = buildFretboard();
export const STRING_LABELS = STANDARD_TUNING;
export const FRET_MARKERS = [3, 5, 7, 9, 12];

export const PROGRESSIONS: ProgressionGroup[] = [
  {
    type: "Major",
    colorClass: "text-major",
    progressions: [
      ["I", "IV", "V"],
      ["I", "V", "vi", "IV"],
      ["I", "vi", "IV", "V"],
      ["ii", "V", "I"],
      ["I", "IV", "I", "V"],
    ],
  },
  {
    type: "Minor",
    colorClass: "text-minor",
    progressions: [
      ["i", "iv", "VII"],
      ["i", "VI", "III", "VII"],
      ["i", "iv", "v"],
      ["i", "VII", "VI", "VII"],
      ["i", "ii°", "V", "i"],
    ],
  },
];

export const CIRCLE_MAJOR = buildCircleMajor();
export const CIRCLE_MINOR = buildCircleMinor(CIRCLE_MAJOR);

export function getNoteColor(note: string): string {
  const base = note.replace("♯", "").replace("♭", "").charAt(0) as NoteName;
  return NOTE_COLORS[base] ?? "#666";
}
