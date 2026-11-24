import { jsPDF } from "jspdf";
import type { Investigation } from "@/src/types/investigation";
import { formatDateTime } from "@/src/lib/utils";

export function downloadInvestigationPdf(investigation: Investigation): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 44;
  const maxWidth = pageWidth - margin * 2;
  let y = 52;

  const ensureSpace = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 50) {
      doc.addPage();
      y = 50;
    }
  };

  const addHeading = (text: string) => {
    ensureSpace(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(text, margin, y);
    y += 8;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  };

  const addWrappedText = (text: string, fontSize = 10, color: [number, number, number] = [51, 65, 85]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    ensureSpace(lines.length * (fontSize + 4) + 6);
    doc.text(lines, margin, y);
    y += lines.length * (fontSize + 4) + 6;
  };

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 88, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("VerityAI — Evidence & Authenticity Report", margin, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Investigation ID: ${investigation.id}   |   Type: ${investigation.type.toUpperCase()}   |   Date: ${formatDateTime(investigation.createdAt)}`,
    margin,
    62
  );

  y = 114;

  // Prototype Disclosure
  if (investigation.isMockSimulation) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y - 12, maxWidth, 34, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text("PROTOTYPE SIMULATION NOTICE:", margin + 10, y + 2);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(
      "Generated via the VerityAI frontend prototype layer prior to FastAPI ML backend connection.",
      margin + 158,
      y + 2
    );
    y += 38;
  }

  addHeading("1. Investigation Summary & Overall Assessment");
  addWrappedText(`Subject: ${investigation.title}`, 10.5, [15, 23, 42]);
  addWrappedText(
    `Overall Assessment: ${investigation.overallAssessment} (${investigation.confidence.low}% – ${investigation.confidence.high}% signal alignment)`,
    10.5,
    [79, 70, 229]
  );
  addWrappedText(investigation.summary);
  addWrappedText(`Uncertainty Note: ${investigation.confidence.uncertaintyNote}`, 9.5, [100, 116, 139]);

  addHeading("2. Detailed Explanation of Findings");
  addWrappedText(investigation.explanation);

  addHeading("3. Model & Signal Findings");
  investigation.modelFindings.forEach((signal) => {
    addWrappedText(
      `• ${signal.modelName} [${signal.modality}]: ${signal.signalLabel} (${signal.scoreRange}) — ${signal.detail}`,
      9.5
    );
  });

  addHeading("4. Evidence Ledger");
  if (investigation.evidenceTable.length === 0) {
    addWrappedText("No structured evidence rows attached.", 9.5);
  } else {
    investigation.evidenceTable.forEach((row) => {
      addWrappedText(
        `• [${row.polarity.toUpperCase()} | ${row.weight} Weight] ${row.category} (${row.sourceOrModule}): ${row.finding}`,
        9.5
      );
    });
  }

  if (investigation.sourceReferences.length > 0) {
    addHeading("5. Source References");
    investigation.sourceReferences.forEach((ref) => {
      addWrappedText(
        `• ${ref.sourceName} (${ref.publicationDate}) — "${ref.title}" [${ref.stance}]${ref.isPrototypeReference ? " (Prototype Reference Record)" : ""}`,
        9.5
      );
    });
  }

  addHeading(investigation.sourceReferences.length > 0 ? "6. Limitations & Methodology" : "5. Limitations & Methodology");
  investigation.limitations.forEach((lim) => {
    addWrappedText(`• ${lim}`, 9.5, [71, 85, 105]);
  });

  doc.save(`${investigation.id}-VerityAI-Report.pdf`);
}
