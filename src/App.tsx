import { ChordDisplay } from "./components/ChordDisplay";
import { ChordFormulas } from "./components/ChordFormulas";
import { CircleOfFifths } from "./components/CircleOfFifths";
import { Fretboard } from "./components/Fretboard";
import { KeyChordsTable } from "./components/KeyChordsTable";
import { Progressions } from "./components/Progressions";
import { ScaleSelector } from "./components/ScaleSelector";
import { AppProvider } from "./context/AppContext";
import { MAJOR_KEY_CHORDS, MINOR_KEY_CHORDS } from "./music";

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-bg p-8 font-sans text-text">
        <ScaleSelector />
        <Fretboard />
        <ChordDisplay />

        <div className="mx-auto mt-6 grid max-w-300 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          <ChordFormulas />
          <KeyChordsTable
            title="Major Key Chords"
            numerals={["I", "ii", "iii", "IV", "V", "vi", "vii°"]}
            rows={MAJOR_KEY_CHORDS}
          />
          <KeyChordsTable
            title="Minor Key Chords"
            numerals={["i", "ii°", "III", "iv", "v", "VI", "VII"]}
            rows={MINOR_KEY_CHORDS}
            isMinorTable
          />
          <Progressions />
        </div>

        <CircleOfFifths />

        <div className="mt-8 text-center text-[11px] text-[#444]">
          Standard Tuning (EADGBE)
        </div>
      </div>
    </AppProvider>
  );
}
