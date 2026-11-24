"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Newspaper,
  RotateCcw,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { WorkspaceShell } from "@/src/components/layout/WorkspaceShell";
import { AssessmentBadge } from "@/src/components/shared/AssessmentBadge";
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
import { cn, formatShortDate } from "@/src/lib/utils";

type ChartSeriesFilter = "total" | "image" | "news" | "document";

export default function DashboardPage() {
  const { investigations, activityMetrics, resetDemoData } = useInvestigations();
  const [seriesFilter, setSeriesFilter] = useState<ChartSeriesFilter>("total");

  const counts = useMemo(() => {
    const image = investigations.filter((i) => i.type === "image").length;
    const news = investigations.filter((i) => i.type === "news").length;
    const document = investigations.filter((i) => i.type === "document").length;
    return {
      total: investigations.length,
      image,
      news,
      document,
    };
  }, [investigations]);

  const recentInvestigations = useMemo(() => investigations.slice(0, 5), [investigations]);

  const seriesMeta: Record<ChartSeriesFilter, { label: string; color: string }> = {
    total: { label: "All Investigations", color: "#4F46E5" },
    image: { label: "Images Analyzed", color: "#0F172A" },
    news: { label: "News Claims", color: "#4F46E5" },
    document: { label: "Documents", color: "#0284C7" },
  };

  return (
    <WorkspaceShell
      breadcrumb="Dashboard"
      title="Verification Workspace Overview"
      subtitle="Monitor recent authenticity checks, inspect activity trends across modalities, or launch a new evidence investigation."
      primaryAction={
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetDemoData();
            toast.success("Workspace reset to baseline prototype records.");
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset Demo Data</span>
        </Button>
      }
    >
      <PrototypeNotice />

      <section aria-label="Investigation metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Investigations",
            value: counts.total,
            note: "Archived in current workspace",
          },
          {
            label: "Images Analyzed",
            value: counts.image,
            note: "Metadata & visual residual passes",
          },
          {
            label: "News Claims Checked",
            value: counts.news,
            note: "URL & statement decompositions",
          },
          {
            label: "Documents Analyzed",
            value: counts.document,
            note: "PDF extraction & table checks",
          },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5 space-y-1.5">
              <div className="text-xs font-medium text-slate-500">{metric.label}</div>
              <div className="font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500">{metric.note}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div className="space-y-1">
              <CardTitle>Investigation Activity</CardTitle>
              <CardDescription>
                14-day submission volume across verification modalities
              </CardDescription>
            </div>
            <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 self-start">
              {(["total", "image", "news", "document"] as ChartSeriesFilter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSeriesFilter(key)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer",
                    seriesFilter === key
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {key === "total" ? "All" : key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityMetrics}
                  margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="veritySeriesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={seriesMeta[seriesFilter].color} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={seriesMeta[seriesFilter].color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E8F0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={seriesFilter}
                    name={seriesMeta[seriesFilter].label}
                    stroke={seriesMeta[seriesFilter].color}
                    strokeWidth={2}
                    fill="url(#veritySeriesFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-4">
          {[
            {
              href: "/image",
              icon: ImageIcon,
              title: "Image Intelligence",
              desc: "Upload a photo to inspect EXIF metadata, noise residuals, and synthetic cues.",
              cta: "Analyze Image",
            },
            {
              href: "/news",
              icon: Newspaper,
              title: "News & Claim Check",
              desc: "Submit a news article URL or claim statement for structured evidence review.",
              cta: "Verify Claim",
            },
            {
              href: "/document",
              icon: FileText,
              title: "Document Intelligence",
              desc: "Upload a PDF brief to preview text, check metadata, and isolate key assertions.",
              cta: "Analyze PDF",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.href} className="flex-1">
                <CardContent className="p-5 flex flex-col justify-between h-full gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shrink-0">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-sm font-semibold text-slate-900">
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{action.desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={action.href}>
                        <span>{action.cta}</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle>Recent Investigations & Results</CardTitle>
            <CardDescription>
              Latest submitted artifacts with calibrated overall assessments
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/history">View Full History</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Confidence Range</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Report</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvestigations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs font-medium text-slate-600 tabular-nums whitespace-nowrap">
                    {inv.id}
                  </TableCell>
                  <TableCell className="max-w-[280px]">
                    <div className="font-medium text-slate-900 truncate">{inv.title}</div>
                    <div className="text-xs text-slate-500 truncate">{inv.summary}</div>
                  </TableCell>
                  <TableCell className="capitalize text-xs font-medium text-slate-700 whitespace-nowrap">
                    {inv.type}
                  </TableCell>
                  <TableCell>
                    <AssessmentBadge assessment={inv.overallAssessment} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                    {inv.confidence.low}% – {inv.confidence.high}%
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap tabular-nums">
                    {formatShortDate(inv.createdAt)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/reports/${inv.id}`}>View Report</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkspaceShell>
  );
}
