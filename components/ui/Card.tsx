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
        "rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]",
        elevated && "bg-[var(--color-surface-high)]",
        className
      )}
      {...props}
    />
  );
}