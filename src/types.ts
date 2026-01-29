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
