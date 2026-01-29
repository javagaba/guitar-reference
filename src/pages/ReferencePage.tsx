import { ChordDisplay } from "../components/ChordDisplay";
import { KeyChordsTable } from "../components/KeyChordsTable";
import { Progressions } from "../components/Progressions";
import { SecondaryAndBorrowed } from "../components/SecondaryAndBorrowed";
import { MAJOR_KEY_CHORDS, MINOR_KEY_CHORDS } from "../music";

export function ReferencePage() {
  return (
    <>
      <ChordDisplay />
      <div className="mx-auto mt-6 grid max-w-300 grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
      <KeyChordsTable
        title="Key Chords"
        sections={[
          {
            subtitle: "Major",
            numerals: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
            rows: MAJOR_KEY_CHORDS,
          },
          {
            subtitle: "Minor",
            numerals: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
            rows: MINOR_KEY_CHORDS,
            isMinorTable: true,
          },
        ]}
      />
      <Progressions />
      <SecondaryAndBorrowed />
    </div>
    </>
  );
}
