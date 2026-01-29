import type { VoicingCategory } from "./types";

export interface VoicingTemplate {
  shape: number[];         // 6-element array, -1 = muted
  fingers: number[];
  rootString: number;      // 0=lowE, 1=A, 2=D, 3=G, 4=B, 5=highE
  barreOffset?: number;
  barreStrings?: [number, number];
  category: VoicingCategory;
  label?: string;
}

// Templates indexed by quality suffix
export const VOICING_TEMPLATES: Record<string, VoicingTemplate[]> = {
  // Major
  "": [
    // E-form barre
    { shape: [0, 2, 2, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1], rootString: 0, barreOffset: 0, barreStrings: [0, 5], category: "barre-e", label: "E-form" },
    // A-form barre
    { shape: [-1, 0, 2, 2, 2, 0], fingers: [0, 1, 3, 3, 3, 1], rootString: 1, barreOffset: 0, barreStrings: [1, 5], category: "barre-a", label: "A-form" },
    // Shell voicing (R-3-5 on D-G-B)
    { shape: [-1, -1, 0, 1, 0, -1], fingers: [0, 0, 0, 2, 0, 0], rootString: 2, category: "shell", label: "Shell (R-3-5)" },
  ],
  // Minor
  "m": [
    { shape: [0, 2, 2, 0, 0, 0], fingers: [1, 3, 4, 1, 1, 1], rootString: 0, barreOffset: 0, barreStrings: [0, 5], category: "barre-e", label: "E-form" },
    { shape: [-1, 0, 2, 2, 1, 0], fingers: [0, 1, 3, 4, 2, 1], rootString: 1, barreOffset: 0, barreStrings: [1, 5], category: "barre-a", label: "A-form" },
  ],
  // Dominant 7
  "7": [
    { shape: [0, 2, 0, 1, 0, 0], fingers: [1, 3, 0, 2, 0, 1], rootString: 0, barreOffset: 0, barreStrings: [0, 5], category: "barre-e", label: "E-form 7" },
    { shape: [-1, 0, 2, 0, 2, 0], fingers: [0, 1, 3, 0, 4, 0], rootString: 1, barreOffset: 0, barreStrings: [1, 5], category: "barre-a", label: "A-form 7" },
    // Shell: R-3-b7
    { shape: [-1, 0, 1, 0, -1, -1], fingers: [0, 0, 2, 0, 0, 0], rootString: 1, category: "shell", label: "Shell (R-3-b7)" },
    { shape: [-1, 0, 0, 1, -1, -1], fingers: [0, 0, 0, 2, 0, 0], rootString: 1, category: "shell", label: "Shell (R-b7-3)" },
  ],
  // Major 7
  "maj7": [
    { shape: [0, 2, 1, 1, 0, 0], fingers: [1, 4, 2, 3, 1, 1], rootString: 0, barreOffset: 0, barreStrings: [0, 5], category: "barre-e", label: "E-form maj7" },
    { shape: [-1, 0, 2, 1, 2, 0], fingers: [0, 1, 3, 2, 4, 1], rootString: 1, barreOffset: 0, barreStrings: [1, 5], category: "barre-a", label: "A-form maj7" },
    { shape: [-1, 0, 1, 1, -1, -1], fingers: [0, 0, 2, 3, 0, 0], rootString: 1, category: "shell", label: "Shell (R-3-7)" },
  ],
  // Minor 7
  "m7": [
    { shape: [0, 2, 0, 0, 0, 0], fingers: [1, 3, 0, 0, 1, 1], rootString: 0, barreOffset: 0, barreStrings: [0, 5], category: "barre-e", label: "E-form m7" },
    { shape: [-1, 0, 2, 0, 1, 0], fingers: [0, 1, 4, 0, 2, 1], rootString: 1, barreOffset: 0, barreStrings: [1, 5], category: "barre-a", label: "A-form m7" },
    { shape: [-1, 0, 0, 0, -1, -1], fingers: [0, 0, 0, 0, 0, 0], rootString: 1, category: "shell", label: "Shell (R-b3-b7)" },
  ],
  // Half-diminished
  "m7♭5": [
    { shape: [-1, 0, 1, 0, 1, -1], fingers: [0, 1, 2, 0, 3, 0], rootString: 1, category: "barre-a", label: "A-form m7b5" },
  ],
  // Diminished 7
  "°7": [
    { shape: [-1, 0, 1, -1, 1, -1], fingers: [0, 0, 2, 0, 3, 0], rootString: 1, category: "partial", label: "dim7" },
  ],
  // Sus2
  "sus2": [
    { shape: [0, 2, 2, 0, 0, -1], fingers: [1, 3, 4, 0, 1, 0], rootString: 0, barreOffset: 0, barreStrings: [0, 4], category: "barre-e", label: "E-form sus2" },
  ],
  // Sus4
  "sus4": [
    { shape: [0, 2, 2, 2, 0, 0], fingers: [1, 2, 3, 4, 1, 1], rootString: 0, barreOffset: 0, barreStrings: [0, 5], category: "barre-e", label: "E-form sus4" },
  ],
  // Add9
  "add9": [
    { shape: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 2, 3, 0, 0], rootString: 1, category: "open", label: "add9" },
  ],
  // 6
  "6": [
    { shape: [0, 2, 2, 1, 2, 0], fingers: [1, 2, 3, 1, 4, 1], rootString: 0, barreOffset: 0, barreStrings: [0, 5], category: "barre-e", label: "E-form 6" },
  ],
  // Minor 6
  "m6": [
    { shape: [0, 2, 2, 0, 2, 0], fingers: [1, 2, 3, 0, 4, 1], rootString: 0, barreOffset: 0, barreStrings: [0, 5], category: "barre-e", label: "E-form m6" },
  ],
  // 9
  "9": [
    { shape: [-1, 0, 2, 1, 2, 0], fingers: [0, 1, 3, 2, 4, 0], rootString: 1, category: "barre-a", label: "A-form 9" },
  ],
  // Major 9
  "maj9": [
    { shape: [-1, 0, 2, 1, 0, 0], fingers: [0, 0, 3, 2, 0, 0], rootString: 1, category: "partial", label: "maj9" },
  ],
  // Minor 9
  "m9": [
    { shape: [-1, 0, 2, 0, 0, 0], fingers: [0, 1, 4, 0, 0, 1], rootString: 1, barreOffset: 0, barreStrings: [1, 5], category: "barre-a", label: "A-form m9" },
  ],
};
