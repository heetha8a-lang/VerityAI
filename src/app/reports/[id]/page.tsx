"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Copy, Download, FileWarning } from "lucide-react";
import { toast } from "sonner";
import { WorkspaceShell } from "@/src/components/layout/WorkspaceShell";
import { AssessmentBadge } from "@/src/components/shared/AssessmentBadge";
import { ConfidenceRangeBar } from "@/src/components/shared/ConfidenceRangeBar";
import { ImageWithFallback } from "@/src/components/shared/ImageWithFallback";
import { PrototypeNotice } from "@/src/components/shared/PrototypeNotice";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useInvestigations } from "@/src/context/InvestigationContext";
import { downloadInvestigationPdf } from "@/src/lib/pdfExport";
import { cn, formatBytes, formatDateTime } from "@/src/lib/utils";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { getById } = useInvestigations();
  const investigation = id ? getById(id) : undefined;

  if (!investigation) {
    return (
      <WorkspaceShell
        breadcrumb="Report Not Found"
        title="Investigation Report Unavailable"
        subtitle="The requested investigation ID could not be located in the current session."
      >
        <Card>
          <CardContent className="py-16 px-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FileWarning className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Verify the investigation ID or return to Investigation History to browse archived
              analyses.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/history">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back to Investigation History</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell
      breadcrumb={`Reports / ${investigation.id}`}
      title={investigation.title}
      subtitle={`Investigation ${investigation.id} · ${investigation.type.toUpperCase()} Verification · ${formatDateTime(investigation.createdAt)}`}
      primaryAction={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href);
              toast.success("Report link copied to clipboard.");
            }}
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Copy Link</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              downloadInvestigationPdf(investigation);
              toast.success(`Downloaded ${investigation.id}-VerityAI-Report.pdf`);
            }}
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download PDF</span>
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/history">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to History</span>
          </Link>
        </Button>
      </div>

      <PrototypeNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="font-mono text-xs text-slate-500">
                ID: {investigation.id} · {formatDateTime(investigation.createdAt)}
              </div>
              <CardTitle className="text-lg">Overall Assessment & Reasoning</CardTitle>
            </div>
            <AssessmentBadge assessment={investigation.overallAssessment} />
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <ConfidenceRangeBar confidence={investigation.confidence} />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{investigation.summary}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">Detailed Explanation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{investigation.explanation}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">Submitted Content</CardTitle>
            <CardDescription>Original input inspected for this investigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {investigation.imagePayload && (
              <>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
                  <ImageWithFallback
                    src={investigation.imagePayload.previewUrl}
                    alt={investigation.title}
                    className="max-h-56 w-full object-contain mx-auto"
                  />
                </div>
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">File</dt>
                    <dd className="font-mono text-slate-900 truncate">
                      {investigation.imagePayload.metadata.fileName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Dimensions / Size</dt>
                    <dd className="font-mono text-slate-900 tabular-nums">
                      {investigation.imagePayload.metadata.dimensions} ·{" "}
                      {formatBytes(investigation.imagePayload.metadata.fileSizeBytes)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">SHA-256</dt>
                    <dd className="font-mono text-[11px] text-slate-800 break-all mt-0.5">
                      {investigation.imagePayload.metadata.sha256}
                    </dd>
                  </div>
                </dl>
              </>
            )}

            {investigation.newsPayload && (
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 leading-relaxed">
                  {investigation.newsPayload.submittedClaim}
                </div>
                {investigation.newsPayload.submittedUrl && (
                  <div className="text-xs font-mono text-indigo-700 break-all">
                    Submitted URL: {investigation.newsPayload.submittedUrl}
                  </div>
                )}
              </div>
            )}

            {investigation.documentPayload && (
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Document</dt>
                  <dd className="font-mono text-slate-900 truncate">
                    {investigation.documentPayload.metadata.fileName}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Pages / Size</dt>
                  <dd className="font-mono text-slate-900 tabular-nums">
                    {investigation.documentPayload.metadata.pageCount} pages ·{" "}
                    {formatBytes(investigation.documentPayload.metadata.fileSizeBytes)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Producer</dt>
                  <dd className="font-mono text-slate-900">
                    {investigation.documentPayload.metadata.producer}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">SHA-256</dt>
                  <dd className="font-mono text-[11px] text-slate-800 break-all mt-0.5">
                    {investigation.documentPayload.metadata.sha256}
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evidence Table</CardTitle>
          <CardDescription>
            Structured observations weighed during this investigation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Finding</TableHead>
                <TableHead>Polarity</TableHead>
                <TableHead>Module / Source</TableHead>
                <TableHead>Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investigation.evidenceTable.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-slate-900 whitespace-nowrap">
                    {row.category}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 leading-relaxed max-w-lg">
                    {row.finding}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span
                      className={cn(
                        "text-xs font-medium capitalize",
                        row.polarity === "supporting"
                          ? "text-emerald-700"
                          : row.polarity === "contradicting"
                            ? "text-red-700"
                            : "text-slate-600"
                      )}
                    >
                      {row.polarity}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600 whitespace-nowrap">
                    {row.sourceOrModule}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-700 whitespace-nowrap">
                    {row.weight}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Model & Signal Findings</CardTitle>
            <CardDescription>
              Individual analytical passes contributing to the overall interval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {investigation.modelFindings.map((model) => (
              <div
                key={model.modelName}
                className="rounded-lg border border-slate-200 p-4 space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{model.modelName}</span>
                  <span className="font-mono text-xs text-indigo-700">{model.scoreRange}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {model.modality} · {model.signalLabel}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{model.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Limitations & Uncertainty</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                {investigation.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Source References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {investigation.sourceReferences.length === 0 ? (
                <p className="text-xs text-slate-500 leading-relaxed">
                  No external web citations attached to this binary/document inspection.
                </p>
              ) : (
                investigation.sourceReferences.map((ref) => (
                  <div
                    key={ref.id}
                    className="border-b border-slate-100 last:border-0 pb-3 last:pb-0 space-y-1"
                  >
                    <div className="text-xs font-semibold text-slate-900">{ref.sourceName}</div>
                    <div className="text-xs text-slate-700">{ref.title}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {ref.publicationDate} · {ref.stance}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ref.excerpt}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  );
}
