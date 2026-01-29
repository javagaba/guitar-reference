import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
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

  return { key, scale, minor };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initial = useMemo(() => parseInitialState(searchParams), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedKey, setSelectedKey] = useState<string | null>(initial.key);
  const [isMinor, setIsMinor] = useState(initial.minor);
  const [selectedScale, setSelectedScale] = useState(initial.scale);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [showIntervals, setShowIntervals] = useState(false);

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
        return next;
      },
      { replace: true },
    );
  }, [selectedKey, selectedScale, isMinor, setSearchParams]);

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
