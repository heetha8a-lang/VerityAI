import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { OverallAssessment } from "@/src/types/investigation";

interface AssessmentBadgeProps {
  assessment: OverallAssessment;
  className?: string;
}

export function AssessmentBadge({ assessment, className }: AssessmentBadgeProps) {
  const getConfig = (label: OverallAssessment) => {
    switch (label) {
      case "Supported":
      case "No Strong Manipulation Signals":
      case "Consistent Metadata & Claims":
        return {
          icon: CheckCircle2,
          styles: "border-emerald-200 bg-emerald-50/70 text-emerald-800",
        };
      case "Contradicted":
      case "Elevated Manipulation Indicators":
      case "Elevated Synthetic Generation Indicators":
      case "Inconsistencies Detected":
        return {
          icon: XCircle,
          styles: "border-red-200 bg-red-50/70 text-red-800",
        };
      case "Misleading":
      case "Inconclusive / Mixed Signals":
      case "Requires Cross-Verification":
        return {
          icon: AlertTriangle,
          styles: "border-amber-200 bg-amber-50/70 text-amber-900",
        };
      case "Unverified":
      default:
        return {
          icon: HelpCircle,
          styles: "border-slate-200 bg-slate-100 text-slate-700",
        };
    }
  };

  const { icon: Icon, styles } = getConfig(assessment);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0",
        styles,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{assessment}</span>
    </span>
  );
}
