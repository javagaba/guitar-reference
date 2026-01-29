export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 border-b border-border pb-2 text-[11px] font-semibold uppercase tracking-widest text-subtle">
      {children}
    </div>
  );
}
