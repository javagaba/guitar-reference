import { MAJOR_KEY_CHORDS, MINOR_KEY_CHORDS } from "./music";
import { ChordFormulas } from "./components/ChordFormulas";
import { KeyChordsTable } from "./components/KeyChordsTable";
import { Progressions } from "./components/Progressions";
import { Fretboard } from "./components/Fretboard";
import { CircleOfFifths } from "./components/CircleOfFifths";

export default function App() {
  return (
    <div className="min-h-screen bg-bg p-8 font-sans text-text">
      <div className="mb-8 text-center">
        <h1 className="text-[28px] font-bold tracking-tight text-white">
          Guitar Reference
        </h1>
        <p className="mt-2 text-[13px] text-muted">
          Chords &bull; Keys &bull; Fretboard
        </p>
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
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
        />
        <Progressions />
      </div>

      <Fretboard />
      <CircleOfFifths />

      <div className="mt-8 text-center text-[11px] text-[#444]">
        Standard Tuning (EADGBE)
      </div>
    </div>
  );
}
