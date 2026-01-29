export type NoteName = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export interface ChordFormula {
  name: string;
  formula: string;
}

export interface KeyChords {
  key: string;
  chords: string[];
}

export interface ProgressionGroup {
  type: string;
  colorClass: string;
  progressions: string[][];
}

export interface KeySignature {
  key: string;
  relativeMinor: string;
  accidentals: string[];
  type: "sharp" | "flat" | "none";
}

export interface ScaleDefinition {
  name: string;
  category: "Diatonic" | "Pentatonic" | "Blues" | "Mode" | "Harmonic" | "Melodic" | "Exotic";
  intervals: number[];
}

export interface ChordVoicing {
  name: string;
  frets: (number | -1)[]; // -1 = muted, 0 = open, 1+ = fret number (6 strings, low E to high E)
  fingers: (number | 0)[]; // 0 = open/muted, 1-4 = finger
  barreAt?: number; // fret number for barre
  barreStrings?: [number, number]; // [from, to] string indices
  baseFret: number; // 1 for open chords, higher for barre chords
}
