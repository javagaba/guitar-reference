import { useMemo } from "react";
import { playNoteAtMidi } from "../audio";
import { getCagedBoxesForKey } from "../cagedPatterns";
import { useAppContext } from "../context/AppContext";
import {
  buildFretboardForTuning,
  FRET_MARKERS,
  getChordToneLabel,
  getChordTones,
  getDegreeColor,
  getScaleDegree,
  isNoteInScale,
  noteIndex,
} from "../music";
import { isStandardIntervalTuning } from "../tunings";
import type { CagedShape } from "../types";
import { Card } from "./Card";
import { NoteCircle } from "./NoteCircle";
import { SectionTitle } from "./SectionTitle";

const ALL_CAGED: CagedShape[] = ["C", "A", "G", "E", "D"];

export function Fretboard() {
  const {
    scaleNotes,
    rootNote,
    showIntervals,
    toggleIntervals,
    selectedTuning,
    selectedCagedShapes,
    toggleCagedShape,
    setCagedShapes,
    selectedChord,
  } = useAppContext();
  const hasScale = scaleNotes.length > 0;
  const rootIdx = rootNote ? noteIndex(rootNote) : -1;

  const chordToneInfo = useMemo(
    () => (selectedChord ? getChordTones(selectedChord) : null),
    [selectedChord],
  );
  const chordRootIdx = useMemo(() => {
    if (!chordToneInfo || chordToneInfo.notes.length === 0) return -1;
    return noteIndex(chordToneInfo.notes[0]);
  }, [chordToneInfo]);

  const fretboard = useMemo(
    () => buildFretboardForTuning(selectedTuning.notes),
    [selectedTuning],
  );
  const stringLabels = selectedTuning.notes;

  const isStandard = useMemo(
    () => isStandardIntervalTuning(selectedTuning),
    [selectedTuning],
  );

  const cagedBoxes = useMemo(() => {
    if (!rootNote || !isStandard || selectedCagedShapes.size === 0) return null;
    return getCagedBoxesForKey(rootNote);
  }, [rootNote, isStandard, selectedCagedShapes]);

  function isInCagedBox(fret: number): { inBox: boolean; color: string | null } {
    if (!cagedBoxes || selectedCagedShapes.size === 0) return { inBox: false, color: null };
    for (const box of cagedBoxes) {
      if (selectedCagedShapes.has(box.shape) && fret >= box.lowFret && fret <= box.highFret) {
        return { inBox: true, color: box.color };
      }
    }
    return { inBox: false, color: null };
  }

  const showCagedControls = hasScale && isStandard;

  return (
    <Card className="mx-auto mt-6 max-w-300">
      <div className="flex items-center justify-between">
        <SectionTitle>Fretboard</SectionTitle>
        {hasScale && (
          <div className="flex rounded-full bg-white/10 p-0.5 font-mono text-xs">
            <button
              onClick={showIntervals ? toggleIntervals : undefined}
              className={`rounded-full px-3 py-1 transition-colors ${!showIntervals ? "bg-white/20 text-text" : "text-subtle hover:text-text"}`}
            >
              Notes
            </button>
            <button
              onClick={!showIntervals ? toggleIntervals : undefined}
              className={`rounded-full px-3 py-1 transition-colors ${showIntervals ? "bg-white/20 text-text" : "text-subtle hover:text-text"}`}
            >
              Intervals
            </button>
          </div>
        )}
      </div>

      {showCagedControls && (
        <div className="flex items-center gap-2 pt-2">
          <span className="text-[11px] text-subtle">CAGED:</span>
          {ALL_CAGED.map((shape) => {
            const active = selectedCagedShapes.has(shape);
            return (
              <button
                key={shape}
                onClick={() => toggleCagedShape(shape)}
                className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
                  active
                    ? "bg-white/20 text-text"
                    : "text-muted hover:text-subtle"
                }`}
              >
                {shape}
              </button>
            );
          })}
          <button
            onClick={() =>
              selectedCagedShapes.size === ALL_CAGED.length
                ? setCagedShapes(new Set())
                : setCagedShapes(new Set(ALL_CAGED))
            }
            className="ml-1 rounded px-2 py-0.5 text-[10px] text-subtle hover:text-text"
          >
            {selectedCagedShapes.size === ALL_CAGED.length ? "None" : "All"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto py-4">
        <div className="min-w-200">
          {/* Fret numbers */}
          <div className="mb-2 flex items-center">
            <div className="w-7 shrink-0" />
            {fretboard[0].map((_, fret) => (
              <div
                key={fret}
                className={`w-14 text-center font-mono text-[11px] ${
                  FRET_MARKERS.includes(fret) ? "text-subtle" : "text-[#555]"
                }`}
                style={{
                  borderLeft:
                    fret === 0
                      ? "3px solid transparent"
                      : "1px solid transparent",
                }}
              >
                {fret === 0 ? "Open" : fret}
              </div>
            ))}
          </div>

          {/* Strings */}
          {fretboard.map((string, stringIndex) => (
            <div key={stringIndex} className="mb-1 flex items-center">
              <div className="w-7 font-mono text-xs font-semibold text-muted">
                {stringIndex === 0 ? stringLabels[0].toLowerCase() : stringLabels[stringIndex]}
              </div>
              {string.map((note, fret) => {
                const inScale = hasScale && isNoteInScale(note, scaleNotes);
                const isRoot = hasScale && noteIndex(note) === rootIdx;

                const caged = isInCagedBox(fret);
                const isChordTone = chordToneInfo
                  ? getChordToneLabel(note, chordToneInfo) !== null
                  : false;
                const isChordRoot = chordToneInfo
                  ? noteIndex(note) === chordRootIdx
                  : false;
                const chordLabel = chordToneInfo
                  ? getChordToneLabel(note, chordToneInfo)
                  : null;

                const dimmed = hasScale && (
                  !inScale ||
                  (chordToneInfo && inScale && !isChordTone) ||
                  (selectedCagedShapes.size > 0 && !caged.inBox && inScale)
                );

                const degree = hasScale
                  ? getScaleDegree(note, scaleNotes)
                  : null;

                // When a chord is selected, show chord-tone labels; otherwise scale degrees
                const label = chordToneInfo && isChordTone
                  ? chordLabel ?? undefined
                  : showIntervals && degree != null
                    ? degree === 1
                      ? "R"
                      : String(degree)
                    : undefined;

                let emphasis: "third" | "fifth" | null = null;
                if (chordToneInfo && isChordTone && !isChordRoot) {
                  emphasis = "third";
                } else if (hasScale && inScale && rootIdx >= 0 && !chordToneInfo) {
                  const semitones =
                    (((noteIndex(note) - rootIdx) % 12) + 12) % 12;
                  if (semitones === 3 || semitones === 4) emphasis = "third";
                  else if (semitones === 7) emphasis = "fifth";
                }

                return (
                  <div
                    key={fret}
                    className="flex w-14 justify-center py-1"
                    style={{
                      borderLeft:
                        fret === 0 ? "3px solid #555" : "1px solid #333",
                      backgroundColor: caged.inBox && inScale
                        ? caged.color!
                        : FRET_MARKERS.includes(fret)
                          ? "rgba(255,255,255,0.02)"
                          : "transparent",
                    }}
                  >
                    <NoteCircle
                      note={note}
                      size={28}
                      dimmed={dimmed}
                      isRoot={chordToneInfo ? isChordRoot : isRoot}
                      label={label}
                      emphasis={emphasis}
                      colorOverride={
                        showIntervals && degree != null && !chordToneInfo
                          ? getDegreeColor(degree)
                          : undefined
                      }
                      onClick={() =>
                        playNoteAtMidi(selectedTuning.midiNotes[stringIndex] + fret)
                      }
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Fret dot markers */}
          <div className="mt-2 flex items-center">
            <div className="w-7 shrink-0" />
            {fretboard[0].map((_, fret) => (
              <div
                key={fret}
                className="w-14 text-center text-subtle"
                style={{
                  borderLeft:
                    fret === 0
                      ? "3px solid transparent"
                      : "1px solid transparent",
                }}
              >
                {fret === 12 || fret === 24
                  ? "••"
                  : FRET_MARKERS.includes(fret)
                    ? "•"
                    : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
