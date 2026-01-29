import { noteIndex } from "./music";
import type { CagedShape } from "./types";

export interface CagedBox {
  shape: CagedShape;
  color: string;
  lowFret: number;
  highFret: number;
}

// Reference positions for A minor pentatonic (root = A, noteIndex = 9)
// These define the 5 CAGED box positions as fret ranges
const CAGED_REFERENCE: { shape: CagedShape; color: string; lowFret: number; highFret: number }[] = [
  { shape: "E", color: "rgba(239,68,68,0.12)", lowFret: 0, highFret: 3 },
  { shape: "D", color: "rgba(168,85,247,0.12)", lowFret: 2, highFret: 5 },
  { shape: "C", color: "rgba(59,130,246,0.12)", lowFret: 4, highFret: 8 },
  { shape: "A", color: "rgba(34,197,94,0.12)", lowFret: 7, highFret: 10 },
  { shape: "G", color: "rgba(234,179,8,0.12)", lowFret: 9, highFret: 12 },
];

const REFERENCE_ROOT = 9; // A

const MAX_FRET = 21;

export function getCagedBoxesForKey(root: string): CagedBox[] {
  const rootIdx = noteIndex(root);
  const offset = ((rootIdx - REFERENCE_ROOT) + 12) % 12;
  const boxes: CagedBox[] = [];

  for (const ref of CAGED_REFERENCE) {
    const baseLow = ref.lowFret + offset;
    const baseHigh = ref.highFret + offset;
    // Emit the box in every octave that overlaps 0..MAX_FRET
    for (let oct = -12; oct <= 12; oct += 12) {
      const low = baseLow + oct;
      const high = baseHigh + oct;
      if (high < 0 || low > MAX_FRET) continue;
      boxes.push({
        shape: ref.shape,
        color: ref.color,
        lowFret: Math.max(0, low),
        highFret: Math.min(MAX_FRET, high),
      });
    }
  }

  return boxes;
}
