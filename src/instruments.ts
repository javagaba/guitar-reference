import { TUNINGS, type GuitarTuning } from "./tunings";

export type InstrumentId = "guitar" | "bass";

export interface InstrumentTuning {
  name: string;
  category: "Standard" | "Drop" | "Open" | "Other";
  notes: string[];
  midiNotes: number[];
}

export interface InstrumentDefinition {
  id: InstrumentId;
  label: string;
  stringCount: number;
  defaultFrets: number;
  tunings: InstrumentTuning[];
  defaultTuningName: string;
  supportsCaged: boolean;
  hasChordVoicings: boolean;
}

const BASS_TUNINGS: InstrumentTuning[] = [
  {
    name: "Standard",
    category: "Standard",
    notes: ["G", "D", "A", "E"],
    midiNotes: [43, 38, 33, 28],
  },
  {
    name: "Half-Step Down",
    category: "Standard",
    notes: ["F♯", "C♯", "G♯", "D♯"],
    midiNotes: [42, 37, 32, 27],
  },
  {
    name: "Drop D",
    category: "Drop",
    notes: ["G", "D", "A", "D"],
    midiNotes: [43, 38, 33, 26],
  },
  {
    name: "D Standard",
    category: "Standard",
    notes: ["F", "C", "G", "D"],
    midiNotes: [41, 36, 31, 26],
  },
  {
    name: "Drop C",
    category: "Drop",
    notes: ["F", "C", "G", "C"],
    midiNotes: [41, 36, 31, 24],
  },
];

export const INSTRUMENTS: InstrumentDefinition[] = [
  {
    id: "guitar",
    label: "Guitar",
    stringCount: 6,
    defaultFrets: 24,
    tunings: TUNINGS as InstrumentTuning[],
    defaultTuningName: "Standard",
    supportsCaged: true,
    hasChordVoicings: true,
  },
  {
    id: "bass",
    label: "Bass",
    stringCount: 4,
    defaultFrets: 20,
    tunings: BASS_TUNINGS,
    defaultTuningName: "Standard",
    supportsCaged: false,
    hasChordVoicings: false,
  },
];

export function getInstrument(id: InstrumentId): InstrumentDefinition {
  return INSTRUMENTS.find((i) => i.id === id) ?? INSTRUMENTS[0];
}

export function getTuningForInstrument(
  instrumentId: InstrumentId,
  tuningName: string,
): InstrumentTuning {
  const instrument = getInstrument(instrumentId);
  return (
    instrument.tunings.find((t) => t.name === tuningName) ??
    instrument.tunings.find((t) => t.name === instrument.defaultTuningName) ??
    instrument.tunings[0]
  );
}
