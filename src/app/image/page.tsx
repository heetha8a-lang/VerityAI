"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Download,
  ExternalLink,
  FileImage,
  Loader2,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { WorkspaceShell } from "@/src/components/layout/WorkspaceShell";
import { AssessmentBadge } from "@/src/components/shared/AssessmentBadge";
import { ConfidenceRangeBar } from "@/src/components/shared/ConfidenceRangeBar";
import { ImageWithFallback } from "@/src/components/shared/ImageWithFallback";
import { PrototypeNotice } from "@/src/components/shared/PrototypeNotice";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { useInvestigations } from "@/src/context/InvestigationContext";
import { downloadInvestigationPdf } from "@/src/lib/pdfExport";
import { cn, computeSha256Hex, formatBytes, formatDateTime } from "@/src/lib/utils";
import {
  SAMPLE_IMAGE_GLASS_PAVILION,
  SAMPLE_IMAGE_URBAN_RAIN,
} from "@/src/mocks/investigations";
import { verityApiClient } from "@/src/services/apiClient";
import type { Investigation } from "@/src/types/investigation";

interface SelectedImageState {
  file: File;
  previewUrl: string;
  dimensions: string;
  sha256: string;
  sampleKey?: "urban_rain" | "glass_pavilion";
}

export default function ImageAnalysisPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addInvestigation } = useInvestigations();

  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<SelectedImageState | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressStep, setProgressStep] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Investigation | null>(null);

  const readImageDimensions = (src: string): Promise<string> =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(`${img.naturalWidth} × ${img.naturalHeight} px`);
      img.onerror = () => resolve("Dimensions unavailable");
      img.src = src;
    });

  const handleFileSelected = async (
    file: File,
    sampleKey?: "urban_rain" | "glass_pavilion",
    overridePreview?: string
  ) => {
    setErrorMessage(null);
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Unsupported file type. Please select a PNG, JPEG, or WebP image.");
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage("File exceeds the 20 MB browser preview limit.");
      toast.error("Image file is larger than 20 MB.");
      return;
    }

    const previewUrl = overridePreview || URL.createObjectURL(file);
    const [dimensions, sha256] = await Promise.all([
      readImageDimensions(previewUrl),
      computeSha256Hex(file),
    ]);

    setSelected({
      file,
      previewUrl,
      dimensions,
      sha256,
      sampleKey,
    });
    setResult(null);
  };

  const loadSampleImage = async (key: "urban_rain" | "glass_pavilion") => {
    const src = key === "urban_rain" ? SAMPLE_IMAGE_URBAN_RAIN : SAMPLE_IMAGE_GLASS_PAVILION;
    const filename =
      key === "urban_rain"
        ? "transit_plaza_rain_sample.jpg"
        : "glass_pavilion_twilight_sample.jpg";

    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
      await handleFileSelected(file, key, src);
      toast.info(`Loaded sample asset: ${filename}`);
    } catch {
      toast.error("Could not load sample image asset.");
    }
  };

  const handleAnalyze = async () => {
    if (!selected) return;
    setIsAnalyzing(true);
    setProgressValue(10);
    setProgressStep("Preparing image payload");
    setErrorMessage(null);

    try {
      const investigation = await verityApiClient.analyzeImage(
        {
          file: selected.file,
          dimensions: selected.dimensions,
          sha256: selected.sha256,
          previewUrl: selected.previewUrl,
          sampleKey: selected.sampleKey,
        },
        (stepLabel, percent) => {
          setProgressStep(stepLabel);
          setProgressValue(percent);
        }
      );
      setResult(investigation);
      addInvestigation(investigation);
      toast.success(`Image analysis archived as ${investigation.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed unexpectedly.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const payload = result?.imagePayload;

  return (
    <WorkspaceShell
      breadcrumb="Image Intelligence"
      title="Image Authenticity Analysis"
      subtitle="Upload an image or load a sample case to inspect container metadata, manipulation cues, visual consistency, and synthetic generation indicators."
    >
      <PrototypeNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Submit Visual Media</CardTitle>
            <CardDescription>
              Supports JPEG, PNG, and WebP up to 20 MB. SHA-256 checksums are computed locally.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const dropped = e.dataTransfer.files?.[0];
                if (dropped) void handleFileSelected(dropped);
              }}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-indigo-600 bg-indigo-50/50"
                  : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFileSelected(file);
                }}
              />
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 mb-3">
                <Upload className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                Drop an image here or browse files
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, WebP · Routed via Next.js prototype API
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-600">
                Quick-load forensic samples
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void loadSampleImage("urban_rain")}
                >
                  Sample 1: Urban Rain Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void loadSampleImage("glass_pavilion")}
                >
                  Sample 2: Glass Pavilion
                </Button>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            {selected && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
                  <ImageWithFallback
                    src={selected.previewUrl}
                    alt={`Preview of ${selected.file.name}`}
                    className="max-h-64 w-full object-contain mx-auto"
                  />
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <dt className="text-slate-500">File Name</dt>
                    <dd className="font-medium text-slate-900 truncate" title={selected.file.name}>
                      {selected.file.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Format & Size</dt>
                    <dd className="font-mono text-slate-900 tabular-nums">
                      {selected.file.type || "image"} · {formatBytes(selected.file.size)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Dimensions</dt>
                    <dd className="font-mono text-slate-900 tabular-nums">{selected.dimensions}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">SHA-256 Prefix</dt>
                    <dd className="font-mono text-slate-900 truncate" title={selected.sha256}>
                      {selected.sha256.slice(0, 14)}…
                    </dd>
                  </div>
                </dl>

                {isAnalyzing && (
                  <div className="space-y-2 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-indigo-950 flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                        <span>{progressStep}</span>
                      </span>
                      <span className="font-mono font-semibold text-indigo-700 tabular-nums">
                        {progressValue}%
                      </span>
                    </div>
                    <Progress value={progressValue} />
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full"
                  disabled={isAnalyzing}
                  onClick={() => void handleAnalyze()}
                >
                  {isAnalyzing ? "Running Multi-Signal Inspection..." : "Analyze Image"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          {!result && !isAnalyzing && (
            <Card>
              <CardContent className="py-16 px-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <FileImage className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  No Image Analysis Active
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Upload an image or load one of the two forensic samples on the left, then run
                  analysis to view metadata, residual checks, and uncertainty bounds.
                </p>
              </CardContent>
            </Card>
          )}

          {result && payload && (
            <>
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-medium text-slate-700">{result.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDateTime(result.createdAt)}</span>
                    </div>
                    <CardTitle className="text-xl">{result.title}</CardTitle>
                  </div>
                  <AssessmentBadge assessment={result.overallAssessment} />
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  <ConfidenceRangeBar
                    confidence={result.confidence}
                    label="Multi-Signal Alignment & Epistemic Uncertainty"
                  />

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Explanation of Findings
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                    <Button asChild size="sm">
                      <Link href={`/reports/${result.id}`}>
                        <span>Open Full Report</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        downloadInvestigationPdf(result);
                        toast.success("Downloaded PDF report.");
                      }}
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Possible Manipulation Indicators</CardTitle>
                    <CardDescription>
                      Compression, edge-splicing, and structural continuity signals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {payload.manipulationIndicators.map((item) => (
                      <div
                        key={item.indicator}
                        className="border-b border-slate-100 last:border-0 pb-3 last:pb-0 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {item.indicator}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              item.severity === "Elevated"
                                ? "text-red-700"
                                : item.severity === "Moderate"
                                  ? "text-amber-700"
                                  : "text-emerald-700"
                            )}
                          >
                            {item.severity} Signal
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.observation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">AI-Generated Content Indicators</CardTitle>
                    <CardDescription>
                      Texture, typography, and spectral cues (non-definitive)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {payload.aiGenerationIndicators.map((item) => (
                      <div
                        key={item.signal}
                        className="border-b border-slate-100 last:border-0 pb-3 last:pb-0 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-slate-900">{item.signal}</span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              item.level === "Elevated"
                                ? "text-red-700"
                                : item.level === "Moderate"
                                  ? "text-amber-700"
                                  : "text-emerald-700"
                            )}
                          >
                            {item.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.observation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Metadata & Provenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2.5 text-xs">
                      {[
                        ["EXIF Status", payload.metadata.exifStatus],
                        ["Camera / Software", payload.metadata.cameraOrSoftware],
                        ["C2PA Credentials", payload.metadata.c2paManifest],
                        ["Dimensions", payload.metadata.dimensions],
                        ["SHA-256 Digest", payload.metadata.sha256],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex flex-col gap-0.5 border-b border-slate-100 last:border-0 pb-2 last:pb-0"
                        >
                          <dt className="text-slate-500">{label}</dt>
                          <dd className="font-mono text-slate-900 break-all">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Visual Consistency & Limitations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-800">
                        Visual Geometry & Lighting
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                        {payload.visualConsistencyFindings.map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                        <span>Methodological Guardrails</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                        {result.limitations.map((lim, idx) => (
                          <li key={idx}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
