import type {
  ChordFormula,
  KeyChords,
  KeySignature,
  NoteName,
  ProgressionGroup,
  ScaleDefinition,
} from "./types";

// ── Foundational constants ──────────────────────────────────────────

const CHROMATIC_NOTES = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
];
const CHROMATIC_FLATS = [
  "C",
  "D♭",
  "D",
  "E♭",
  "E",
  "F",
  "G♭",
  "G",
  "A♭",
  "A",
  "B♭",
  "B",
];
const STANDARD_TUNING = ["E", "B", "G", "D", "A", "E"]; // high to low
const NATURAL_NOTES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const NUM_FRETS = 12;

const FLAT_KEYS = new Set([
  "F",
  "B♭",
  "E♭",
  "A♭",
  "D♭",
  "Fm",
  "Cm",
  "Gm",
  "Dm",
  "B♭m",
]);

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MAJOR_CHORD_QUALITIES = ["", "m", "m", "", "", "m", "°"];

const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
const MINOR_CHORD_QUALITIES = ["m", "°", "", "m", "m", "", ""];

// ── Helper functions ────────────────────────────────────────────────

export function noteIndex(note: string): number {
  const i = CHROMATIC_NOTES.indexOf(note);
  if (i >= 0) return i;
  return CHROMATIC_FLATS.indexOf(note);
}

export function isNoteInScale(note: string, scaleNotes: string[]): boolean {
  const idx = noteIndex(note);
  return scaleNotes.some((sn) => noteIndex(sn) === idx);
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
    return Array.from(
      { length: NUM_FRETS + 1 },
      (_, i) => CHROMATIC_NOTES[(start + i) % 12],
    );
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
    const minorIdx = (majorIdx - 3 + 12) % 12;
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
  ["C", "D", "E", "F", "G", "A", "B"],
  MINOR_SCALE_INTERVALS,
  MINOR_CHORD_QUALITIES,
  true,
);

export const FRETBOARD = buildFretboard();
export const STRING_LABELS = STANDARD_TUNING;
export const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

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
  const base = note
    .replace("♯", "")
    .replace("♭", "")
    .replace("m", "")
    .replace("°", "")
    .charAt(0) as NoteName;
  return NOTE_COLORS[base] ?? "#666";
}

// ── Key signatures ─────────────────────────────────────────────────

export const KEY_SIGNATURES: KeySignature[] = [
  { key: "C", relativeMinor: "Am", accidentals: [], type: "none" },
  { key: "G", relativeMinor: "Em", accidentals: ["F♯"], type: "sharp" },
  { key: "D", relativeMinor: "Bm", accidentals: ["F♯", "C♯"], type: "sharp" },
  {
    key: "A",
    relativeMinor: "F♯m",
    accidentals: ["F♯", "C♯", "G♯"],
    type: "sharp",
  },
  {
    key: "E",
    relativeMinor: "C♯m",
    accidentals: ["F♯", "C♯", "G♯", "D♯"],
    type: "sharp",
  },
  {
    key: "B",
    relativeMinor: "G♯m",
    accidentals: ["F♯", "C♯", "G♯", "D♯", "A♯"],
    type: "sharp",
  },
  {
    key: "F♯",
    relativeMinor: "D♯m",
    accidentals: ["F♯", "C♯", "G♯", "D♯", "A♯", "E♯"],
    type: "sharp",
  },
  {
    key: "D♭",
    relativeMinor: "B♭m",
    accidentals: ["B♭", "E♭", "A♭", "D♭", "G♭"],
    type: "flat",
  },
  {
    key: "A♭",
    relativeMinor: "Fm",
    accidentals: ["B♭", "E♭", "A♭", "D♭"],
    type: "flat",
  },
  {
    key: "E♭",
    relativeMinor: "Cm",
    accidentals: ["B♭", "E♭", "A♭"],
    type: "flat",
  },
  { key: "B♭", relativeMinor: "Gm", accidentals: ["B♭", "E♭"], type: "flat" },
  { key: "F", relativeMinor: "Dm", accidentals: ["B♭"], type: "flat" },
];

export function getKeySignature(key: string): KeySignature | undefined {
  return KEY_SIGNATURES.find((ks) => ks.key === key);
}

export function getScaleDegree(
  note: string,
  scaleNotes: string[],
): number | null {
  const idx = noteIndex(note);
  const pos = scaleNotes.findIndex((sn) => noteIndex(sn) === idx);
  return pos >= 0 ? pos + 1 : null;
}

export function getDegreeColor(degree: number): string {
  return `var(--color-degree-${Math.min(degree, 8)})`;
}

export function getScaleNotes(root: string, intervals: number[]): string[] {
  const rootIdx = noteIndex(root);
  const useFlats = FLAT_KEYS.has(root) || FLAT_KEYS.has(root + "m");
  return intervals.map((i) => noteName(rootIdx + i, useFlats));
}

export function getDiatonicChords(root: string, isMinor: boolean): string[] {
  const intervals = isMinor ? MINOR_SCALE_INTERVALS : MAJOR_SCALE_INTERVALS;
  const qualities = isMinor ? MINOR_CHORD_QUALITIES : MAJOR_CHORD_QUALITIES;
  const keyLabel = isMinor ? root + "m" : root;
  const useFlats = FLAT_KEYS.has(keyLabel);
  const rootIdx = noteIndex(root);
  return intervals.map(
    (interval, i) => noteName(rootIdx + interval, useFlats) + qualities[i],
  );
}

export const MAJOR_NUMERALS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
export const MINOR_NUMERALS = ["i", "ii°", "III", "iv", "v", "VI", "VII"];

export const SCALE_DEFINITIONS: ScaleDefinition[] = [
  // Diatonic
  { name: "Major", category: "Diatonic", intervals: [0, 2, 4, 5, 7, 9, 11] },
  {
    name: "Natural Minor",
    category: "Diatonic",
    intervals: [0, 2, 3, 5, 7, 8, 10],
  },
  // Pentatonic
  {
    name: "Pentatonic Major",
    category: "Pentatonic",
    intervals: [0, 2, 4, 7, 9],
  },
  {
    name: "Pentatonic Minor",
    category: "Pentatonic",
    intervals: [0, 3, 5, 7, 10],
  },
  // Blues
  { name: "Blues Major", category: "Blues", intervals: [0, 2, 3, 4, 7, 9] },
  { name: "Blues Minor", category: "Blues", intervals: [0, 3, 5, 6, 7, 10] },
  // Modes
  { name: "Ionian", category: "Mode", intervals: [0, 2, 4, 5, 7, 9, 11] },
  { name: "Dorian", category: "Mode", intervals: [0, 2, 3, 5, 7, 9, 10] },
  { name: "Phrygian", category: "Mode", intervals: [0, 1, 3, 5, 7, 8, 10] },
  { name: "Lydian", category: "Mode", intervals: [0, 2, 4, 6, 7, 9, 11] },
  { name: "Mixolydian", category: "Mode", intervals: [0, 2, 4, 5, 7, 9, 10] },
  { name: "Aeolian", category: "Mode", intervals: [0, 2, 3, 5, 7, 8, 10] },
  { name: "Locrian", category: "Mode", intervals: [0, 1, 3, 5, 6, 8, 10] },
  // Harmonic scales
  {
    name: "Harmonic Minor",
    category: "Harmonic",
    intervals: [0, 2, 3, 5, 7, 8, 11],
  },
  {
    name: "Harmonic Major",
    category: "Harmonic",
    intervals: [0, 2, 4, 5, 7, 8, 11],
  },
  {
    name: "Double Harmonic",
    category: "Harmonic",
    intervals: [0, 1, 4, 5, 7, 8, 11],
  },
  {
    name: "Phrygian Dominant",
    category: "Harmonic",
    intervals: [0, 1, 4, 5, 7, 8, 10],
  },
  // Melodic scales
  {
    name: "Melodic Minor",
    category: "Melodic",
    intervals: [0, 2, 3, 5, 7, 9, 11],
  },
  {
    name: "Lydian Dominant",
    category: "Melodic",
    intervals: [0, 2, 4, 6, 7, 9, 10],
  },
  {
    name: "Super Locrian",
    category: "Melodic",
    intervals: [0, 1, 3, 4, 6, 8, 10],
  },
  {
    name: "Lydian Augmented",
    category: "Melodic",
    intervals: [0, 2, 4, 6, 8, 9, 11],
  },
  // Exotic scales
  {
    name: "Hungarian Minor",
    category: "Exotic",
    intervals: [0, 2, 3, 6, 7, 8, 11],
  },
  {
    name: "Neapolitan Minor",
    category: "Exotic",
    intervals: [0, 1, 3, 5, 7, 8, 11],
  },
  {
    name: "Neapolitan Major",
    category: "Exotic",
    intervals: [0, 1, 3, 5, 7, 9, 11],
  },
  { name: "Enigmatic", category: "Exotic", intervals: [0, 1, 4, 6, 8, 10, 11] },
  { name: "Whole Tone", category: "Exotic", intervals: [0, 2, 4, 6, 8, 10] },
  {
    name: "Diminished HW",
    category: "Exotic",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
  },
  {
    name: "Diminished WH",
    category: "Exotic",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
  },
];
