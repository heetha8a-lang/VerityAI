"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { WorkspaceShell } from "@/src/components/layout/WorkspaceShell";
import { AssessmentBadge } from "@/src/components/shared/AssessmentBadge";
import { ConfidenceRangeBar } from "@/src/components/shared/ConfidenceRangeBar";
import { PrototypeNotice } from "@/src/components/shared/PrototypeNotice";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { useInvestigations } from "@/src/context/InvestigationContext";
import { downloadInvestigationPdf } from "@/src/lib/pdfExport";
import { cn, computeSha256Hex, formatBytes, formatDateTime } from "@/src/lib/utils";
import { verityApiClient } from "@/src/services/apiClient";
import type { Investigation } from "@/src/types/investigation";

interface SelectedPdfState {
  file?: File;
  fileName: string;
  fileSizeBytes: number;
  sha256: string;
  previewUrl?: string;
  sampleKey?: "climate_brief";
}

export default function DocumentAnalysisPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addInvestigation } = useInvestigations();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdfState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressStep, setProgressStep] = useState("");
  const [result, setResult] = useState<Investigation | null>(null);

  const handlePdfSelected = async (file: File) => {
    setErrorMessage(null);
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Unsupported file format. Please upload a valid .pdf document.");
      toast.error("Please select a PDF document.");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage("PDF exceeds the 30 MB browser preview limit.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const sha256 = await computeSha256Hex(file);

    setSelectedPdf({
      file,
      fileName: file.name,
      fileSizeBytes: file.size,
      sha256,
      previewUrl,
    });
    setResult(null);
  };

  const loadSampleBrief = () => {
    setErrorMessage(null);
    setSelectedPdf({
      fileName: "2026_Regional_Transit_Sustainability_Brief.pdf",
      fileSizeBytes: 2418900,
      sha256: "9d2f41880a6b3e7c1180e249b5a0c19d77f2a801e4c9b22d84a701e93f60b112",
      sampleKey: "climate_brief",
    });
    setResult(null);
    toast.info("Loaded sample policy brief PDF metadata.");
  };

  const handleAnalyze = async () => {
    if (!selectedPdf) return;
    setIsAnalyzing(true);
    setProgressValue(14);
    setProgressStep("Reading PDF container & object tree");
    setErrorMessage(null);

    try {
      const investigation = await verityApiClient.analyzeDocument(
        {
          file: selectedPdf.file,
          sampleKey: selectedPdf.sampleKey,
          sha256: selectedPdf.sha256,
          previewUrl: selectedPdf.previewUrl,
          fileName: selectedPdf.fileName,
          fileSizeBytes: selectedPdf.fileSizeBytes,
        },
        (stepLabel, percent) => {
          setProgressStep(stepLabel);
          setProgressValue(percent);
        }
      );

      setResult(investigation);
      addInvestigation(investigation);
      toast.success(`Document analysis archived as ${investigation.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Document analysis failed.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const docPayload = result?.documentPayload;

  return (
    <WorkspaceShell
      breadcrumb="Document Intelligence"
      title="PDF Document Intelligence"
      subtitle="Upload a PDF document to preview structure, inspect container metadata, extract key claims, and export a verification report."
    >
      <PrototypeNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Submit PDF Document</CardTitle>
            <CardDescription>
              Supports standard and scanned PDFs up to 30 MB. SHA-256 checksums are computed locally.
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
                if (dropped) void handlePdfSelected(dropped);
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
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handlePdfSelected(file);
                }}
              />
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 mb-3">
                <Upload className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                Drop a PDF document here or browse files
              </p>
              <p className="text-xs text-slate-500 mt-1">PDF format · Local preview & hashing</p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-600">Quick-load sample document</div>
              <Button type="button" variant="outline" size="sm" onClick={loadSampleBrief}>
                Load Sample: 2026 Transit Sustainability Brief (PDF)
              </Button>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            {selectedPdf && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                {selectedPdf.previewUrl ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 h-64">
                    <iframe
                      src={selectedPdf.previewUrl}
                      title={`Preview of ${selectedPdf.fileName}`}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <FileText className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                      <span>Sample Brief Ready for Inspection</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      14-page regional transit infrastructure brief containing capital cost tables
                      and 2028 ridership projections.
                    </p>
                  </div>
                )}

                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <dt className="text-slate-500">Document</dt>
                    <dd className="font-medium text-slate-900 truncate" title={selectedPdf.fileName}>
                      {selectedPdf.fileName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Size</dt>
                    <dd className="font-mono text-slate-900 tabular-nums">
                      {formatBytes(selectedPdf.fileSizeBytes)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-slate-500">SHA-256 Fingerprint</dt>
                    <dd className="font-mono text-slate-900 truncate" title={selectedPdf.sha256}>
                      {selectedPdf.sha256}
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
                  {isAnalyzing ? "Analyzing Document..." : "Analyze Document"}
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
                  <FileText className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  No Document Analyzed Yet
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Upload a PDF file or load the sample sustainability brief on the left to inspect
                  metadata, extracted text, key claims, and cross-comparison findings.
                </p>
              </CardContent>
            </Card>
          )}

          {result && docPayload && (
            <>
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-medium text-slate-700">{result.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDateTime(result.createdAt)}</span>
                    </div>
                    <CardTitle className="text-xl break-all">{result.title}</CardTitle>
                  </div>
                  <AssessmentBadge assessment={result.overallAssessment} />
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  <ConfidenceRangeBar confidence={result.confidence} />

                  <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        downloadInvestigationPdf(result);
                        toast.success("Downloaded PDF verification report.");
                      }}
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Download Report (PDF)</span>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/reports/${result.id}`}>
                        <span>Open Full Report</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Document Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2.5 text-xs">
                      {[
                        ["Pages", `${docPayload.metadata.pageCount}`],
                        ["Author / Issuer", docPayload.metadata.author],
                        ["PDF Producer", docPayload.metadata.producer],
                        [
                          "Created / Modified",
                          `${docPayload.metadata.createdDate} / ${docPayload.metadata.modifiedDate}`,
                        ],
                        ["SHA-256 Digest", docPayload.metadata.sha256],
                      ].map(([label, val]) => (
                        <div
                          key={label}
                          className="flex flex-col gap-0.5 border-b border-slate-100 last:border-0 pb-2 last:pb-0"
                        >
                          <dt className="text-slate-500">{label}</dt>
                          <dd className="font-mono text-slate-900 break-all">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Comparison Findings</CardTitle>
                    <CardDescription>
                      Internal consistency and cross-reference checks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                      {docPayload.comparisonFindings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Extracted Text Preview</CardTitle>
                    <CardDescription>
                      Segmented text excerpt prepared for claim extraction
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(docPayload.extractedText);
                      toast.success("Extracted text copied to clipboard.");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy Text</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700 leading-relaxed max-h-60 overflow-y-auto">
                    {docPayload.extractedText}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Claims Extraction</CardTitle>
                  <CardDescription>
                    Assertions isolated from document pages with verification status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {docPayload.keyClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="rounded-lg border border-slate-200 p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                          Page {claim.pageNumber}
                        </span>
                        <AssessmentBadge assessment={claim.verificationStatus} />
                      </div>
                      <p className="text-sm font-medium text-slate-900">{claim.statement}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{claim.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
