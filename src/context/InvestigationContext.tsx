"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { INITIAL_ACTIVITY_METRICS, INITIAL_MOCK_INVESTIGATIONS } from "@/src/mocks/investigations";
import type { ActivityMetricPoint, Investigation } from "@/src/types/investigation";

const STORAGE_KEY = "verityai_investigations_v1";

interface InvestigationContextValue {
  investigations: Investigation[];
  activityMetrics: ActivityMetricPoint[];
  addInvestigation: (item: Investigation) => void;
  getById: (id: string) => Investigation | undefined;
  resetDemoData: () => void;
}

const InvestigationContext = createContext<InvestigationContextValue | undefined>(undefined);

export function InvestigationProvider({ children }: { children: React.ReactNode }) {
  const [investigations, setInvestigations] = useState<Investigation[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Investigation[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial mock data
    }
    return INITIAL_MOCK_INVESTIGATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(investigations));
    } catch {
      // Ignore storage quota errors (e.g., large data URLs)
    }
  }, [investigations]);

  const addInvestigation = (item: Investigation) => {
    setInvestigations((prev) => [item, ...prev]);
  };

  const getById = (id: string) => investigations.find((inv) => inv.id === id);

  const resetDemoData = () => {
    setInvestigations(INITIAL_MOCK_INVESTIGATIONS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const activityMetrics = useMemo(() => {
    const addedImage = investigations.filter(
      (i) => i.type === "image" && !INITIAL_MOCK_INVESTIGATIONS.some((m) => m.id === i.id)
    ).length;
    const addedNews = investigations.filter(
      (i) => i.type === "news" && !INITIAL_MOCK_INVESTIGATIONS.some((m) => m.id === i.id)
    ).length;
    const addedDoc = investigations.filter(
      (i) => i.type === "document" && !INITIAL_MOCK_INVESTIGATIONS.some((m) => m.id === i.id)
    ).length;

    return INITIAL_ACTIVITY_METRICS.map((point, idx) => {
      if (idx !== INITIAL_ACTIVITY_METRICS.length - 1) return point;
      const image = point.image + addedImage;
      const news = point.news + addedNews;
      const document = point.document + addedDoc;
      return {
        ...point,
        image,
        news,
        document,
        total: image + news + document,
      };
    });
  }, [investigations]);

  return (
    <InvestigationContext.Provider
      value={{ investigations, activityMetrics, addInvestigation, getById, resetDemoData }}
    >
      {children}
    </InvestigationContext.Provider>
  );
}

export function useInvestigations() {
  const ctx = useContext(InvestigationContext);
  if (!ctx) {
    throw new Error("useInvestigations must be used within InvestigationProvider");
  }
  return ctx;
}
