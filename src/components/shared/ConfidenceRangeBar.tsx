import { Info } from "lucide-react";
import type { ConfidenceInterval } from "@/src/types/investigation";

interface ConfidenceRangeBarProps {
  confidence: ConfidenceInterval;
  label?: string;
}

export function ConfidenceRangeBar({
  confidence,
  label = "Signal Alignment & Uncertainty Range",
}: ConfidenceRangeBarProps) {
  const low = Math.max(0, Math.min(100, confidence.low));
  const high = Math.max(low, Math.min(100, confidence.high));
  const width = Math.max(4, high - low);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
          {low}% – {high}% range
        </span>
      </div>

      <div
        className="relative h-2.5 w-full overflow-hidden rounded-md bg-slate-100 border border-slate-200/80"
        role="img"
        aria-label={`Signal alignment interval from ${low}% to ${high}%`}
      >
        <div
          className="absolute inset-y-0 bg-indigo-200/60"
          style={{ left: "0%", width: `${low}%` }}
        />
        <div
          className="absolute inset-y-0 bg-indigo-600 rounded-xs"
          style={{ left: `${low}%`, width: `${width}%` }}
        />
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
        <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p>{confidence.uncertaintyNote}</p>
      </div>
    </div>
  );
}
