import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLElement,
  { children: React.ReactNode; className?: string; as?: "div" | "section" }
>(function Card({ children, className = "", as: Tag = "div" }, ref) {
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`rounded-xl border border-border bg-card px-3 py-3 sm:px-4 sm:py-4 ${className}`}
    >
      {children}
    </Tag>
  );
});
