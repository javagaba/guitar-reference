import type { ChordVoicing } from "./types";
import { noteIndex } from "./music";

// frets: [lowE, A, D, G, B, highE], -1 = muted, 0 = open
// fingers: [lowE, A, D, G, B, highE], 0 = open/muted

const VOICINGS: ChordVoicing[] = [
  // Open Major
  { name: "C",  frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
  { name: "D",  frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
  { name: "E",  frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 },
  { name: "F",  frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barreAt: 1, barreStrings: [0, 5], baseFret: 1 },
  { name: "G",  frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 },
  { name: "A",  frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },

  // Open Minor
  { name: "Dm", frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 },
  { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
  { name: "Am", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },

  // Barre Major templates (E-form and A-form)
  { name: "F",  frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barreAt: 1, barreStrings: [0, 5], baseFret: 1 },
  { name: "B♭", frets: [1, 1, 3, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barreAt: 1, barreStrings: [0, 5], baseFret: 6 },

  // Barre Minor templates
  { name: "Fm", frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barreAt: 1, barreStrings: [0, 5], baseFret: 1 },
  { name: "Bm", frets: [2, 2, 4, 4, 3, 2], fingers: [1, 1, 3, 4, 2, 1], barreAt: 2, barreStrings: [0, 5], baseFret: 1 },

  // Seventh chords
  { name: "A7",  frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], baseFret: 1 },
  { name: "B7",  frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], baseFret: 1 },
  { name: "C7",  frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], baseFret: 1 },
  { name: "D7",  frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1 },
  { name: "E7",  frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], baseFret: 1 },
  { name: "G7",  frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1 },

  // Minor 7th
  { name: "Am7", frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], baseFret: 1 },
  { name: "Dm7", frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], baseFret: 1 },
  { name: "Em7", frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0], baseFret: 1 },

  // Sus chords
  { name: "Asus2", frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0], baseFret: 1 },
  { name: "Asus4", frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
  { name: "Dsus2", frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 3, 0], baseFret: 1 },
  { name: "Dsus4", frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3], baseFret: 1 },
  { name: "Esus4", frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0], baseFret: 1 },

  // Power chords
  { name: "E5", frets: [0, 2, 2, -1, -1, -1], fingers: [0, 1, 2, 0, 0, 0], baseFret: 1 },
  { name: "A5", frets: [-1, 0, 2, 2, -1, -1], fingers: [0, 0, 1, 2, 0, 0], baseFret: 1 },
];

// E-form barre shape (offsets from root on low E)
const E_FORM_MAJOR = [0, 2, 2, 1, 0, 0]; // E shape offsets
const E_FORM_MINOR = [0, 2, 2, 0, 0, 0]; // Em shape offsets

// A-form barre shape (offsets from root on A string)
const A_FORM_MAJOR = [-1, 0, 2, 2, 2, 0]; // A shape offsets
const A_FORM_MINOR = [-1, 0, 2, 2, 1, 0]; // Am shape offsets

function transposeBarreChord(
  name: string,
  template: number[],
  baseFret: number,
  barreStrings: [number, number],
): ChordVoicing {
  const frets = template.map((f) => (f === -1 ? -1 : f + baseFret));
  const fingers = template.map((f) => (f === -1 ? 0 : f === 0 ? 1 : f === 1 ? 2 : f === 2 ? 3 : 4));
  return {
    name,
    frets,
    fingers,
    barreAt: baseFret,
    barreStrings,
    baseFret,
  };
}

function parseChordName(chord: string): { root: string; quality: string } | null {
  // Match root note (letter + optional accidental) then quality
  const match = chord.match(/^([A-G][♯♭]?)(.*)/);
  if (!match) return null;
  return { root: match[1], quality: match[2] };
}

export function getChordVoicings(chordName: string): ChordVoicing[] {
  // Direct matches first
  const direct = VOICINGS.filter((v) => v.name === chordName);
  if (direct.length > 0) return direct;

  // Try transposing barre shapes
  const parsed = parseChordName(chordName);
  if (!parsed) return [];

  const rootIdx = noteIndex(parsed.root);
  if (rootIdx < 0) return [];

  const results: ChordVoicing[] = [];
  const quality = parsed.quality;

  // E-form: root on low E string. E = fret 0, F = fret 1, etc.
  const eFormFret = ((rootIdx - noteIndex("E")) + 12) % 12;
  if (eFormFret > 0) { // Skip open position (already covered by direct matches)
    if (quality === "" || quality === "m") {
      const template = quality === "m" ? E_FORM_MINOR : E_FORM_MAJOR;
      results.push(transposeBarreChord(chordName, template, eFormFret, [0, 5]));
    }
  }

  // A-form: root on A string. A = fret 0, B♭ = fret 1, etc.
  const aFormFret = ((rootIdx - noteIndex("A")) + 12) % 12;
  if (aFormFret > 0) {
    if (quality === "" || quality === "m") {
      const template = quality === "m" ? A_FORM_MINOR : A_FORM_MAJOR;
      results.push(transposeBarreChord(chordName, template, aFormFret, [1, 5]));
    }
  }

  return results;
}
