import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type DataTableColumn<T> = {
  key: keyof T;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  format?: (value: unknown) => ReactNode;
};

type DataTableProps<T> = ComponentPropsWithRef<"div"> & {
  data: T[];
  columns: DataTableColumn<T>[];
  striped?: boolean;
};

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  striped = true,
  className,
  ...props
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "glass-soft overflow-x-auto rounded-[var(--radius-card)]",
        className
      )}
      {...props}
    >
      <table className="w-full border-collapse [font-family:var(--font-mono)] text-xs">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-high)_72%,transparent)]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-4 py-2 text-left font-medium text-[var(--color-text-muted)] uppercase tracking-[0.05em]",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right"
                )}
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={cn(
                "border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-low)]",
                striped && idx % 2 === 1 && "bg-[color-mix(in_srgb,var(--color-surface-low)_76%,transparent)]"
              )}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-2",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right"
                  )}
                >
                  {col.format ? col.format(row[col.key]) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}