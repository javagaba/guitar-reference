import { useSelectedTuning } from "../stores/appStore";

export function TuningFooter() {
  const selectedTuning = useSelectedTuning();
  const notesDisplay = [...selectedTuning.notes].reverse().join("");

  return (
    <div className="mt-8 text-center text-[11px] text-[#444]">
      {selectedTuning.name} Tuning ({notesDisplay})
    </div>
  );
}
