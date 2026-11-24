"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackLabel,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-500 p-6 text-center",
          className
        )}
      >
        <ImageOff className="h-6 w-6 text-slate-400" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-600">
          {fallbackLabel || alt || "Image preview unavailable"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
