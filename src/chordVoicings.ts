import type { ChordVoicing } from "./types";
import { noteIndex } from "./music";
import { VOICING_TEMPLATES } from "./chordVoicingData";

// frets: [lowE, A, D, G, B, highE], -1 = muted, 0 = open
// fingers: [lowE, A, D, G, B, highE], 0 = open/muted

const VOICINGS: ChordVoicing[] = [
  // Open Major
  { name: "C",  frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1, category: "open", label: "C open" },
  { name: "D",  frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1, category: "open", label: "D open" },
  { name: "E",  frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1, category: "open", label: "E open" },
  { name: "F",  frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barreAt: 1, barreStrings: [0, 5], baseFret: 1, category: "barre-e", label: "F barre" },
  { name: "G",  frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1, category: "open", label: "G open" },
  { name: "A",  frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1, category: "open", label: "A open" },

  // Open Minor
  { name: "Dm", frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1, category: "open", label: "Dm open" },
  { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1, category: "open", label: "Em open" },
  { name: "Am", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1, category: "open", label: "Am open" },

  // Seventh chords
  { name: "A7",  frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], baseFret: 1, category: "open", label: "A7 open" },
  { name: "B7",  frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], baseFret: 1, category: "open", label: "B7 open" },
  { name: "C7",  frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], baseFret: 1, category: "open", label: "C7 open" },
  { name: "D7",  frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1, category: "open", label: "D7 open" },
  { name: "E7",  frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], baseFret: 1, category: "open", label: "E7 open" },
  { name: "G7",  frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1, category: "open", label: "G7 open" },

  // Minor 7th
  { name: "Am7", frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], baseFret: 1, category: "open", label: "Am7 open" },
  { name: "Dm7", frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], baseFret: 1, category: "open", label: "Dm7 open" },
  { name: "Em7", frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0], baseFret: 1, category: "open", label: "Em7 open" },

  // Major 7th
  { name: "Cmaj7", frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], baseFret: 1, category: "open", label: "Cmaj7 open" },
  { name: "Dmaj7", frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 2, 3], baseFret: 1, category: "open", label: "Dmaj7 open" },
  { name: "Emaj7", frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0], baseFret: 1, category: "open", label: "Emaj7 open" },
  { name: "Fmaj7", frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0], baseFret: 1, category: "open", label: "Fmaj7 open" },
  { name: "Gmaj7", frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1, category: "open", label: "Gmaj7 open" },
  { name: "Amaj7", frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 3, 1, 4, 0], baseFret: 1, category: "open", label: "Amaj7 open" },

  // Sus chords
  { name: "Asus2", frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0], baseFret: 1, category: "open", label: "Asus2 open" },
  { name: "Asus4", frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1, category: "open", label: "Asus4 open" },
  { name: "Dsus2", frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 3, 0], baseFret: 1, category: "open", label: "Dsus2 open" },
  { name: "Dsus4", frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3], baseFret: 1, category: "open", label: "Dsus4 open" },
  { name: "Esus4", frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0], baseFret: 1, category: "open", label: "Esus4 open" },

  // Power chords
  { name: "E5", frets: [0, 2, 2, -1, -1, -1], fingers: [0, 1, 2, 0, 0, 0], baseFret: 1, category: "open", label: "E5 open" },
  { name: "A5", frets: [-1, 0, 2, 2, -1, -1], fingers: [0, 0, 1, 2, 0, 0], baseFret: 1, category: "open", label: "A5 open" },
];

// Standard tuning open string note indices
const STRING_NOTE_INDICES = [
  noteIndex("E"), // low E = 0
  noteIndex("A"), // A = 1
  noteIndex("D"), // D = 2
  noteIndex("G"), // G = 3
  noteIndex("B"), // B = 4
  noteIndex("E"), // high E = 5
];

// Standard tuning open string MIDI
const STANDARD_MIDI = [40, 45, 50, 55, 59, 64];
const CHROMATIC = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

function transposeTemplate(
  name: string,
  template: typeof VOICING_TEMPLATES[""][0],
  rootIdx: number,
): ChordVoicing | null {
  const openNoteIdx = STRING_NOTE_INDICES[template.rootString];
  const baseFret = ((rootIdx - openNoteIdx) + 12) % 12;

  // Skip if baseFret is 0 — that would be an open chord already covered by hand-tuned voicings
  if (baseFret === 0) return null;

  const frets = template.shape.map((f) => (f === -1 ? -1 : f + baseFret));
  const fingers = template.fingers.map((f) => (f === 0 ? 0 : f));

  // Playability: reject if fret span (excluding open/muted) > 4
  const playedFrets = frets.filter((f) => f > 0);
  if (playedFrets.length > 0) {
    const span = Math.max(...playedFrets) - Math.min(...playedFrets);
    if (span > 4) return null;
  }

  // Reject if any fret > 15
  if (frets.some((f) => f > 15)) return null;

  const voicing: ChordVoicing = {
    name,
    frets,
    fingers,
    baseFret,
    category: template.category,
    label: template.label,
  };

  if (template.barreOffset !== undefined && template.barreStrings) {
    voicing.barreAt = baseFret + template.barreOffset;
    voicing.barreStrings = template.barreStrings;
  }

  // Compute bass note
  for (let s = 0; s <= 5; s++) {
    if (frets[s] >= 0) {
      const midi = STANDARD_MIDI[s] + frets[s];
      voicing.bassNote = CHROMATIC[midi % 12];
      break;
    }
  }

  return voicing;
}

function parseChordName(chord: string): { root: string; quality: string } | null {
  const match = chord.match(/^([A-G][♯♭]?)(.*)/);
  if (!match) return null;
  return { root: match[1], quality: match[2] };
}

// Compute bass note for existing hand-tuned voicings
function addBassNote(v: ChordVoicing): ChordVoicing {
  if (v.bassNote) return v;
  for (let s = 0; s <= 5; s++) {
    if (v.frets[s] >= 0) {
      const fret = v.frets[s];
      const actualFret = v.baseFret > 1 ? fret : fret;
      const midi = STANDARD_MIDI[s] + actualFret;
      return { ...v, bassNote: CHROMATIC[midi % 12] };
    }
  }
  return v;
}

export function getChordVoicings(chordName: string): ChordVoicing[] {
  // Direct matches from hand-tuned voicings
  const direct = VOICINGS.filter((v) => v.name === chordName).map(addBassNote);

  const parsed = parseChordName(chordName);
  if (!parsed) return direct;

  const rootIdx = noteIndex(parsed.root);
  if (rootIdx < 0) return direct;

  // Generate from templates
  const templates = VOICING_TEMPLATES[parsed.quality] ?? [];
  const generated: ChordVoicing[] = [];

  for (const template of templates) {
    const voicing = transposeTemplate(chordName, template, rootIdx);
    if (voicing) {
      generated.push(voicing);
    }
  }

  // Deduplicate: if a generated voicing has the same fret pattern as a direct one, skip it
  const directPatterns = new Set(direct.map((v) => v.frets.join(",")));
  const unique = generated.filter((v) => !directPatterns.has(v.frets.join(",")));

  return [...direct, ...unique];
}
