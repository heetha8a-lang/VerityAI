import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { InvestigationProvider } from "@/src/context/InvestigationContext";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "VerityAI — Trust What You See. Verify What You Read.",
  description:
    "VerityAI is an AI-powered digital authenticity and information verification platform for analyzing images, news claims, and PDF documents with transparent evidence.",
  openGraph: {
    title: "VerityAI — Trust What You See. Verify What You Read.",
    description:
      "Verify Information. Understand Evidence. Build Trust. Multi-modal authenticity analysis with explainable findings.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
        <InvestigationProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </InvestigationProvider>
      </body>
    </html>
  );
}
