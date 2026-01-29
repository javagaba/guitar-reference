import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { getScaleNotes, noteIndex, SCALE_DEFINITIONS } from "../music";

interface AppState {
  selectedKey: string | null;
  isMinor: boolean;
  selectedScale: string;
  selectedChord: string | null;
  scaleNotes: string[];
  rootNote: string | null;
  showIntervals: boolean;
  selectKey: (key: string | null, minor?: boolean) => void;
  selectScale: (scale: string) => void;
  selectChord: (chord: string | null) => void;
  toggleIntervals: () => void;
  clearAll: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isMinor, setIsMinor] = useState(false);
  const [selectedScale, setSelectedScale] = useState("Major");
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [showIntervals, setShowIntervals] = useState(false);

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
    // Strip trailing "m" if present
    const root = key.endsWith("m") && !key.endsWith("♭m") ? key.slice(0, -1) : key;
    const isM = minor ?? key.endsWith("m");
    setSelectedKey(root);
    setIsMinor(isM);
    // When key changes, update scale to match major/minor
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

  function clearAll() {
    setSelectedKey(null);
    setIsMinor(false);
    setSelectedScale("Major");
    setSelectedChord(null);
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
      selectKey,
      selectScale,
      selectChord,
      toggleIntervals,
      clearAll,
    }),
    [selectedKey, isMinor, selectedScale, selectedChord, scaleNotes, showIntervals],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
