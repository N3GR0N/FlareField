import { ReactNode } from "react";

interface AlertChipProps {
  variant: "stable" | "elevated" | "active" | "critical";
  children: ReactNode;
}

export default function AlertChip({
  variant,
  children,
}: AlertChipProps) {
  // Map variant to color token
  const getVariantClass = () => {
    switch (variant) {
      case "stable":
        return "border-alert-green/20 bg-alert-green/5 text-alert-green";
      case "elevated":
        return "border-alert-yellow/20 bg-alert-yellow/5 text-alert-yellow";
      case "active":
        return "border-alert-orange/20 bg-alert-orange/5 text-alert-orange";
      case "critical":
        return "border-alert-red/20 bg-alert-red/5 text-alert-red";
      default:
        return "border-alert-green/20 bg-alert-green/5 text-alert-green";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 pt-0.5 pb-[2px] rounded-chip text-label font-label text-xs whitespace-nowrap ${getVariantClass()} `}>
      {children}
    </span>
  );
}