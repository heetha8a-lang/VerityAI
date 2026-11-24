"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, FileSearch, Search } from "lucide-react";
import { WorkspaceShell } from "@/src/components/layout/WorkspaceShell";
import { AssessmentBadge } from "@/src/components/shared/AssessmentBadge";
import { PrototypeNotice } from "@/src/components/shared/PrototypeNotice";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useInvestigations } from "@/src/context/InvestigationContext";
import { cn, formatDateTime } from "@/src/lib/utils";
import type { InvestigationType } from "@/src/types/investigation";

type TypeFilter = "all" | InvestigationType;

export default function HistoryPage() {
  const { investigations } = useInvestigations();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return investigations
      .filter((item) => {
        if (typeFilter !== "all" && item.type !== typeFilter) return false;
        if (!query) return true;
        return (
          item.id.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.overallAssessment.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sortOrder === "newest" ? diff : -diff;
      });
  }, [investigations, searchQuery, typeFilter, sortOrder]);

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setSortOrder("newest");
  };

  return (
    <WorkspaceShell
      breadcrumb="Investigation History"
      title="Investigation History"
      subtitle="Search, filter, and open full audit reports for all prior image, news claim, and PDF document verifications."
    >
      <PrototypeNotice />

      <Card>
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search by ID, title, claim, or assessment..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1"
              role="group"
              aria-label="Filter by investigation type"
            >
              {(["all", "image", "news", "document"] as TypeFilter[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors whitespace-nowrap shrink-0 cursor-pointer",
                    typeFilter === type
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
            >
              <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 px-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FileSearch className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              No Matching Investigations Found
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Try adjusting your search keywords or clearing the active modality filter.
            </p>
            <div className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investigation ID</TableHead>
                  <TableHead>Subject & Summary</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Status</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs font-medium text-slate-700 whitespace-nowrap tabular-nums">
                      {inv.id}
                    </TableCell>
                    <TableCell className="max-w-[340px]">
                      <div className="font-medium text-slate-900 truncate">{inv.title}</div>
                      <div className="text-xs text-slate-500 truncate">{inv.summary}</div>
                    </TableCell>
                    <TableCell className="capitalize text-xs font-medium text-slate-700 whitespace-nowrap">
                      {inv.type}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-xs text-slate-700 tabular-nums">
                        {formatDateTime(inv.createdAt)}
                      </div>
                      <div className="text-[11px] text-slate-500 capitalize">
                        Status: {inv.status.replace("_", " ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AssessmentBadge assessment={inv.overallAssessment} />
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/reports/${inv.id}`}>View Detailed Report</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </WorkspaceShell>
  );
}
