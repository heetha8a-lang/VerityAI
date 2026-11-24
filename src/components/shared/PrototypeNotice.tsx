"use client";

import { Server } from "lucide-react";
import { verityApiClient } from "@/src/services/apiClient";

export function PrototypeNotice() {
  if (verityApiClient.isLiveBackendConnected()) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
      <Server className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="leading-relaxed">
        <strong className="font-semibold text-slate-800">Next.js Prototype API Mode:</strong>{" "}
        Submissions route through Next.js App Router API handlers (
        <code className="font-mono text-[11px] bg-slate-200/70 px-1 py-0.5 rounded">
          /api/investigations/*
        </code>
        ) using clearly labelled mock inference. Set{" "}
        <code className="font-mono text-[11px] bg-slate-200/70 px-1 py-0.5 rounded">
          NEXT_PUBLIC_FASTAPI_URL
        </code>{" "}
        to connect the Python FastAPI backend.
      </p>
    </div>
  );
}
