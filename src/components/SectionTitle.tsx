export function SectionTitle({
  children,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  as?: "h2" | "h3" | "h4";
}) {
  return (
    <Tag className="mb-2 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-subtle">
      {children}
    </Tag>
  );
}
