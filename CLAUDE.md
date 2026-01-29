# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check (`tsc -b`) + Vite production build
- `npm run preview` — Preview production build
- No test framework is configured

## Architecture

React 19 + TypeScript + Tailwind CSS 4 + Vite 6. Single-page guitar theory reference app with interactive visualizations.

### State Management

`AppContext` (src/context/AppContext.tsx) holds all shared state: `selectedKey`, `isMinor`, `selectedScale`, `selectedChord`, and derived `scaleNotes`. Changing key auto-switches scale between Major/Natural Minor. All interactive components read/write through `useAppContext()`.

### Music Theory Engine

`src/music.ts` is a pure-function module with no React dependencies. It owns all music constants (chromatic notes, tuning, intervals, chord qualities) and exports helpers like `noteIndex()`, `isNoteInScale()`, `getNoteColor()`, `getScaleNotes()`, `getDiatonicChords()`. All note spelling (sharp vs flat) is determined by the `FLAT_KEYS` set.

`src/chordVoicings.ts` stores fingering data and generates barre chord transpositions via E-form and A-form templates.

### Component Patterns

- **Base components** (Card, SectionTitle, NoteCircle) are context-free and reusable
- **Feature components** (Fretboard, CircleOfFifths, KeyChordsTable, ScaleSelector, ChordDisplay) consume `useAppContext()`
- CircleOfFifths and ChordDiagram render as SVG; Fretboard uses HTML divs with NoteCircle components
- NoteCircle accepts `dimmed`, `isRoot`, `onClick` props — outer div is fixed-size to prevent layout shift

### Styling

Dark theme defined via Tailwind 4 `@theme` in `src/index.css`. Each natural note (C–B) has a CSS variable (`--color-note-c` through `--color-note-b`). Dynamic colors are applied via inline styles using `getNoteColor()`. Fonts: Inter (sans), JetBrains Mono (mono).
