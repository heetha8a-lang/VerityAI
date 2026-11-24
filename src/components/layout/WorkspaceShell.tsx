"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  Newspaper,
  Plus,
  X,
} from "lucide-react";
import { VerityLogo } from "@/src/components/shared/VerityLogo";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface WorkspaceShellProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  primaryAction?: React.ReactNode;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/image", label: "Image Intelligence", icon: ImageIcon },
  { href: "/news", label: "News & Claims", icon: Newspaper },
  { href: "/document", label: "Document Intelligence", icon: FileText },
  { href: "/history", label: "Investigation History", icon: History },
];

export function WorkspaceShell({
  breadcrumb,
  title,
  subtitle,
  primaryAction,
  children,
}: WorkspaceShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-slate-950 text-slate-200 px-4 py-5">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <VerityLogo inverted />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1" aria-label="Workspace navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href === "/history" && pathname?.startsWith("/reports/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800/80 pt-4 px-2 space-y-3">
        <p className="text-xs text-slate-400 leading-relaxed">
          Verify Information. Understand Evidence. Build Trust.
        </p>
        <Link
          href="/"
          className="inline-block text-xs font-medium text-slate-300 hover:text-white underline underline-offset-4"
        >
          Back to Public Overview
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 bg-slate-950 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-64 max-w-[80vw] h-full shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar Contract: Breadcrumb left, 1 primary action right */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-slate-500 truncate">
                <span className="font-medium text-slate-900">VerityAI</span>
                <span className="mx-2 text-slate-300">/</span>
                <span>{breadcrumb}</span>
              </nav>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {primaryAction || (
                <Button asChild size="sm">
                  <Link href="/image">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>New Verification</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
