import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInstrument, getTuningForInstrument, type InstrumentId, type InstrumentTuning } from "../instruments";
import { getScaleNotes, noteIndex, SCALE_DEFINITIONS } from "../music";
import { isStandardIntervalTuning } from "../tunings";
import type { CagedShape } from "../types";

interface SettingsSlice {
  instrumentId: InstrumentId;
  tuningName: string;
  showIntervals: boolean;
}

interface MusicalSlice {
  selectedKey: string | null;
  isMinor: boolean;
  selectedScale: string;
  selectedChord: string | null;
  selectedCagedShapes: Set<CagedShape>;
}

interface DerivedSlice {
  scaleNotes: string[];
  rootNote: string | null;
}

interface Actions {
  // Settings actions
  setInstrumentId: (id: InstrumentId) => void;
  setTuningName: (name: string) => void;
  toggleIntervals: () => void;

  // Musical actions
  selectKey: (key: string | null, minor?: boolean) => void;
  selectScale: (scale: string) => void;
  selectChord: (chord: string | null) => void;
  toggleCagedShape: (shape: CagedShape) => void;
  setCagedShapes: (shapes: Set<CagedShape>) => void;
  clearAll: () => void;

  // For URL sync
  _setMusicalState: (state: Partial<MusicalSlice>) => void;
}

export type AppStore = SettingsSlice & MusicalSlice & DerivedSlice & Actions;

// Compute derived scale notes
function computeScaleNotes(selectedKey: string | null, selectedScale: string): string[] {
  if (!selectedKey) return [];
  const def = SCALE_DEFINITIONS.find((s) => s.name === selectedScale);
  if (!def) return [];
  return getScaleNotes(selectedKey, def.intervals);
}

// Helper: get the current tuning object
export function getSelectedTuning(state: { instrumentId: InstrumentId; tuningName: string }): InstrumentTuning {
  return getTuningForInstrument(state.instrumentId, state.tuningName);
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Settings slice
      instrumentId: "guitar",
      tuningName: "Standard",
      showIntervals: false,

      // Musical slice
      selectedKey: null,
      isMinor: false,
      selectedScale: "Major",
      selectedChord: null,
      selectedCagedShapes: new Set<CagedShape>(),

      // Derived
      scaleNotes: [],
      rootNote: null,

      // Settings actions
      setInstrumentId: (id) =>
        set((state) => {
          const instrument = getInstrument(id);
          const newTuning = instrument.defaultTuningName;
          // Clear CAGED shapes when changing instrument
          return {
            instrumentId: id,
            tuningName: newTuning,
            selectedCagedShapes: new Set<CagedShape>(),
            // If switching to bass and CAGED is irrelevant, that's fine
          };
          // Keep musical state (key, scale, chord) unchanged
        }),

      setTuningName: (name) =>
        set(() => ({
          tuningName: name,
          selectedCagedShapes: new Set<CagedShape>(),
        })),

      toggleIntervals: () =>
        set((state) => ({ showIntervals: !state.showIntervals })),

      // Musical actions
      selectKey: (key, minor) =>
        set((state) => {
          if (key === null) {
            return {
              selectedKey: null,
              isMinor: false,
              selectedChord: null,
              scaleNotes: [],
              rootNote: null,
            };
          }
          const root = key.endsWith("m") && !key.endsWith("\u266Dm") ? key.slice(0, -1) : key;
          const isM = minor ?? key.endsWith("m");
          let scale = state.selectedScale;
          if (isM && scale === "Major") {
            scale = "Natural Minor";
          } else if (!isM && scale === "Natural Minor") {
            scale = "Major";
          }
          const scaleNotes = computeScaleNotes(root, scale);
          return {
            selectedKey: root,
            isMinor: isM,
            selectedScale: scale,
            selectedChord: null,
            scaleNotes,
            rootNote: root,
          };
        }),

      selectScale: (scale) =>
        set((state) => ({
          selectedScale: scale,
          scaleNotes: computeScaleNotes(state.selectedKey, scale),
        })),

      selectChord: (chord) =>
        set(() => ({ selectedChord: chord })),

      toggleCagedShape: (shape) =>
        set((state) => {
          const next = new Set(state.selectedCagedShapes);
          if (next.has(shape)) {
            next.delete(shape);
          } else {
            next.add(shape);
          }
          return { selectedCagedShapes: next };
        }),

      setCagedShapes: (shapes) =>
        set(() => ({ selectedCagedShapes: shapes })),

      clearAll: () =>
        set(() => ({
          selectedKey: null,
          isMinor: false,
          selectedScale: "Major",
          selectedChord: null,
          selectedCagedShapes: new Set<CagedShape>(),
          scaleNotes: [],
          rootNote: null,
        })),

      _setMusicalState: (partial) =>
        set((state) => {
          const newKey = partial.selectedKey !== undefined ? partial.selectedKey : state.selectedKey;
          const newScale = partial.selectedScale !== undefined ? partial.selectedScale : state.selectedScale;
          const scaleNotes = computeScaleNotes(newKey, newScale);
          return {
            ...partial,
            scaleNotes,
            rootNote: newKey,
          };
        }),
    }),
    {
      name: "guitar-ref-settings",
      // Only persist settings slice to localStorage
      partialize: (state) => ({
        instrumentId: state.instrumentId,
        tuningName: state.tuningName,
        showIntervals: state.showIntervals,
      }),
    },
  ),
);

// Helper hook for getting the selected tuning object
export function useSelectedTuning(): InstrumentTuning {
  const instrumentId = useAppStore((s) => s.instrumentId);
  const tuningName = useAppStore((s) => s.tuningName);
  return getTuningForInstrument(instrumentId, tuningName);
}

// Helper hook for getting the current instrument definition
export function useInstrument() {
  const instrumentId = useAppStore((s) => s.instrumentId);
  return getInstrument(instrumentId);
}

// Helper: check if current tuning is standard interval
export function useIsStandardIntervalTuning(): boolean {
  const tuning = useSelectedTuning();
  // isStandardIntervalTuning expects 6-string GuitarTuning
  if (tuning.notes.length !== 6) return false;
  return isStandardIntervalTuning(tuning as { name: string; category: "Standard" | "Drop" | "Open" | "Other"; notes: string[]; midiNotes: number[] });
}
