import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentPropsWithRef<"section"> & {
  elevated?: boolean;
};

export default function Card({
  className,
  elevated = false,
  ...props
}: CardProps) {
  return (
    <section
      className={cn(
        "glass-panel rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface-container-lowest)]",
        "glass-outline-hover",
        elevated && "border-2 bg-[var(--surface-container)]",
        className
      )}
      {...props}
    />
  );
}