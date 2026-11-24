"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileText,
  Image as ImageIcon,
  Layers,
  Newspaper,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AssessmentBadge } from "@/src/components/shared/AssessmentBadge";
import { ImageWithFallback } from "@/src/components/shared/ImageWithFallback";
import { VerityLogo } from "@/src/components/shared/VerityLogo";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { HERO_STUDIO_IMAGE } from "@/src/mocks/investigations";
import { cn } from "@/src/lib/utils";

type PipelineTab = "image" | "news" | "document";

const PIPELINE_SCENARIOS: Record<
  PipelineTab,
  {
    label: string;
    route: string;
    sampleInput: string;
    assessment: "Inconclusive / Mixed Signals" | "Misleading" | "Requires Cross-Verification";
    confidence: string;
    steps: { title: string; detail: string }[];
    takeaway: string;
  }
> = {
  image: {
    label: "Image Authenticity",
    route: "/image",
    sampleInput: "transit_plaza_rain_sample.jpg (1408 × 1056 px)",
    assessment: "Inconclusive / Mixed Signals",
    confidence: "62% – 78% signal alignment · ±16% uncertainty",
    steps: [
      {
        title: "01. Container & Hash Audit",
        detail: "Computes SHA-256 digest and checks EXIF, XMP, and C2PA Content Credentials.",
      },
      {
        title: "02. Residual & Frequency Pass",
        detail: "Evaluates JPEG quantization grids and high-frequency spectral residuals.",
      },
      {
        title: "03. Geometry & Optics Check",
        detail: "Compares specular reflections and shadow vectors across scene surfaces.",
      },
    ],
    takeaway:
      "Never relies on one detector. Reports stripped metadata alongside consistent optical reflections so reviewers see both sides.",
  },
  news: {
    label: "News & Claim Verification",
    route: "/news",
    sampleInput: '"Municipal battery output surged 400% overnight in Q3."',
    assessment: "Misleading",
    confidence: "74% – 88% framing discrepancy · ±14% uncertainty",
    steps: [
      {
        title: "01. Atomic Claim Decomposition",
        detail: "Separates multi-clause headlines or URLs into isolated, checkable assertions.",
      },
      {
        title: "02. Supporting vs. Contradicting Retrieval",
        detail: "Surfaces both corroborating records and conflicting numeric denominators.",
      },
      {
        title: "03. Source-Attributed Verdict",
        detail: "Assigns Supported, Contradicted, Misleading, or Unverified without fabricating citations.",
      },
    ],
    takeaway:
      "Distinguishes 4x permitted multi-year pipeline figures from 38% active quarterly operational growth.",
  },
  document: {
    label: "Document Intelligence",
    route: "/document",
    sampleInput: "2026_Regional_Transit_Sustainability_Brief.pdf (14 pages)",
    assessment: "Requires Cross-Verification",
    confidence: "69% – 83% consistency range · ±14% uncertainty",
    steps: [
      {
        title: "01. Structure & Metadata Inspection",
        detail: "Checks producer software, export timestamps, and incremental PDF revision layers.",
      },
      {
        title: "02. Text & Table Extraction",
        detail: "Extracts narrative claims and reconciles totals against appendix ledgers.",
      },
      {
        title: "03. Forecast & Citation Flagging",
        detail: "Highlights unsourced projections separately from verified historical figures.",
      },
    ],
    takeaway:
      "Reconciles $142.4M capital totals across pages while flagging an ungrounded 2028 ridership forecast.",
  },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<PipelineTab>("image");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const activeScenario = PIPELINE_SCENARIOS[activeTab];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.includes("@") || contactMessage.trim().length < 8) {
      toast.error("Please enter a valid email address and a brief message.");
      return;
    }
    toast.success("Inquiry recorded. Thank you for contacting VerityAI.");
    setContactEmail("");
    setContactMessage("");
    setContactOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4">
          <Link href="/" className="whitespace-nowrap shrink-0">
            <VerityLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Features
            </a>
            <a
              href="#pipeline"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
            <a
              href="#why-verity"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Methodology
            </a>
            <Link
              href="/history"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              History
            </Link>
          </nav>

          <div className="flex items-center shrink-0">
            <Button asChild size="sm">
              <Link href="/dashboard">Open Workspace</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-950 text-white border-b border-slate-800">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <p className="text-xs sm:text-sm font-medium text-indigo-300 tracking-wide">
                  Verify Information. Understand Evidence. Build Trust.
                </p>

                <h1
                  className="font-display font-bold tracking-tight text-white leading-[1.1]"
                  style={{
                    fontSize: "clamp(2.25rem, 4vw, 3.65rem)",
                    textWrap: "balance",
                  }}
                >
                  Trust What You See. Verify What You Read.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  VerityAI inspects images, news URLs, written claims, and PDF documents using
                  multi-signal analysis—surfacing concrete evidence, metadata provenance, and
                  honest uncertainty bounds instead of opaque black-box scores.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      <span>Get Started</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:text-white"
                  >
                    <a href="#features">Explore Features</a>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/90 max-w-lg">
                  <div>
                    <div className="font-mono text-lg font-semibold text-white tabular-nums">
                      3 Modalities
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Image, News & PDF</div>
                  </div>
                  <div>
                    <div className="font-mono text-lg font-semibold text-white tabular-nums">
                      4 Labels
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Calibrated Verdicts</div>
                  </div>
                  <div>
                    <div className="font-mono text-lg font-semibold text-white tabular-nums">
                      SHA-256
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Client File Hashing</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex">
                <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 min-h-[320px] lg:min-h-[460px]">
                  <ImageWithFallback
                    src={HERO_STUDIO_IMAGE}
                    alt="Digital media verification analyst inspecting image residuals and document evidence on dual displays"
                    className="h-full w-full lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 space-y-2">
                    <div className="text-xs font-medium text-indigo-300">
                      Multi-Signal Verification Workbench
                    </div>
                    <p className="text-sm text-slate-100 max-w-md leading-relaxed">
                      Every investigation pairs automated structural checks with explicit
                      limitations and exportable PDF audit reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Pipeline Section */}
        <section id="pipeline" className="bg-slate-50 border-b border-slate-200 py-16 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-semibold tracking-wide text-indigo-600">
                  Interactive Verification Flow
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Inspect How VerityAI Evaluates Evidence
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Select a submission modality below to inspect the exact analytical stages and
                  explainable outputs produced for each investigation.
                </p>
              </div>

              <div
                className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1 self-start"
                role="tablist"
                aria-label="Verification modality preview"
              >
                {(["image", "news", "document"] as PipelineTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "rounded-md px-3.5 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer",
                      activeTab === tab
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {PIPELINE_SCENARIOS[tab].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-500">Submitted Artifact</div>
                  <div className="font-mono text-sm font-medium text-slate-900">
                    {activeScenario.sampleInput}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <AssessmentBadge assessment={activeScenario.assessment} />
                  <span className="font-mono text-xs text-slate-600 tabular-nums">
                    {activeScenario.confidence}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeScenario.steps.map((step) => (
                  <div key={step.title} className="space-y-2">
                    <h3 className="font-display text-sm font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
                  <span className="font-semibold text-slate-900">Key safeguard:</span>{" "}
                  {activeScenario.takeaway}
                </p>
                <Button asChild variant="navy" size="sm">
                  <Link href={activeScenario.route}>
                    <span>Try {activeScenario.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Four Feature Cards */}
        <section id="features" className="bg-white border-b border-slate-200 py-16 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-6 space-y-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-wide text-indigo-600">
                Platform Capabilities
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Four Verification Pillars Built for Public Clarity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <ImageIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    01. Image Authenticity Analysis
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                    Inspect EXIF and C2PA provenance metadata, surface compression inconsistencies,
                    evaluate lighting geometry, and screen for synthetic generation indicators
                    with calibrated uncertainty intervals—never a brittle binary guess.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <span>EXIF · Noise Residuals · Synthetic Screening</span>
                  <Link
                    href="/image"
                    className="font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <span>Open Image Tool</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Newspaper className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    02. News & Claim Verification
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Submit article URLs or direct statements. Claims are decomposed and labeled
                    Supported, Contradicted, Misleading, or Unverified with side-by-side evidence.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80">
                  <Link
                    href="/news"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <span>Verify a Claim</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    03. Document Intelligence
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Upload PDF reports or policy briefs to inspect container metadata, preview
                    extracted text, audit internal tables, and isolate checkable key claims.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80">
                  <Link
                    href="/document"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <span>Analyze a PDF</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    04. Explainable AI & Audit Reports
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                    Every assessment shows what signals agree, where models disagree, what
                    evidence supports or contradicts a claim, and where methodological limits
                    apply—exportable as a structured PDF report.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <span>Confidence Ranges · Limitations · PDF Export</span>
                  <Link
                    href="/reports/VTY-2026-1039"
                    className="font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <span>View Sample Report</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-slate-50 border-b border-slate-200 py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-6 space-y-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-wide text-indigo-600">How It Works</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                From Submission to Verifiable Evidence in Four Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  num: "01",
                  title: "Submit Content",
                  body: "Upload an image or PDF, paste an article URL, or enter a factual statement directly.",
                },
                {
                  num: "02",
                  title: "Extract & Fingerprint",
                  body: "Compute SHA-256 checksums, inspect container metadata, and segment claims into atomic units.",
                },
                {
                  num: "03",
                  title: "Corroborate Signals",
                  body: "Cross-check visual residuals, document consistency, and supporting or contradicting evidence.",
                },
                {
                  num: "04",
                  title: "Review & Export",
                  body: "Inspect confidence intervals, read explicit limitations, and export a formatted PDF report.",
                },
              ].map((step) => (
                <div key={step.num} className="space-y-2.5 border-t border-slate-200 pt-5">
                  <div className="font-mono text-xs font-semibold text-indigo-600">{step.num}</div>
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why VerityAI */}
        <section id="why-verity" className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-xs font-semibold tracking-wide text-indigo-600">Why VerityAI</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Designed Against Overconfidence and Opacity
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Automated detectors make mistakes when compressed photos, out-of-context quotes,
                  or synthetic renders collide. VerityAI prioritizes epistemic humility over flashy
                  single-number scores.
                </p>
                <div className="pt-2">
                  <Button asChild variant="navy">
                    <Link href="/dashboard">Launch Verification Dashboard</Link>
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: Scale,
                    title: "No Single-Model Absolutism",
                    desc: "Image results report calibrated probability ranges and explicitly avoid claiming definitive authenticity from one classifier.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Zero Fabricated Citations",
                    desc: "When external retrieval cannot corroborate a claim, VerityAI labels it Unverified instead of inventing source links.",
                  },
                  {
                    icon: Layers,
                    title: "FastAPI-Ready Architecture",
                    desc: "Next.js App Router API routes mirror future Python PyTorch, OpenCV, Hugging Face, and OCR endpoints cleanly.",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Complete Investigation Trail",
                    desc: "Every verification check is archived in Investigation History with searchable filters and downloadable PDF reports.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-slate-200 p-6 space-y-2.5"
                    >
                      <Icon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                      <h3 className="font-display text-base font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-[1280px] px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <VerityLogo />
            <p className="text-xs text-slate-500">
              Verify Information. Understand Evidence. Build Trust.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <a href="#why-verity" className="hover:text-slate-900">
              About
            </a>
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-slate-900 cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="hover:text-slate-900 cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy & Data Handling</DialogTitle>
            <DialogDescription>
              How VerityAI handles uploaded media, URLs, and investigation records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              In Next.js prototype mode, uploaded images and PDFs are hashed locally in your
              browser using WebCrypto SHA-256 and routed through local Next.js API prototype
              endpoints without transmitting files to external third-party services.
            </p>
            <p>
              Investigation history entries are stored only in your browser&apos;s localStorage and
              can be reset anytime from the Dashboard.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact VerityAI</DialogTitle>
            <DialogDescription>
              Questions about methodology, FastAPI backend integration, or research collaboration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-medium text-slate-700">
                Email Address
              </label>
              <Input
                id="contact-email"
                type="email"
                required
                placeholder="you@organization.org"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-msg" className="text-xs font-medium text-slate-700">
                Message
              </label>
              <Textarea
                id="contact-msg"
                required
                placeholder="Share your feedback or integration inquiry..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setContactOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
