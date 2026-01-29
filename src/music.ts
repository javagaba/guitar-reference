import type {
  BorrowedChord,
  ChordFormula,
  ChordQuality,
  KeyChords,
  KeySignature,
  NoteName,
  ProgressionGroup,
  ScaleDefinition,
  ScaleTriad,
  SecondaryDominant,
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
const NUM_FRETS = 21;

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

export function buildFretboardForTuning(tuningNotes: string[]): string[][] {
  return tuningNotes.map((open) => {
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
  { name: "Power (5)", formula: "1, 5" },
  { name: "Sus2", formula: "1, 2, 5" },
  { name: "Sus4", formula: "1, 4, 5" },
  { name: "Dominant 7", formula: "1, 3, 5, ♭7" },
  { name: "Major 7", formula: "1, 3, 5, 7" },
  { name: "Minor 7", formula: "1, ♭3, 5, ♭7" },
  { name: "Minor/Major 7", formula: "1, ♭3, 5, 7" },
  { name: "7sus4", formula: "1, 4, 5, ♭7" },
  { name: "6", formula: "1, 3, 5, 6" },
  { name: "Minor 6", formula: "1, ♭3, 5, 6" },
  { name: "9", formula: "1, 3, 5, ♭7, 9" },
  { name: "Major 9", formula: "1, 3, 5, 7, 9" },
  { name: "Minor 9", formula: "1, ♭3, 5, ♭7, 9" },
  { name: "Add9", formula: "1, 3, 5, 9" },
  { name: "Diminished", formula: "1, ♭3, ♭5" },
  { name: "Diminished 7", formula: "1, ♭3, ♭5, 6" },
  { name: "Half-Dim (m7♭5)", formula: "1, ♭3, ♭5, ♭7" },
  { name: "Augmented", formula: "1, 3, ♯5" },
  { name: "Aug 7", formula: "1, 3, ♯5, ♭7" },
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
    type: "Pop / Rock",
    colorClass: "text-major",
    isMinor: false,
    progressions: [
      { chords: ["I", "IV", "V"] },
      { name: "Pop Anthem", chords: ["I", "V", "vi", "IV"] },
      { name: "'50s", chords: ["I", "vi", "IV", "V"] },
      { name: "Axis", chords: ["vi", "IV", "I", "V"] },
      { chords: ["I", "IV", "vi", "V"] },
      { name: "Mixolydian Vamp", chords: ["I", "♭VII", "IV", "I"] },
    ],
  },
  {
    type: "Jazz",
    colorClass: "text-major",
    isMinor: false,
    progressions: [
      { name: "ii-V-I", chords: ["iim7", "V7", "Imaj7"] },
      { name: "Turnaround", chords: ["Imaj7", "vim7", "iim7", "V7"] },
      { name: "iii-vi-ii-V", chords: ["iiim7", "vim7", "iim7", "V7"] },
      {
        name: "Rhythm Changes A",
        chords: ["Imaj7", "vim7", "iim7", "V7", "iiim7", "vim7", "iim7", "V7"],
      },
      { name: "ii-V to IV", chords: ["iim7", "V7", "Imaj7", "IVmaj7"] },
    ],
  },
  {
    type: "Minor",
    colorClass: "text-minor",
    isMinor: true,
    progressions: [
      { chords: ["i", "iv", "VII"] },
      { name: "Andalusian", chords: ["i", "VI", "III", "VII"] },
      { chords: ["i", "iv", "v"] },
      { chords: ["i", "VII", "VI", "VII"] },
      { chords: ["i", "ii°", "V", "i"] },
    ],
  },
  {
    type: "Minor Jazz",
    colorClass: "text-minor",
    isMinor: true,
    progressions: [
      { name: "Minor ii-V-i", chords: ["iim7♭5", "V7", "im7"] },
      { chords: ["im7", "ivm7", "V7", "im7"] },
      { chords: ["im7", "♭VImaj7", "iim7♭5", "V7"] },
      { chords: ["im7", "ivm7", "♭VImaj7", "V7"] },
    ],
  },
];

// ── Roman numeral resolver ─────────────────────────────────────────

const ROMAN_MAP: Record<string, number> = {
  I: 0,
  II: 1,
  III: 2,
  IV: 3,
  V: 4,
  VI: 5,
  VII: 6,
};

export function resolveProgression(
  chords: string[],
  root: string,
  isMinor: boolean,
): string[] {
  const intervals = isMinor ? MINOR_SCALE_INTERVALS : MAJOR_SCALE_INTERVALS;
  const keyLabel = isMinor ? root + "m" : root;
  const useFlats = FLAT_KEYS.has(keyLabel);
  const rootIdx = noteIndex(root);

  return chords.map((token) => {
    // Parse: optional accidental + roman numeral + suffix
    const match = token.match(
      /^([♭♯]?)(III|II|IV|I|VII|VI|V|iii|ii|iv|i|vii|vi|v)(.*)$/,
    );
    if (!match) return token;

    const [, accidental, roman, suffix] = match;
    const upperRoman = roman.toUpperCase();
    const degree = ROMAN_MAP[upperRoman];
    if (degree === undefined) return token;

    const isLowerCase = roman === roman.toLowerCase();
    const accidentalOffset =
      accidental === "♭" ? -1 : accidental === "♯" ? 1 : 0;
    const semitone = rootIdx + intervals[degree] + accidentalOffset;
    const chordRoot = noteName(semitone, useFlats);

    // If suffix is explicit (e.g. "m7", "maj7", "7", "m7♭5", "°"), use it directly
    if (suffix) return chordRoot + suffix;

    // No suffix: infer triad quality from case
    if (isLowerCase) {
      // Check for diminished (°) in original token already handled by suffix
      return chordRoot + "m";
    }
    return chordRoot;
  });
}

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

// ── Scale triads ────────────────────────────────────────────────────

const MAJOR_ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
const MINOR_ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

function getTriadQuality(
  root: number,
  third: number,
  fifth: number,
): ChordQuality {
  const thirdInterval = (((third - root) % 12) + 12) % 12;
  const fifthInterval = (((fifth - root) % 12) + 12) % 12;
  if (thirdInterval === 4 && fifthInterval === 8) return "augmented";
  if (thirdInterval === 3 && fifthInterval === 6) return "diminished";
  if (thirdInterval === 3 && fifthInterval === 7) return "minor";
  return "major"; // 4+7
}

export function getScaleTriads(
  root: string,
  intervals: number[],
): ScaleTriad[] | null {
  if (intervals.length !== 7) return null;
  const rootIdx = noteIndex(root);
  const useFlats = FLAT_KEYS.has(root) || FLAT_KEYS.has(root + "m");

  return intervals.map((_, i) => {
    const rootSemitone = rootIdx + intervals[i];
    const thirdSemitone =
      rootIdx + intervals[(i + 2) % 7] + (i + 2 >= 7 ? 12 : 0);
    const fifthSemitone =
      rootIdx + intervals[(i + 4) % 7] + (i + 4 >= 7 ? 12 : 0);

    const quality = getTriadQuality(rootSemitone, thirdSemitone, fifthSemitone);
    const chordRoot = noteName(rootSemitone, useFlats);
    const suffix =
      quality === "minor"
        ? "m"
        : quality === "diminished"
          ? "°"
          : quality === "augmented"
            ? "+"
            : "";
    const chordName = chordRoot + suffix;

    const roman =
      quality === "minor" || quality === "diminished"
        ? MINOR_ROMAN[i]
        : MAJOR_ROMAN[i];
    const numeral =
      roman +
      (quality === "diminished" ? "°" : quality === "augmented" ? "+" : "");

    return { degree: i + 1, root: chordRoot, quality, chordName, numeral };
  });
}

// ── Chord formula resolver ──────────────────────────────────────────

const INTERVAL_SEMITONES: Record<string, number> = {
  "1": 0,
  "♭2": 1,
  "2": 2,
  "♭3": 3,
  "3": 4,
  "4": 5,
  "♭5": 6,
  "5": 7,
  "♯5": 8,
  "6": 9,
  "♭7": 10,
  "7": 11,
  "♭9": 13,
  "9": 14,
  "♯9": 15,
  "11": 17,
  "♯11": 18,
  "♭13": 20,
  "13": 21,
};

export function resolveChordFormula(root: string, formula: string): string[] {
  const useFlats = FLAT_KEYS.has(root) || FLAT_KEYS.has(root + "m");
  const rootIdx = noteIndex(root);
  return formula.split(",").map((token) => {
    const t = token.trim();
    const semitones = INTERVAL_SEMITONES[t];
    if (semitones === undefined) return t;
    return noteName(rootIdx + semitones, useFlats);
  });
}

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

// ── Secondary Dominants ─────────────────────────────────────────────

const MAJOR_SCALE_ROMAN_LABELS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const MINOR_SCALE_ROMAN_LABELS = ["i", "ii°", "III", "iv", "v", "VI", "VII"];

export function getSecondaryDominants(
  root: string,
  isMinor: boolean,
): SecondaryDominant[] {
  const intervals = isMinor ? MINOR_SCALE_INTERVALS : MAJOR_SCALE_INTERVALS;
  const qualities = isMinor ? MINOR_CHORD_QUALITIES : MAJOR_CHORD_QUALITIES;
  const romanLabels = isMinor
    ? MINOR_SCALE_ROMAN_LABELS
    : MAJOR_SCALE_ROMAN_LABELS;
  const keyLabel = isMinor ? root + "m" : root;
  const useFlats = FLAT_KEYS.has(keyLabel);
  const rootIdx = noteIndex(root);

  const results: SecondaryDominant[] = [];

  for (let i = 0; i < 7; i++) {
    // Skip diminished chords (can't be targets of secondary dominants)
    if (qualities[i] === "°") continue;
    // Skip degree I (V/I = V, which is just the regular dominant)
    if (i === 0) continue;

    const targetSemitone = rootIdx + intervals[i];
    const targetRoot = noteName(targetSemitone, useFlats);
    const targetChord = targetRoot + qualities[i];

    // V7 of the target = a dom7 chord whose root is a perfect fifth above the target
    const domSemitone = targetSemitone + 7;
    const domRoot = noteName(domSemitone, useFlats);
    const domChord = domRoot + "7";

    results.push({
      symbol: `V/${romanLabels[i]}`,
      chord: domChord,
      resolvesTo: targetChord,
    });
  }

  return results;
}

// ── Borrowed Chords (Modal Interchange) ─────────────────────────────

export function getBorrowedChords(
  root: string,
  isMinor: boolean,
): BorrowedChord[] {
  const keyLabel = isMinor ? root + "m" : root;
  const useFlats = FLAT_KEYS.has(keyLabel);
  const rootIdx = noteIndex(root);

  if (!isMinor) {
    // Borrow from parallel minor
    return [
      {
        chord: noteName(rootIdx + 3, useFlats),
        source: "Parallel Minor",
        numeral: "♭III",
      },
      {
        chord: noteName(rootIdx + 5, useFlats) + "m",
        source: "Parallel Minor",
        numeral: "iv",
      },
      {
        chord: noteName(rootIdx + 8, useFlats),
        source: "Parallel Minor",
        numeral: "♭VI",
      },
      {
        chord: noteName(rootIdx + 10, useFlats),
        source: "Parallel Minor",
        numeral: "♭VII",
      },
    ];
  } else {
    // Borrow from parallel major
    return [
      {
        chord: noteName(rootIdx + 5, useFlats),
        source: "Parallel Major",
        numeral: "IV",
      },
      {
        chord: noteName(rootIdx + 7, useFlats),
        source: "Parallel Major",
        numeral: "V",
      },
    ];
  }
}

// ── Chord Inversions ─────────────────────────────────────────────────

export interface ChordInversion {
  inversionNumber: number;
  label: string; // "Root Position", "1st Inversion", etc.
  slashNotation: string; // "C/E"
  bassNote: string;
  notes: string[]; // reordered from bass
}

export function getChordInversions(
  chordName: string,
  root: string,
  formulaNotes: string[],
): ChordInversion[] {
  if (formulaNotes.length < 2) return [];

  return formulaNotes.map((bassNote, i) => {
    const reordered = [...formulaNotes.slice(i), ...formulaNotes.slice(0, i)];
    const labels = [
      "Root Position",
      "1st Inversion",
      "2nd Inversion",
      "3rd Inversion",
      "4th Inversion",
    ];
    return {
      inversionNumber: i,
      label: labels[i] || `${i}th Inversion`,
      slashNotation: i === 0 ? chordName : `${chordName}/${bassNote}`,
      bassNote,
      notes: reordered,
    };
  });
}

export function parseSlashChord(
  name: string,
): { chord: string; bass: string } | null {
  const idx = name.indexOf("/");
  if (idx < 0) return null;
  const chord = name.slice(0, idx);
  const bass = name.slice(idx + 1);
  if (!chord || !bass) return null;
  return { chord, bass };
}
