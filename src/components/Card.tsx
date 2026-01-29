import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(function Card({ children, className = "" }, ref) {
  return (
    <div
      ref={ref}
      className={`rounded-xl border border-border bg-card px-3 py-2 sm:px-4 ${className}`}
    >
      {children}
    </div>
  );
});
