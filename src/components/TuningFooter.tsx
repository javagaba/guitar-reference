import { useAppContext } from "../context/AppContext";

export function TuningFooter() {
  const { selectedTuning } = useAppContext();
  const notesDisplay = [...selectedTuning.notes].reverse().join("");

  return (
    <div className="mt-8 text-center text-[11px] text-[#444]">
      {selectedTuning.name} Tuning ({notesDisplay})
    </div>
  );
}
