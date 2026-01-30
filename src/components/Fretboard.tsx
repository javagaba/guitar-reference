import { useMemo } from "react";
import { playNoteAtMidi } from "../audio";
import { getCagedBoxesForKey } from "../cagedPatterns";
import { getInstrument } from "../instruments";
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
import { useAppStore, useIsStandardIntervalTuning, useSelectedTuning } from "../stores/appStore";
import type { CagedShape } from "../types";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "./Card";
import { NoteCircle } from "./NoteCircle";
import { SectionTitle } from "./SectionTitle";

const ALL_CAGED: CagedShape[] = ["C", "A", "G", "E", "D"];

export function Fretboard() {
  const scaleNotes = useAppStore((s) => s.scaleNotes);
  const rootNote = useAppStore((s) => s.rootNote);
  const showIntervals = useAppStore((s) => s.showIntervals);
  const toggleIntervals = useAppStore((s) => s.toggleIntervals);
  const instrumentId = useAppStore((s) => s.instrumentId);
  const selectedCagedShapes = useAppStore((s) => s.selectedCagedShapes);
  const toggleCagedShape = useAppStore((s) => s.toggleCagedShape);
  const setCagedShapes = useAppStore((s) => s.setCagedShapes);
  const selectedChord = useAppStore((s) => s.selectedChord);

  const selectedTuning = useSelectedTuning();
  const isStandard = useIsStandardIntervalTuning();
  const instrument = getInstrument(instrumentId);

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
    () => buildFretboardForTuning(selectedTuning.notes, instrument.defaultFrets),
    [selectedTuning, instrument.defaultFrets],
  );

  const fretMarkers = useMemo(
    () => FRET_MARKERS.filter((f) => f <= instrument.defaultFrets),
    [instrument.defaultFrets],
  );

  const cagedBoxes = useMemo(() => {
    if (!rootNote || !isStandard || selectedCagedShapes.size === 0) return null;
    return getCagedBoxesForKey(rootNote);
  }, [rootNote, isStandard, selectedCagedShapes]);

  function isInCagedBox(fret: number): {
    inBox: boolean;
    color: string | null;
  } {
    if (!cagedBoxes || selectedCagedShapes.size === 0)
      return { inBox: false, color: null };
    for (const box of cagedBoxes) {
      if (
        selectedCagedShapes.has(box.shape) &&
        fret >= box.lowFret &&
        fret <= box.highFret
      ) {
        return { inBox: true, color: box.color };
      }
    }
    return { inBox: false, color: null };
  }

  const showCagedControls = hasScale && isStandard && instrument.supportsCaged;

  return (
    <Card className="mx-auto mt-6 max-w-300">
      <div className="flex items-center justify-between">
        <SectionTitle>{instrument.label} [{selectedTuning.name}]</SectionTitle>
        {hasScale && (
          <ToggleGroup
            type="single"
            value={showIntervals ? "intervals" : "notes"}
            onValueChange={(val) => {
              if (val && ((val === "intervals") !== showIntervals)) {
                toggleIntervals();
              }
            }}
            className="rounded-full bg-white/10 p-0.5 font-mono text-xs"
          >
            <ToggleGroupItem
              value="notes"
              className="rounded-full px-3 py-1 h-auto min-w-0 text-xs data-[state=on]:bg-white/20 data-[state=on]:text-text text-subtle hover:text-text hover:bg-transparent"
            >
              Notes
            </ToggleGroupItem>
            <ToggleGroupItem
              value="intervals"
              className="rounded-full px-3 py-1 h-auto min-w-0 text-xs data-[state=on]:bg-white/20 data-[state=on]:text-text text-subtle hover:text-text hover:bg-transparent"
            >
              Intervals
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      {showCagedControls && (
        <div className="flex items-center gap-2 pt-2">
          <span className="text-[11px] text-subtle">CAGED:</span>
          {ALL_CAGED.map((shape) => {
            const active = selectedCagedShapes.has(shape);
            return (
              <Toggle
                key={shape}
                pressed={active}
                onPressedChange={() => toggleCagedShape(shape)}
                size="sm"
                className="px-2 py-0.5 h-auto min-w-0 font-mono text-xs data-[state=on]:bg-white/20 data-[state=on]:text-text text-muted hover:text-subtle hover:bg-transparent"
              >
                {shape}
              </Toggle>
            );
          })}
          <Button
            onClick={() =>
              selectedCagedShapes.size === ALL_CAGED.length
                ? setCagedShapes(new Set())
                : setCagedShapes(new Set(ALL_CAGED))
            }
            variant="ghost"
            size="xs"
            className="ml-1 text-[10px] text-subtle hover:text-text"
          >
            {selectedCagedShapes.size === ALL_CAGED.length ? "None" : "All"}
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-200">
          {/* Fret numbers */}
          <div className="mb-2 flex items-center">
            <div className="w-14 shrink-0" />
            {fretboard[0].slice(1).map((_, i) => {
              const fret = i + 1;
              return (
                <div
                  key={fret}
                  className={`w-14 text-center font-mono text-xs ${
                    fretMarkers.includes(fret) ? "text-subtle" : "text-[#555]"
                  }`}
                  style={{ borderLeft: "1px solid transparent" }}
                >
                  {fret}
                </div>
              );
            })}
          </div>

          {/* Strings */}
          {fretboard.map((string, stringIndex) => {
            const openNote = string[0];
            const openInScale = hasScale && isNoteInScale(openNote, scaleNotes);
            const openIsRoot = hasScale && noteIndex(openNote) === rootIdx;
            const openCaged = isInCagedBox(0);
            const openIsChordTone = chordToneInfo
              ? getChordToneLabel(openNote, chordToneInfo) !== null
              : false;
            const openIsChordRoot = chordToneInfo
              ? noteIndex(openNote) === chordRootIdx
              : false;
            const openChordLabel = chordToneInfo
              ? getChordToneLabel(openNote, chordToneInfo)
              : null;
            const openDimmed =
              hasScale &&
              (!openInScale ||
                (chordToneInfo && openInScale && !openIsChordTone) ||
                (selectedCagedShapes.size > 0 &&
                  !openCaged.inBox &&
                  openInScale));
            const openDegree = hasScale
              ? getScaleDegree(openNote, scaleNotes)
              : null;
            const openLabel =
              chordToneInfo && openIsChordTone
                ? (openChordLabel ?? undefined)
                : showIntervals && openDegree != null
                  ? openDegree === 1
                    ? "R"
                    : String(openDegree)
                  : undefined;
            let openEmphasis: "third" | "fifth" | null = null;
            if (chordToneInfo && openIsChordTone && !openIsChordRoot) {
              openEmphasis = "third";
            } else if (
              hasScale &&
              openInScale &&
              rootIdx >= 0 &&
              !chordToneInfo
            ) {
              const semitones =
                (((noteIndex(openNote) - rootIdx) % 12) + 12) % 12;
              if (semitones === 3 || semitones === 4) openEmphasis = "third";
              else if (semitones === 7) openEmphasis = "fifth";
            }

            return (
              <div key={stringIndex} className="flex items-center">
                {/* Open note column */}
                <div
                  className="flex w-14 shrink-0 items-center justify-center"
                  style={{ borderRight: "3px solid #555" }}
                >
                  <NoteCircle
                    note={openNote}
                    size={28}
                    dimmed={openDimmed}
                    isRoot={chordToneInfo ? openIsChordRoot : openIsRoot}
                    label={openLabel}
                    emphasis={openEmphasis}
                    colorOverride={
                      showIntervals && openDegree != null && !chordToneInfo
                        ? getDegreeColor(openDegree)
                        : undefined
                    }
                    onClick={() =>
                      playNoteAtMidi(selectedTuning.midiNotes[stringIndex])
                    }
                  />
                </div>
                {/* Frets 1+ */}
                {string.slice(1).map((note, i) => {
                  const fret = i + 1;
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

                  const dimmed =
                    hasScale &&
                    (!inScale ||
                      (chordToneInfo && inScale && !isChordTone) ||
                      (selectedCagedShapes.size > 0 &&
                        !caged.inBox &&
                        inScale));

                  const degree = hasScale
                    ? getScaleDegree(note, scaleNotes)
                    : null;

                  const label =
                    chordToneInfo && isChordTone
                      ? (chordLabel ?? undefined)
                      : showIntervals && degree != null
                        ? degree === 1
                          ? "R"
                          : String(degree)
                        : undefined;

                  let emphasis: "third" | "fifth" | null = null;
                  if (chordToneInfo && isChordTone && !isChordRoot) {
                    emphasis = "third";
                  } else if (
                    hasScale &&
                    inScale &&
                    rootIdx >= 0 &&
                    !chordToneInfo
                  ) {
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
                        borderLeft: "1px solid #333",
                        backgroundColor:
                          caged.inBox && inScale
                            ? caged.color!
                            : fretMarkers.includes(fret)
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
                          playNoteAtMidi(
                            selectedTuning.midiNotes[stringIndex] + fret,
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Fret dot markers */}
          <div className="mt-2 flex items-center">
            <div className="w-14 shrink-0" />
            {fretboard[0].slice(1).map((_, i) => {
              const fret = i + 1;
              return (
                <div
                  key={fret}
                  className="w-14 text-center text-subtle"
                  style={{ borderLeft: "1px solid transparent" }}
                >
                  {fret === 12 || fret === 24
                    ? "••"
                    : fretMarkers.includes(fret)
                      ? "•"
                      : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
