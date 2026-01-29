export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card px-4 py-2 ${className}`}
    >
      {children}
    </div>
  );
}
