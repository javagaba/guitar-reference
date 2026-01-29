import { ChordDisplay } from "../components/ChordDisplay";
import { ChordFormulas } from "../components/ChordFormulas";
import { CircleOfFifths } from "../components/CircleOfFifths";
import { Fretboard } from "../components/Fretboard";

export function HomePage() {
  return (
    <>
      <Fretboard />
      <ChordDisplay />

      <div className="mx-auto mt-6 grid max-w-300 grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <CircleOfFifths />
        <ChordFormulas />
      </div>
    </>
  );
}
