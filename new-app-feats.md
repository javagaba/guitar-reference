# Guitar Reference App: Interactive Features Plan

## Goal
Make all sections interactive and connected: fretboard highlights scales, Circle of Fifths drives fretboard, chord tables show voicings, and a new scale/mode selector ties it all together.

## New Files (5)
- `src/context/AppContext.tsx` — shared state (selected key, scale, chord)
- `src/chordVoicings.ts` — chord fingering data + lookup function
- `src/components/ScaleSelector.tsx` — key + scale type dropdowns
- `src/components/ChordDiagram.tsx` — SVG chord box (mini fretboard)
- `src/components/ChordDisplay.tsx` — container rendering chord diagrams when a chord is selected

## Modified Files (7)
- `src/types.ts` — add `ScaleDefinition` and `ChordVoicing` interfaces
- `src/music.ts` — add `SCALE_DEFINITIONS` (major, minor, pentatonic major/minor, blues major/minor, 7 modes), export `noteIndex`, add `isNoteInScale` helper
- `src/App.tsx` — wrap in `<AppProvider>`, add ScaleSelector + ChordDisplay to layout
- `src/components/NoteCircle.tsx` — add `dimmed`, `isRoot`, `onClick` props
- `src/components/Fretboard.tsx` — read context, highlight scale notes, dim others, emphasize root
- `src/components/CircleOfFifths.tsx` — replace local state with context, make diatonic chord chips clickable
- `src/components/KeyChordsTable.tsx` — make chord cells and key rows clickable, highlight selected

## Implementation Order

### Step 1: Types & Data
- Add `ScaleDefinition` and `ChordVoicing` to `types.ts`
- Add `SCALE_DEFINITIONS` to `music.ts` with all 13 scales:
  - Diatonic: Major `[0,2,4,5,7,9,11]`, Natural Minor `[0,2,3,5,7,8,10]`
  - Pentatonic: Major `[0,2,4,7,9]`, Minor `[0,3,5,7,10]`
  - Blues: Major `[0,2,3,4,7,9]`, Minor `[0,3,5,6,7,10]`
  - Modes: Ionian, Dorian `[0,2,3,5,7,9,10]`, Phrygian `[0,1,3,5,7,8,10]`, Lydian `[0,2,4,6,7,9,11]`, Mixolydian `[0,2,4,5,7,9,10]`, Aeolian, Locrian `[0,1,3,5,6,8,10]`
- Export `noteIndex` from `music.ts`, add `isNoteInScale(note, scaleNotes)` using enharmonic comparison

### Step 2: Shared State
- Create `AppContext.tsx` with:
  - State: `selectedKey`, `isMinor`, `selectedScale` (default "major"), `selectedChord`
  - Derived: `scaleNotes` via `useMemo`
  - Actions: `selectKey`, `selectScale`, `selectChord`
- Wrap app in `<AppProvider>` in `App.tsx`

### Step 3: NoteCircle Update
- Add optional `dimmed` prop (opacity 0.15), `isRoot` prop (white ring + slightly larger), `onClick` prop
- Existing callers unaffected (all optional with backward-compatible defaults)

### Step 4: ScaleSelector Component
- Two dropdowns: Key (12 chromatic notes) + Scale (grouped by category via `<optgroup>`)
- Clear button to reset selection
- Reads/writes via `useAppContext()`

### Step 5: Interactive Fretboard
- Read `scaleNotes` and `rootNote` from context
- For each note on the fretboard: compare against scale set by semitone index
  - Root note: `isRoot=true` on NoteCircle
  - In scale: normal display
  - Not in scale: `dimmed=true` (when a key is selected)
  - No key selected: show all notes normally (current behavior)

### Step 6: Circle of Fifths Migration
- Remove local `useState` for `selectedKey` and `isMinor`
- Read/write via `useAppContext()` — `selectKey(key, minor)`
- Make diatonic chord chips in detail panel clickable → `selectChord(chordName)`
- Highlight the currently selected chord

### Step 7: KeyChordsTable Interactivity
- Each chord cell becomes clickable → `selectChord(chord)`
- Each key row becomes clickable → `selectKey(key, isMinor)`
- Highlight selected chord with colored border, highlight selected key row

### Step 8: Chord Voicing Data
- Create `chordVoicings.ts` with ~30-40 voicings:
  - Open major: C, D, E, F, G, A
  - Open minor: Dm, Em, Am + a few barre minors
  - Barre templates: E-form and A-form (major + minor)
  - Seventh chords: A7, B7, C7, D7, E7, G7, Am7, Dm7, Em7
  - Sus chords: Asus2, Asus4, Dsus2, Dsus4
  - Power chords: E5, A5 shapes
- `getChordVoicings(chordName)` function that matches by root + type, transposes barre shapes

### Step 9: Chord Diagram & Display
- `ChordDiagram.tsx`: SVG mini fretboard (6 strings, 4-5 frets)
  - Circles for finger positions, X for muted, O for open
  - Barre indicator, finger numbers, base fret label
- `ChordDisplay.tsx`: reads `selectedChord` from context, renders Card with chord name + one or more ChordDiagram components in horizontal scroll
- Add ChordDisplay to App.tsx layout (conditionally rendered)

### Step 10: Layout Finalization
- Adjust `App.tsx` grid: ScaleSelector + Fretboard at top, ChordDisplay below (conditional), reference cards grid, Circle of Fifths

## Architecture Decision: React Context
Single context (not multiple) because key/scale/chord are tightly coupled — changing key should be able to clear chord selection. No external state library needed for this scale.

## Verification
1. Run `npm run dev` and open in browser
2. Select a key + scale from ScaleSelector → fretboard highlights matching notes, root emphasized
3. Click a key on Circle of Fifths → fretboard updates, ScaleSelector reflects selection
4. Click a chord in Circle of Fifths detail panel → ChordDisplay shows voicing diagram
5. Click a chord in KeyChordsTable → same behavior
6. Click Clear → all sections reset to default (show everything)
7. Test all 13 scale types render correct notes on fretboard
8. Verify no key selected = fretboard shows all notes (backward compatible)
9. Run `npm run build` to ensure no TypeScript errors
