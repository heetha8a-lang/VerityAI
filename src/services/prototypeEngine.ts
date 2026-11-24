import {
  INITIAL_MOCK_INVESTIGATIONS,
  SAMPLE_IMAGE_GLASS_PAVILION,
  SAMPLE_IMAGE_URBAN_RAIN,
} from "@/src/mocks/investigations";
import type {
  Investigation,
  NewsAnalysisRequest,
  NewsAssessmentLabel,
} from "@/src/types/investigation";

export function generateInvestigationId(): string {
  const num = Math.floor(1050 + Math.random() * 8900);
  return `VTY-2026-${num}`;
}

export function buildSimulatedImageInvestigation(params: {
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  dimensions?: string;
  sha256: string;
  previewUrl?: string;
  sampleKey?: "urban_rain" | "glass_pavilion";
}): Investigation {
  const lowerName = params.fileName.toLowerCase();
  const isGlassSample =
    params.sampleKey === "glass_pavilion" || lowerName.includes("pavilion");
  const isUrbanSample =
    params.sampleKey === "urban_rain" ||
    lowerName.includes("urban") ||
    lowerName.includes("rain");

  const now = new Date().toISOString();
  const id = generateInvestigationId();

  if (isGlassSample) {
    const base = INITIAL_MOCK_INVESTIGATIONS[1];
    return {
      ...base,
      id,
      createdAt: now,
      imagePayload: {
        ...base.imagePayload!,
        previewUrl: params.previewUrl || SAMPLE_IMAGE_GLASS_PAVILION,
        metadata: {
          ...base.imagePayload!.metadata,
          fileName: params.fileName,
          fileSizeBytes: params.fileSizeBytes,
          dimensions: params.dimensions || "1408 × 1056 px",
          sha256: params.sha256,
        },
      },
    };
  }

  if (isUrbanSample) {
    const base = INITIAL_MOCK_INVESTIGATIONS[0];
    return {
      ...base,
      id,
      createdAt: now,
      imagePayload: {
        ...base.imagePayload!,
        previewUrl: params.previewUrl || SAMPLE_IMAGE_URBAN_RAIN,
        metadata: {
          ...base.imagePayload!.metadata,
          fileName: params.fileName,
          fileSizeBytes: params.fileSizeBytes,
          dimensions: params.dimensions || "1408 × 1056 px",
          sha256: params.sha256,
        },
      },
    };
  }

  const isPng = params.mimeType === "image/png";
  return {
    id,
    type: "image",
    title: params.fileName,
    summary:
      "Prototype multi-signal check completed via Next.js API route. File metadata and visual heuristics show mixed provenance signals requiring human review.",
    createdAt: now,
    status: "completed",
    overallAssessment: "Inconclusive / Mixed Signals",
    confidence: {
      low: 54,
      high: 72,
      uncertaintyNote:
        "±18% uncertainty band. Prototype API route records file headers and client dimensions; live PyTorch and OpenCV detectors run once FastAPI is connected.",
    },
    explanation: `Analyzed "${params.fileName}" (${params.dimensions || "dimensions parsed"}, ${params.mimeType || "image"}). Because this prototype environment does not execute server-side PyTorch frequency/GAN detectors or external reverse-image indexes, VerityAI reports an inconclusive provenance band rather than making an unsupported authenticity claim.`,
    limitations: [
      "Prototype simulation mode: live OpenCV Error Level Analysis and PyTorch synthetic detectors run on the external Python FastAPI backend.",
      "Single-pass inspection cannot rule out subtle local edits or off-camera context misrepresentation.",
    ],
    modelFindings: [
      {
        modelName: "Container & SHA-256 Digest Inspector",
        modality: "File Provenance",
        signalLabel: "SHA-256 Verified",
        scoreRange: "100% deterministic hash",
        status: "nominal",
        detail: `Recorded cryptographic SHA-256 digest (${params.sha256.slice(0, 16)}...) for chain-of-custody tracking.`,
      },
      {
        modelName: "Compression & Noise Residual Pass (Prototype)",
        modality: "Image Forensics",
        signalLabel: isPng ? "Lossless Container (No JPEG Quantization)" : "Standard Lossy Profile",
        scoreRange: "48% – 66% baseline alignment",
        status: "neutral",
        detail: isPng
          ? "PNG encoding preserves pixel values without DCT block artifacts; requires neural noise-print pass on FastAPI."
          : "JPEG container structure readable; server-side quantization table extraction queued for FastAPI.",
      },
      {
        modelName: "Synthetic Texture Detector (Prototype)",
        modality: "Generative Forensics",
        signalLabel: "Pending FastAPI Weights",
        scoreRange: "54% – 72% indeterminate",
        status: "caution",
        detail: "No single classifier should be treated as definitive proof of human or synthetic origin.",
      },
    ],
    evidenceTable: [
      {
        id: `ev-${Date.now()}-1`,
        category: "Cryptographic Digest",
        finding: `SHA-256 checksum recorded (${params.sha256.slice(0, 20)}...) for chain-of-custody tracking.`,
        polarity: "supporting",
        sourceOrModule: "SHA-256 Digest",
        weight: "High",
      },
      {
        id: `ev-${Date.now()}-2`,
        category: "Provenance Credentials",
        finding: "C2PA cryptographic manifest and camera-signed EXIF require Python binary parser verification.",
        polarity: "neutral",
        sourceOrModule: "Metadata Parser (Prototype)",
        weight: "Moderate",
      },
    ],
    sourceReferences: [],
    isMockSimulation: true,
    imagePayload: {
      previewUrl: params.previewUrl || "",
      metadata: {
        fileName: params.fileName,
        mimeType: params.mimeType || "image/unknown",
        fileSizeBytes: params.fileSizeBytes,
        dimensions: params.dimensions || "Unknown",
        sha256: params.sha256,
        exifStatus: "Prototype header inspected (Full EXIF/XMP tree parsed by FastAPI)",
        cameraOrSoftware: "Pending FastAPI EXIF extraction",
        c2paManifest: "Not verified in prototype mode",
      },
      manipulationIndicators: [
        {
          indicator: "Container Integrity",
          severity: "Low",
          observation: "File decoded cleanly without structural header corruption.",
        },
        {
          indicator: "Deep Splicing / Inpainting Localization",
          severity: "Moderate",
          observation: "Prototype placeholder — connect FastAPI OpenCV/PyTorch endpoint for pixel-level heatmaps.",
        },
      ],
      visualConsistencyFindings: [
        `Image inspected at ${params.dimensions || "native resolution"}.`,
        "Awaiting FastAPI shadow-vector and illumination consistency evaluation.",
      ],
      aiGenerationIndicators: [
        {
          signal: "Prototype Generative Screening",
          observation: "Inconclusive without FastAPI diffusion spectral classifier; avoid single-model conclusions.",
          level: "Moderate",
        },
      ],
    },
  };
}

export function buildSimulatedNewsInvestigation(request: NewsAnalysisRequest): Investigation {
  const text = (request.claimText || "").trim();
  const lower = `${text} ${request.url || ""}`.toLowerCase();
  const now = new Date().toISOString();
  const id = generateInvestigationId();

  let assessment: NewsAssessmentLabel = "Unverified";
  let rationale =
    "No verified external primary source in the local prototype index directly confirms or refutes this statement. VerityAI refuses to fabricate citations when live retrieval is offline.";
  let supporting: string[] = [];
  let contradicting: string[] = [];
  let domain: string | undefined;

  if (request.url) {
    try {
      domain = new URL(request.url).hostname.replace(/^www\./, "");
    } catch {
      domain = undefined;
    }
  }

  if (lower.includes("400%") || lower.includes("battery") || lower.includes("peaker")) {
    assessment = "Misleading";
    rationale =
      "The statement conflates multi-year permitted storage queue totals with single-quarter active grid dispatch output.";
    supporting = [
      "Interconnection queue growth relative to 2022 baselines aligns with multi-fold permit expansion.",
    ];
    contradicting = [
      "Quarterly synchronized capacity reports indicate 38% year-over-year operational growth rather than 400% in one quarter.",
    ];
  } else if (lower.includes("100% cure") || lower.includes("guaranteed") || lower.includes("ban all")) {
    assessment = "Contradicted";
    rationale =
      "Absolutist phrasing ('100%', 'guaranteed', 'all') is inconsistent with empirical clinical or regulatory variance patterns in prototype reference benchmarks.";
    contradicting = [
      "Primary peer-reviewed and agency guidelines consistently report confidence intervals rather than absolute universal outcomes.",
    ];
  } else if (lower.includes("reuters") || lower.includes("who") || lower.includes("nasa") || lower.includes("temperature")) {
    assessment = "Supported";
    rationale =
      "Structured claim phrasing aligns with multi-agency observational methodology in prototype verification benchmarks (subject to live source link audit).";
    supporting = [
      "Claim references measurable observational trends consistent with public reporting conventions.",
    ];
  }

  const titleSource = request.url
    ? `URL Audit: ${domain || request.url}`
    : text.length > 64
      ? `${text.slice(0, 61)}...`
      : text;

  return {
    id,
    type: "news",
    title: titleSource,
    summary: `Claim evaluated as "${assessment}" via Next.js prototype API route. ${rationale}`,
    createdAt: now,
    status: "completed",
    overallAssessment: assessment,
    confidence: {
      low: assessment === "Unverified" ? 35 : 68,
      high: assessment === "Unverified" ? 55 : 84,
      uncertaintyNote:
        assessment === "Unverified"
          ? "High uncertainty: without live web retrieval or corroborated primary documents, VerityAI defaults to Unverified rather than guessing."
          : "±16% uncertainty band. Prototype mode demonstrates structured claim decomposition; connect FastAPI retrieval pipelines for live web evidence.",
    },
    explanation: rationale,
    limitations: [
      "Prototype simulation notice: live external news scraping and vector-DB evidence retrieval are not executed until FastAPI is connected.",
      "VerityAI never invents external publication dates, article URLs, or quotes when a live retrieval backend is disconnected.",
    ],
    modelFindings: [
      {
        modelName: "Atomic Claim Extractor (Prototype)",
        modality: "NLP Decomposition",
        signalLabel: "1 Primary Claim Parsed",
        scoreRange: "Structured extraction",
        status: "nominal",
        detail: "Isolated check-worthy factual assertions from submitted text/URL context.",
      },
      {
        modelName: "Evidence Retrieval & Stance Classifier (Prototype)",
        modality: "Source Grounding",
        signalLabel: assessment,
        scoreRange: assessment === "Unverified" ? "Insufficient live sources" : "68% – 84% alignment",
        status:
          assessment === "Supported"
            ? "nominal"
            : assessment === "Unverified"
              ? "neutral"
              : "caution",
        detail:
          assessment === "Unverified"
            ? "Live retrieval offline; marked Unverified to avoid fabricated citations."
            : "Evaluated claim phrasing against prototype structured evidence rules.",
      },
    ],
    evidenceTable: [
      ...supporting.map((item, idx) => ({
        id: `sup-${idx}`,
        category: "Supporting Context",
        finding: item,
        polarity: "supporting" as const,
        sourceOrModule: "Prototype Verification Benchmark",
        weight: "Moderate" as const,
      })),
      ...contradicting.map((item, idx) => ({
        id: `con-${idx}`,
        category: "Contradicting Context",
        finding: item,
        polarity: "contradicting" as const,
        sourceOrModule: "Prototype Verification Benchmark",
        weight: "High" as const,
      })),
      ...(supporting.length === 0 && contradicting.length === 0
        ? [
            {
              id: "unv-0",
              category: "Retrieval Coverage",
              finding:
                "No live external article or database record matched in prototype mode; claim preserved as Unverified.",
              polarity: "neutral" as const,
              sourceOrModule: "Zero-Fabrication Guardrail",
              weight: "High" as const,
            },
          ]
        : []),
    ],
    sourceReferences: [
      {
        id: "proto-ref-1",
        sourceName: "VerityAI Prototype Benchmark Index",
        title: "Next.js API Prototype Record (Live Citation Retrieval Pending FastAPI)",
        publicationDate: now.slice(0, 10),
        url: request.url || "#prototype-simulation",
        stance: "Contextual",
        excerpt:
          "This entry marks the provenance boundary of the Next.js API prototype. Real external URLs and publication dates are populated once connected to the Python evidence retrieval service.",
        isPrototypeReference: true,
      },
    ],
    isMockSimulation: true,
    newsPayload: {
      inputMode: request.url ? "url" : "claim",
      submittedUrl: request.url || undefined,
      submittedClaim: text || `Article submitted from ${request.url}`,
      publisherDomain: domain,
      extractedClaims: [
        {
          id: `clm-${Date.now()}`,
          claimText: text || `Primary assertion referenced at ${request.url}`,
          assessment,
          rationale,
          supportingEvidence: supporting,
          contradictingEvidence: contradicting,
          sources: [],
        },
      ],
    },
  };
}

export function buildSimulatedDocumentInvestigation(params: {
  fileName: string;
  fileSizeBytes: number;
  sha256: string;
  previewUrl?: string;
  sampleKey?: "climate_brief" | "financial_filing";
  extractedPreviewText?: string;
}): Investigation {
  const now = new Date().toISOString();
  const id = generateInvestigationId();

  if (params.sampleKey === "climate_brief") {
    const base = INITIAL_MOCK_INVESTIGATIONS[3];
    return {
      ...base,
      id,
      createdAt: now,
    };
  }

  const previewSnippet =
    params.extractedPreviewText?.trim() ||
    `Uploaded PDF "${params.fileName}" (${params.fileSizeBytes} bytes) was hashed and structurally previewed. Full multi-page OCR, table reconciliation, and XRef revision inspection execute when connected to the Python FastAPI + PyMuPDF backend.`;

  return {
    id,
    type: "document",
    title: params.fileName,
    summary:
      "Document hash and container preview processed via Next.js API route. Internal claim reconciliation requires FastAPI PDF/OCR pipeline.",
    createdAt: now,
    status: "completed",
    overallAssessment: "Requires Cross-Verification",
    confidence: {
      low: 58,
      high: 76,
      uncertaintyNote:
        "±18% uncertainty band. Prototype API captures cryptographic file identity; full text OCR and table math run in the FastAPI backend.",
    },
    explanation: `Captured cryptographic digest (${params.sha256.slice(0, 16)}...) and structural preview for "${params.fileName}". Because the Next.js prototype layer does not execute deep PDF object-stream parsing or OCR models, VerityAI flags the document for cross-verification rather than asserting completeness.`,
    limitations: [
      "Prototype simulation mode: deep PDF XRef revision trees and OCR require Python FastAPI services.",
      "Scanned image-only PDFs require server-side Tesseract/PaddleOCR extraction.",
    ],
    modelFindings: [
      {
        modelName: "Document SHA-256 Fingerprint",
        modality: "File Integrity",
        signalLabel: "SHA-256 Computed",
        scoreRange: "100% deterministic",
        status: "nominal",
        detail: `Digest: ${params.sha256.slice(0, 24)}...`,
      },
      {
        modelName: "PDF Claim & Table Auditor (Prototype)",
        modality: "Document NLP",
        signalLabel: "Awaiting Full OCR Pass",
        scoreRange: "58% – 76% preliminary range",
        status: "caution",
        detail: "Preliminary header scan completed; connect FastAPI to audit embedded tables.",
      },
    ],
    evidenceTable: [
      {
        id: `doc-ev-${Date.now()}-1`,
        category: "Cryptographic Digest",
        finding: `Computed SHA-256 fingerprint for "${params.fileName}" cleanly.`,
        polarity: "supporting",
        sourceOrModule: "SHA-256 Digest",
        weight: "High",
      },
      {
        id: `doc-ev-${Date.now()}-2`,
        category: "OCR & Table Cross-Check",
        finding: "Multi-page numeric table reconciliation queued for Python FastAPI OCR pipeline.",
        polarity: "neutral",
        sourceOrModule: "Document Pipeline (Prototype)",
        weight: "Moderate",
      },
    ],
    sourceReferences: [],
    isMockSimulation: true,
    documentPayload: {
      previewUrl: params.previewUrl,
      metadata: {
        fileName: params.fileName,
        fileSizeBytes: params.fileSizeBytes,
        pageCount: 1,
        sha256: params.sha256,
        author: "Parsed on FastAPI backend",
        producer: "PDF Container",
        createdDate: now.slice(0, 10),
        modifiedDate: now.slice(0, 10),
      },
      extractedText: previewSnippet,
      keyClaims: [
        {
          id: `doc-k-${Date.now()}`,
          pageNumber: 1,
          statement: `Submitted document "${params.fileName}" queued for multi-page claim extraction.`,
          verificationStatus: "Unverified",
          note: "Connect FastAPI PDF extraction endpoint to segment and cross-verify individual assertions.",
        },
      ],
      comparisonFindings: [
        `File size (${params.fileSizeBytes.toLocaleString()} bytes) and SHA-256 hash recorded for auditability.`,
        "Server-side PyMuPDF / OCR required for multi-page numerical reconciliation.",
      ],
    },
  };
}
