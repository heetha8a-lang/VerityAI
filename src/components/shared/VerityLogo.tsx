import { cn } from "@/src/lib/utils";

interface VerityLogoProps {
  className?: string;
  inverted?: boolean;
}

export function VerityLogo({ className, inverted = false }: VerityLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 whitespace-nowrap shrink-0", className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          className={inverted ? "fill-indigo-500" : "fill-slate-900"}
        />
        <path
          d="M7.5 12.2L10.6 15.2L16.8 8.8"
          stroke="white"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight whitespace-nowrap shrink-0",
          inverted ? "text-white" : "text-slate-900"
        )}
      >
        VerityAI
      </span>
    </span>
  );
}
