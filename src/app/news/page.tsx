"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Newspaper,
  SearchCheck,
} from "lucide-react";
import { toast } from "sonner";
import { WorkspaceShell } from "@/src/components/layout/WorkspaceShell";
import { AssessmentBadge } from "@/src/components/shared/AssessmentBadge";
import { ConfidenceRangeBar } from "@/src/components/shared/ConfidenceRangeBar";
import { PrototypeNotice } from "@/src/components/shared/PrototypeNotice";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Progress } from "@/src/components/ui/progress";
import { Textarea } from "@/src/components/ui/textarea";
import { useInvestigations } from "@/src/context/InvestigationContext";
import { formatDateTime, isValidHttpUrl } from "@/src/lib/utils";
import { verityApiClient } from "@/src/services/apiClient";
import type { Investigation } from "@/src/types/investigation";

const SAMPLE_CLAIMS = [
  {
    label: "Misleading Metric",
    url: "",
    claim:
      "City grid authorities confirmed a 400% overnight surge in active battery storage output during Q3, eliminating peak fossil peaker usage.",
  },
  {
    label: "Absolutist Claim",
    url: "",
    claim:
      "A new clinical supplement provides a 100% cure for seasonal fatigue within 24 hours across all patient age groups.",
  },
  {
    label: "Unverified Rumor",
    url: "https://example.com/regional-transit-update",
    claim:
      "Unconfirmed regional notices indicate weekend commuter rail fares will be permanently waived starting next month.",
  },
];

export default function NewsAnalysisPage() {
  const { addInvestigation } = useInvestigations();
  const [articleUrl, setArticleUrl] = useState("");
  const [claimText, setClaimText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressStep, setProgressStep] = useState("");
  const [result, setResult] = useState<Investigation | null>(null);
  const [expandedClaimIds, setExpandedClaimIds] = useState<Record<string, boolean>>({});

  const toggleClaimExpanded = (id: string) => {
    setExpandedClaimIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedUrl = articleUrl.trim();
    const trimmedClaim = claimText.trim();

    if (!trimmedUrl && !trimmedClaim) {
      setFormError("Enter a news article URL, a written claim, or both before running verification.");
      return;
    }

    if (trimmedUrl && !isValidHttpUrl(trimmedUrl)) {
      setFormError("Please enter a valid http:// or https:// article URL.");
      return;
    }

    if (trimmedClaim && trimmedClaim.length < 12) {
      setFormError("Please enter a complete claim statement (at least 12 characters).");
      return;
    }

    setIsAnalyzing(true);
    setProgressValue(12);
    setProgressStep("Normalizing submitted text and URL");

    try {
      const investigation = await verityApiClient.analyzeNewsOrClaim(
        {
          url: trimmedUrl || undefined,
          claimText: trimmedClaim || `Evaluate article claims from ${trimmedUrl}`,
        },
        (stepLabel, percent) => {
          setProgressStep(stepLabel);
          setProgressValue(percent);
        }
      );

      setResult(investigation);
      addInvestigation(investigation);
      const initialExpanded: Record<string, boolean> = {};
      investigation.newsPayload?.extractedClaims.forEach((c) => {
        initialExpanded[c.id] = true;
      });
      setExpandedClaimIds(initialExpanded);
      toast.success(`Claim verification archived as ${investigation.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const newsPayload = result?.newsPayload;

  return (
    <WorkspaceShell
      breadcrumb="News & Claim Verification"
      title="News & Claim Intelligence"
      subtitle="Submit a news article URL or factual statement to decompose atomic claims, inspect supporting vs. contradicting evidence, and review calibrated labels."
    >
      <PrototypeNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Submit Article URL or Claim</CardTitle>
            <CardDescription>
              Supports four calibrated labels: Supported, Contradicted, Misleading, or Unverified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="article-url" className="text-xs font-medium text-slate-700">
                  News Article URL (Optional)
                </label>
                <Input
                  id="article-url"
                  type="url"
                  placeholder="https://publisher.example/article-headline"
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="claim-textarea" className="text-xs font-medium text-slate-700">
                  Claim or Statement Text
                </label>
                <Textarea
                  id="claim-textarea"
                  rows={5}
                  placeholder="Paste the specific claim, headline, or excerpt you want VerityAI to decompose and check..."
                  value={claimText}
                  onChange={(e) => setClaimText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-600">
                  Quick-load sample claims
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_CLAIMS.map((sample) => (
                    <Button
                      key={sample.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setArticleUrl(sample.url);
                        setClaimText(sample.claim);
                        setFormError(null);
                      }}
                    >
                      {sample.label}
                    </Button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

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

              <Button type="submit" className="w-full" disabled={isAnalyzing}>
                <SearchCheck className="h-4 w-4" aria-hidden="true" />
                <span>{isAnalyzing ? "Verifying Claim..." : "Verify Claim"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          {!result && !isAnalyzing && (
            <Card>
              <CardContent className="py-16 px-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Newspaper className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Ready for Claim Verification
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Enter an article URL or claim statement on the left. VerityAI will isolate
                  checkable assertions and separate supporting vs. contradicting evidence without
                  fabricating external sources.
                </p>
              </CardContent>
            </Card>
          )}

          {result && newsPayload && (
            <>
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-medium text-slate-700">{result.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>Analyzed {formatDateTime(result.createdAt)}</span>
                    </div>
                    <CardTitle className="text-xl">Verification Assessment</CardTitle>
                  </div>
                  <AssessmentBadge assessment={result.overallAssessment} />
                </CardHeader>

                <CardContent className="pt-6 space-y-5">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
                    <div className="text-xs font-medium text-slate-500">Original Submission</div>
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      {newsPayload.submittedClaim}
                    </p>
                    {newsPayload.submittedUrl && (
                      <div className="text-xs font-mono text-indigo-700 break-all pt-1">
                        URL: {newsPayload.submittedUrl}
                      </div>
                    )}
                  </div>

                  <ConfidenceRangeBar confidence={result.confidence} />

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Explanation & Limitations
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
                    <ul className="space-y-1 text-xs text-slate-500 list-disc pl-4 pt-1">
                      {result.limitations.map((lim, i) => (
                        <li key={i}>{lim}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Button asChild size="sm">
                      <Link href={`/reports/${result.id}`}>
                        <span>Open Full Evidence Report</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Extracted Claims & Evidence Comparison
                  </CardTitle>
                  <CardDescription>
                    Expand each extracted claim to compare supporting and contradicting points
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {newsPayload.extractedClaims.map((claim) => {
                    const isOpen = Boolean(expandedClaimIds[claim.id]);
                    return (
                      <div
                        key={claim.id}
                        className="rounded-lg border border-slate-200 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleClaimExpanded(claim.id)}
                          className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="space-y-2">
                            <AssessmentBadge assessment={claim.assessment} />
                            <p className="text-sm font-medium text-slate-900 leading-snug">
                              {claim.claimText}
                            </p>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-slate-500 shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 mt-1" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-4">
                            <p className="text-xs text-slate-700 leading-relaxed">
                              <span className="font-semibold text-slate-900">Rationale: </span>
                              {claim.rationale}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <div className="text-xs font-semibold text-emerald-800">
                                  Supporting Evidence
                                </div>
                                {claim.supportingEvidence.length > 0 ? (
                                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                                    {claim.supportingEvidence.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-slate-500 italic">
                                    No corroborating evidence identified in current pass.
                                  </p>
                                )}
                              </div>

                              <div className="space-y-1.5">
                                <div className="text-xs font-semibold text-red-800">
                                  Contradicting Evidence
                                </div>
                                {claim.contradictingEvidence.length > 0 ? (
                                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                                    {claim.contradictingEvidence.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-slate-500 italic">
                                    No direct contradictions identified in current pass.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Source References</CardTitle>
                  <CardDescription>
                    Attributed records and provenance boundary notices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.sourceReferences.map((ref) => (
                    <div
                      key={ref.id}
                      className="rounded-lg border border-slate-200 p-4 space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">{ref.sourceName}</span>
                        <span className="font-mono">{ref.publicationDate}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-800">{ref.title}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{ref.excerpt}</p>
                      <div className="text-xs font-mono text-indigo-700 break-all">
                        Reference: {ref.url}
                      </div>
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
