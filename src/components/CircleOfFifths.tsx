import { useState } from "react";
import {
  CIRCLE_MAJOR,
  CIRCLE_MINOR,
  getDiatonicChords,
  getKeySignature,
  getNoteColor,
  getScaleNotes,
  MAJOR_NUMERALS,
  MINOR_NUMERALS,
} from "../music";
import { Card } from "./Card";
import { NoteCircle } from "./NoteCircle";
import { SectionTitle } from "./SectionTitle";

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

const CX = 250;
const CY = 250;
const OUTER_R = 195;
const INNER_R = 125;
const OUTER_CIRCLE_R = 30;
const INNER_CIRCLE_R = 22;

function angleDeg(i: number) {
  return i * 30 - 90;
}
function angleRad(i: number) {
  return (angleDeg(i) * Math.PI) / 180;
}
function pos(i: number, radius: number) {
  const a = angleRad(i);
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

function accidentalLabel(key: string): string {
  const ks = getKeySignature(key);
  if (!ks || ks.accidentals.length === 0) return "";
  const symbol = ks.type === "sharp" ? "♯" : "♭";
  return `${ks.accidentals.length}${symbol}`;
}

export function CircleOfFifths() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isMinor, setIsMinor] = useState(false);

  // Derive relationship data for the selected key
  const selectedMajorIdx = selectedKey
    ? CIRCLE_MAJOR.indexOf(isMinor ? getRelativeMajor(selectedKey) : selectedKey)
    : -1;

  function getRelativeMajor(minorKey: string): string {
    const minorIdx = CIRCLE_MINOR.indexOf(minorKey + "m");
    return minorIdx >= 0 ? CIRCLE_MAJOR[minorIdx] : "";
  }

  function getRelativeMinor(majorKey: string): string {
    const majorIdx = CIRCLE_MAJOR.indexOf(majorKey);
    return majorIdx >= 0 ? CIRCLE_MINOR[majorIdx] : "";
  }

  function isRelated(circleIdx: number, isMajorRing: boolean): boolean {
    if (selectedMajorIdx < 0) return false;
    if (isMajorRing) {
      // Same position, or neighbors on the circle
      const diff = Math.abs(circleIdx - selectedMajorIdx);
      return diff <= 1 || diff === 11;
    }
    // Minor ring: relative minor of selected major, or at neighbor positions
    const diff = Math.abs(circleIdx - selectedMajorIdx);
    return diff === 0 || diff <= 1 || diff === 11;
  }

  function getOpacity(circleIdx: number, isMajorRing: boolean): number {
    if (selectedKey === null) return 1;
    // The selected key itself
    if (isMajorRing && !isMinor && CIRCLE_MAJOR[circleIdx] === selectedKey) return 1;
    if (!isMajorRing && isMinor && CIRCLE_MINOR[circleIdx] === selectedKey + "m") return 1;
    // Relative key
    if (isMajorRing && isMinor && CIRCLE_MAJOR[circleIdx] === getRelativeMajor(selectedKey))
      return 1;
    if (!isMajorRing && !isMinor && CIRCLE_MINOR[circleIdx] === getRelativeMinor(selectedKey))
      return 1;
    if (isRelated(circleIdx, isMajorRing)) return 0.7;
    return 0.35;
  }

  function handleMajorClick(key: string) {
    if (selectedKey === key && !isMinor) {
      setSelectedKey(null);
    } else {
      setSelectedKey(key);
      setIsMinor(false);
    }
  }

  function handleMinorClick(minorLabel: string) {
    const root = minorLabel.replace("m", "");
    if (selectedKey === root && isMinor) {
      setSelectedKey(null);
    } else {
      setSelectedKey(root);
      setIsMinor(true);
    }
  }

  function navigateTo(keyLabel: string) {
    if (keyLabel.endsWith("m")) {
      setSelectedKey(keyLabel.replace("m", ""));
      setIsMinor(true);
    } else {
      setSelectedKey(keyLabel);
      setIsMinor(false);
    }
  }

  // Relationship lines
  function renderRelationshipLines() {
    if (selectedKey === null || selectedMajorIdx < 0) return null;
    const lines: React.ReactNode[] = [];
    const selPos = isMinor
      ? pos(selectedMajorIdx, INNER_R)
      : pos(selectedMajorIdx, OUTER_R);

    // Line to relative key
    const relPos = isMinor
      ? pos(selectedMajorIdx, OUTER_R)
      : pos(selectedMajorIdx, INNER_R);
    lines.push(
      <line
        key="relative"
        x1={selPos.x}
        y1={selPos.y}
        x2={relPos.x}
        y2={relPos.y}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />,
    );

    // Lines to circle neighbors
    const prevIdx = (selectedMajorIdx - 1 + 12) % 12;
    const nextIdx = (selectedMajorIdx + 1) % 12;
    const ring = isMinor ? INNER_R : OUTER_R;
    for (const nIdx of [prevIdx, nextIdx]) {
      const nPos = pos(nIdx, ring);
      lines.push(
        <line
          key={`neighbor-${nIdx}`}
          x1={selPos.x}
          y1={selPos.y}
          x2={nPos.x}
          y2={nPos.y}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="3,3"
        />,
      );
    }
    return lines;
  }

  // Detail panel data
  const displayKey = selectedKey !== null ? (isMinor ? selectedKey + "m" : selectedKey) : null;
  const scaleNotes =
    selectedKey !== null
      ? getScaleNotes(selectedKey, isMinor ? MINOR_INTERVALS : MAJOR_INTERVALS)
      : [];
  const chords = selectedKey !== null ? getDiatonicChords(selectedKey, isMinor) : [];
  const numerals = isMinor ? MINOR_NUMERALS : MAJOR_NUMERALS;
  const ks = selectedKey !== null ? getKeySignature(isMinor ? getRelativeMajor(selectedKey) : selectedKey) : null;

  const relativeLabel = ks
    ? isMinor
      ? ks.key
      : ks.relativeMinor
    : null;

  // Neighbor keys on the circle
  const neighborKeys =
    selectedMajorIdx >= 0
      ? [
          isMinor
            ? CIRCLE_MINOR[(selectedMajorIdx - 1 + 12) % 12]
            : CIRCLE_MAJOR[(selectedMajorIdx - 1 + 12) % 12],
          isMinor
            ? CIRCLE_MINOR[(selectedMajorIdx + 1) % 12]
            : CIRCLE_MAJOR[(selectedMajorIdx + 1) % 12],
        ]
      : [];

  // Accidental summary for the detail panel
  function accidentalSummary(): string {
    if (!ks) return "";
    // For minor keys, derive from relative major
    const sig = isMinor ? ks : ks;
    if (sig.accidentals.length === 0) return "No sharps or flats";
    const symbol = sig.type === "sharp" ? "♯" : "♭";
    return `${sig.accidentals.length}${symbol}: ${sig.accidentals.join(" ")}`;
  }

  return (
    <Card className="mx-auto mt-6 max-w-[580px]">
      <SectionTitle>Circle of Fifths</SectionTitle>
      <div className="flex justify-center py-3">
        <svg viewBox="0 0 500 500" width="480" height="480">
          {/* Arc text labels — right side (5ths) and left side (4ths) */}
          <defs>
            <path
              id="arc-right"
              d="M 368.5,44.8 A 237,237 0 0,1 368.5,455.2"
            />
            <path
              id="arc-left"
              d="M 131.5,455.2 A 237,237 0 0,1 131.5,44.8"
            />
          </defs>
          <text fill="#444" fontSize="12" fontWeight="500">
            <textPath href="#arc-right" startOffset="50%" textAnchor="middle">
              5ths →
            </textPath>
          </text>
          <text fill="#444" fontSize="12" fontWeight="500">
            <textPath href="#arc-left" startOffset="50%" textAnchor="middle">
              ← 4ths
            </textPath>
          </text>

          {/* Relationship lines (behind circles) */}
          {renderRelationshipLines()}

          {/* Outer ring — major keys */}
          {CIRCLE_MAJOR.map((note, i) => {
            const { x, y } = pos(i, OUTER_R);
            const opacity = getOpacity(i, true);
            const isSelected = !isMinor && selectedKey === note;
            const label = accidentalLabel(note);
            return (
              <g
                key={`maj-${note}`}
                onClick={() => handleMajorClick(note)}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                opacity={opacity}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={OUTER_CIRCLE_R}
                  fill={getNoteColor(note)}
                  stroke={isSelected ? "white" : "none"}
                  strokeWidth={isSelected ? 2.5 : 0}
                  filter={isSelected ? "url(#glow)" : undefined}
                />
                <text
                  x={x}
                  y={label ? y - 3 : y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="16"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {note}
                </text>
                {label && (
                  <text
                    x={x}
                    y={y + 13}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="10"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Inner ring — minor keys */}
          {CIRCLE_MINOR.map((note, i) => {
            const { x, y } = pos(i, INNER_R);
            const opacity = getOpacity(i, false);
            const root = note.replace("m", "");
            const isSelected = isMinor && selectedKey === root;
            return (
              <g
                key={`min-${note}`}
                onClick={() => handleMinorClick(note)}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                opacity={opacity}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={INNER_CIRCLE_R}
                  fill={getNoteColor(root)}
                  fillOpacity={0.25}
                  stroke={isSelected ? "white" : getNoteColor(root)}
                  strokeWidth={isSelected ? 2.5 : 1}
                  strokeOpacity={isSelected ? 1 : 0.5}
                  filter={isSelected ? "url(#glow)" : undefined}
                />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={getNoteColor(root)}
                  fontSize="13"
                  fontWeight="500"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {note}
                </text>
              </g>
            );
          })}

          {/* Center text */}
          {selectedKey !== null ? (
            <text
              x={CX}
              y={CY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="22"
              fontWeight="700"
              fontFamily="'JetBrains Mono', monospace"
            >
              {displayKey}
            </text>
          ) : (
            <text
              x={CX}
              y={CY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#555"
              fontSize="13"
              fontWeight="500"
            >
              Click a key
            </text>
          )}

          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Detail panel */}
      {selectedKey !== null && displayKey && (
        <div className="border-t border-border px-2 pt-4 pb-2">
          {/* Header */}
          <div className="mb-3 flex items-baseline gap-2">
            <span
              className="font-mono text-lg font-bold"
              style={{ color: getNoteColor(selectedKey) }}
            >
              {displayKey}
            </span>
            <span className="text-xs text-subtle">{accidentalSummary()}</span>
          </div>

          {/* Scale notes */}
          <div className="mb-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Scale
            </div>
            <div className="flex gap-2">
              {scaleNotes.map((n, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <NoteCircle note={n} size={28} />
                  <span className="text-[9px] text-subtle">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diatonic chords */}
          <div className="mb-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Diatonic Chords
            </div>
            <div className="flex gap-2">
              {chords.map((chord, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] text-subtle">{numerals[i]}</span>
                  <div
                    className="flex h-7 items-center justify-center rounded px-1.5 font-mono text-[11px] font-semibold"
                    style={{
                      backgroundColor: getNoteColor(chord) + "22",
                      color: getNoteColor(chord),
                    }}
                  >
                    {chord}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related keys */}
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Related Keys
            </div>
            <div className="flex flex-wrap gap-1.5">
              {relativeLabel && (
                <button
                  onClick={() => navigateTo(relativeLabel)}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] font-medium text-text-dim transition-colors hover:border-subtle hover:text-text"
                >
                  {isMinor ? "Relative Major: " : "Relative Minor: "}
                  {relativeLabel}
                </button>
              )}
              {neighborKeys.map((nk) => (
                <button
                  key={nk}
                  onClick={() => navigateTo(nk)}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] font-medium text-text-dim transition-colors hover:border-subtle hover:text-text"
                >
                  {nk}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
