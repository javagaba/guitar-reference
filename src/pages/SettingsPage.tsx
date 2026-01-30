import { SelectNative } from "@/components/ui/select-native";
import { getInstrument, INSTRUMENTS, type InstrumentId } from "../instruments";
import { useAppStore } from "../stores/appStore";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";

const tuningCategories = ["Standard", "Drop", "Open", "Other"] as const;

export function SettingsPage() {
  const instrumentId = useAppStore((s) => s.instrumentId);
  const tuningName = useAppStore((s) => s.tuningName);
  const setInstrumentId = useAppStore((s) => s.setInstrumentId);
  const setTuningName = useAppStore((s) => s.setTuningName);

  const instrument = getInstrument(instrumentId);

  return (
    <div className="mx-auto mt-6 max-w-[600px]">
      <Card>
        <SectionTitle>Settings</SectionTitle>

        {/* Instrument */}
        <div className="mt-4">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-subtle">
            Instrument
          </label>
          <div className="flex gap-2">
            {INSTRUMENTS.map((inst) => {
              const active = inst.id === instrumentId;
              return (
                <button
                  key={inst.id}
                  onClick={() => setInstrumentId(inst.id as InstrumentId)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-white/30 bg-white/10 text-text"
                      : "border-border bg-transparent text-subtle hover:text-text hover:border-white/20"
                  }`}
                >
                  {inst.label}
                  <span className="ml-2 text-xs text-subtle">
                    {inst.stringCount} strings
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tuning */}
        <div className="mt-6">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-subtle">
            Tuning
          </label>
          <SelectNative
            value={tuningName}
            onChange={(e) => setTuningName(e.target.value)}
            aria-label="Select tuning"
            className="w-full font-mono"
          >
            {tuningCategories.map((cat) => {
              const tunings = instrument.tunings.filter((t) => t.category === cat);
              if (tunings.length === 0) return null;
              return (
                <optgroup key={cat} label={cat}>
                  {tunings.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({[...t.notes].reverse().join("")})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </SelectNative>
        </div>
      </Card>
    </div>
  );
}
