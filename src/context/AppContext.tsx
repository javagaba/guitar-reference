import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { getScaleNotes, noteIndex, SCALE_DEFINITIONS } from "../music";
import { DEFAULT_TUNING, TUNINGS, type GuitarTuning } from "../tunings";
import type { CagedShape } from "../types";

interface AppState {
  selectedKey: string | null;
  isMinor: boolean;
  selectedScale: string;
  selectedChord: string | null;
  scaleNotes: string[];
  rootNote: string | null;
  showIntervals: boolean;
  selectedTuning: GuitarTuning;
  selectedCagedShapes: Set<CagedShape>;
  selectKey: (key: string | null, minor?: boolean) => void;
  selectScale: (scale: string) => void;
  selectChord: (chord: string | null) => void;
  toggleIntervals: () => void;
  setTuning: (tuning: GuitarTuning) => void;
  toggleCagedShape: (shape: CagedShape) => void;
  setCagedShapes: (shapes: Set<CagedShape>) => void;
  clearAll: () => void;
}

const AppContext = createContext<AppState | null>(null);

function parseInitialState(searchParams: URLSearchParams) {
  let key: string | null = null;
  let scale = "Major";
  let minor = false;

  const keyParam = searchParams.get("key");
  if (keyParam && noteIndex(keyParam) >= 0) {
    key = keyParam;
  }

  const scaleParam = searchParams.get("scale");
  if (scaleParam && SCALE_DEFINITIONS.some((s) => s.name === scaleParam)) {
    scale = scaleParam;
  }

  if (searchParams.has("minor")) {
    minor = true;
  }

  // Parse tuning
  const tuningParam = searchParams.get("tuning");
  let tuning = DEFAULT_TUNING;
  if (tuningParam) {
    const found = TUNINGS.find((t) => t.name === tuningParam);
    if (found) tuning = found;
  }

  // Parse CAGED
  const cagedParam = searchParams.get("caged");
  const cagedShapes = new Set<CagedShape>();
  if (cagedParam) {
    for (const s of cagedParam.split(",")) {
      if (["C", "A", "G", "E", "D"].includes(s)) {
        cagedShapes.add(s as CagedShape);
      }
    }
  }

  return { key, scale, minor, tuning, cagedShapes };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initial = useMemo(() => parseInitialState(searchParams), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedKey, setSelectedKey] = useState<string | null>(initial.key);
  const [isMinor, setIsMinor] = useState(initial.minor);
  const [selectedScale, setSelectedScale] = useState(initial.scale);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [showIntervals, setShowIntervals] = useState(false);
  const [selectedTuning, setSelectedTuning] = useState<GuitarTuning>(initial.tuning);
  const [selectedCagedShapes, setSelectedCagedShapes] = useState<Set<CagedShape>>(initial.cagedShapes);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (selectedKey) {
          next.set("key", selectedKey);
        } else {
          next.delete("key");
        }
        if (selectedScale !== "Major") {
          next.set("scale", selectedScale);
        } else {
          next.delete("scale");
        }
        if (isMinor) {
          next.set("minor", "1");
        } else {
          next.delete("minor");
        }
        if (selectedTuning.name !== "Standard") {
          next.set("tuning", selectedTuning.name);
        } else {
          next.delete("tuning");
        }
        if (selectedCagedShapes.size > 0) {
          next.set("caged", [...selectedCagedShapes].join(","));
        } else {
          next.delete("caged");
        }
        return next;
      },
      { replace: true },
    );
  }, [selectedKey, selectedScale, isMinor, selectedTuning, selectedCagedShapes, setSearchParams]);

  const scaleNotes = useMemo(() => {
    if (!selectedKey) return [];
    const def = SCALE_DEFINITIONS.find((s) => s.name === selectedScale);
    if (!def) return [];
    return getScaleNotes(selectedKey, def.intervals);
  }, [selectedKey, selectedScale]);

  const rootNote = selectedKey;

  function selectKey(key: string | null, minor?: boolean) {
    if (key === null) {
      setSelectedKey(null);
      setIsMinor(false);
      setSelectedChord(null);
      return;
    }
    const root = key.endsWith("m") && !key.endsWith("♭m") ? key.slice(0, -1) : key;
    const isM = minor ?? key.endsWith("m");
    setSelectedKey(root);
    setIsMinor(isM);
    if (isM && selectedScale === "Major") {
      setSelectedScale("Natural Minor");
    } else if (!isM && selectedScale === "Natural Minor") {
      setSelectedScale("Major");
    }
    setSelectedChord(null);
  }

  function selectScale(scale: string) {
    setSelectedScale(scale);
  }

  function selectChord(chord: string | null) {
    setSelectedChord(chord);
  }

  function toggleIntervals() {
    setShowIntervals((v) => !v);
  }

  function setTuning(tuning: GuitarTuning) {
    setSelectedTuning(tuning);
    // Clear CAGED shapes when changing tuning
    setSelectedCagedShapes(new Set());
  }

  function toggleCagedShape(shape: CagedShape) {
    setSelectedCagedShapes((prev) => {
      const next = new Set(prev);
      if (next.has(shape)) {
        next.delete(shape);
      } else {
        next.add(shape);
      }
      return next;
    });
  }

  function setCagedShapes(shapes: Set<CagedShape>) {
    setSelectedCagedShapes(shapes);
  }

  function clearAll() {
    setSelectedKey(null);
    setIsMinor(false);
    setSelectedScale("Major");
    setSelectedChord(null);
    setSelectedCagedShapes(new Set());
  }

  const value = useMemo<AppState>(
    () => ({
      selectedKey,
      isMinor,
      selectedScale,
      selectedChord,
      scaleNotes,
      rootNote,
      showIntervals,
      selectedTuning,
      selectedCagedShapes,
      selectKey,
      selectScale,
      selectChord,
      toggleIntervals,
      setTuning,
      toggleCagedShape,
      setCagedShapes,
      clearAll,
    }),
    [selectedKey, isMinor, selectedScale, selectedChord, scaleNotes, showIntervals, selectedTuning, selectedCagedShapes],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
