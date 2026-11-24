import type { ActivityMetricPoint, Investigation } from "@/src/types/investigation";

export const SAMPLE_IMAGE_URBAN_RAIN = "/images/sample_urban_rain_1795495309054.jpg";
export const SAMPLE_IMAGE_GLASS_PAVILION = "/images/sample_glass_pavilion_1795495310036.jpg";
export const HERO_STUDIO_IMAGE = "/images/hero_verification_studio_1795495308618.jpg";

export const INITIAL_MOCK_INVESTIGATIONS: Investigation[] = [
  {
    id: "VTY-2026-1042",
    type: "image",
    title: "Evening Transit Plaza Rainfall Photograph",
    summary:
      "Multi-signal inspection shows natural sensor grain and consistent optical reflections, though stripped EXIF headers prevent provenance confirmation.",
    createdAt: "2026-11-23T14:22:00Z",
    status: "completed",
    overallAssessment: "Inconclusive / Mixed Signals",
    confidence: {
      low: 62,
      high: 78,
      uncertaintyNote:
        "±16% uncertainty band. Stripped metadata and JPEG recompression limit definitive provenance conclusions; findings should not be treated as proof of authenticity.",
    },
    explanation:
      "Noise residual distribution and streetlamp specular reflections align with physical camera optics, while Error Level Analysis (ELA) reveals uniform 88% JPEG quantization typical of web distribution. However, because EXIF and C2PA Content Credentials are absent, origin verification remains incomplete.",
    limitations: [
      "Prototype simulation preview: live PyTorch and OpenCV inference pipelines are not connected in this frontend environment.",
      "Single-image visual detectors cannot establish whether a photograph was captured at the claimed time or location without corroborated metadata.",
      "Social-platform re-encoding removes camera-native quantization tables and weakens compression artifact localization.",
    ],
    modelFindings: [
      {
        modelName: "Frequency & DCT Residual Analyzer (Prototype)",
        modality: "Image Forensics",
        signalLabel: "Low Synthetic Spectral Anomaly",
        scoreRange: "18% – 29% synthetic likelihood",
        status: "nominal",
        detail: "High-frequency radial spectrum lacks regular periodic upsampling peaks typical of diffusion decoders.",
      },
      {
        modelName: "EXIF & C2PA Provenance Parser",
        modality: "Container Metadata",
        signalLabel: "Headers Stripped",
        scoreRange: "Unavailable",
        status: "caution",
        detail: "No camera make, GPS coordinates, or C2PA cryptographic signature found in file header.",
      },
      {
        modelName: "Lighting & Reflection Geometry Check (Prototype)",
        modality: "Visual Consistency",
        signalLabel: "Consistent Specular Vectors",
        scoreRange: "74% – 86% consistency",
        status: "nominal",
        detail: "Wet stone reflections align monotonically with overhead streetlamps and vehicle headlamps.",
      },
    ],
    evidenceTable: [
      {
        id: "ev-1",
        category: "Compression History",
        finding: "Uniform quantization grid across foreground umbrellas and background buses; no localized splicing halo detected.",
        polarity: "supporting",
        sourceOrModule: "ELA Quantization Pass",
        weight: "Moderate",
      },
      {
        id: "ev-2",
        category: "Metadata Integrity",
        finding: "EXIF, XMP, and IPTC blocks absent; consistent with web export or social media stripping.",
        polarity: "neutral",
        sourceOrModule: "Metadata Parser",
        weight: "High",
      },
      {
        id: "ev-3",
        category: "Optical Grain",
        finding: "Chromatic shadow noise matches low-light CMOS sensor characteristics rather than smooth generative denoising.",
        polarity: "supporting",
        sourceOrModule: "Noise Residual Pass",
        weight: "Moderate",
      },
    ],
    sourceReferences: [],
    isMockSimulation: true,
    imagePayload: {
      previewUrl: SAMPLE_IMAGE_URBAN_RAIN,
      metadata: {
        fileName: "transit_plaza_rain_sample.jpg",
        mimeType: "image/jpeg",
        fileSizeBytes: 1482910,
        dimensions: "1408 × 1056 px",
        sha256: "8f3a9d21c4e8b7019f02a4e8c91d4a77b3f520e91a4d82c61b90e3f1a829c014",
        exifStatus: "Stripped (No camera EXIF or C2PA manifest)",
        cameraOrSoftware: "Unknown / Web Re-encoded",
        c2paManifest: "Not present",
      },
      manipulationIndicators: [
        {
          indicator: "Edge Splicing & Copy-Move Residuals",
          severity: "Low",
          observation: "No sharp boundary discontinuities detected around pedestrian silhouettes or signage.",
        },
        {
          indicator: "Double-JPEG Compression Mismatch",
          severity: "Moderate",
          observation: "File appears re-saved at medium-high quality, obscuring original sensor sub-blocks.",
        },
      ],
      visualConsistencyFindings: [
        "Wet cobblestone reflections track primary warm streetlamp sources without contradictory secondary shadows.",
        "Perspective vanishing lines along storefront facades remain geometrically coherent.",
      ],
      aiGenerationIndicators: [
        {
          signal: "Generative Text Rendering",
          observation: "Bus route display and shop signage appear legible with minor low-light motion blur.",
          level: "Low",
        },
        {
          signal: "Diffusion Texture Smoothing",
          observation: "Natural micro-contrast in rain streaks and umbrella fabric folds.",
          level: "Low",
        },
      ],
    },
  },
  {
    id: "VTY-2026-1041",
    type: "image",
    title: "Twilight Glass Research Pavilion Exterior",
    summary:
      "Elevated synthetic generation indicators observed in architectural signage glyphs and hyper-symmetrical reflection textures.",
    createdAt: "2026-11-23T11:05:00Z",
    status: "completed",
    overallAssessment: "Elevated Synthetic Generation Indicators",
    confidence: {
      low: 71,
      high: 86,
      uncertaintyNote:
        "±15% uncertainty band. High-end 3D architectural CGI renders and diffusion outputs can share smooth surface statistics; human editorial inspection is advised.",
    },
    explanation:
      "Multiple complementary checks flag synthetic characteristics: distorted micro-typography on the building fascia, unnaturally uniform concrete surface gradients, and absence of authentic optical lens aberration or camera EXIF records. Because CGI rendering and generative AI overlap statistically, VerityAI reports elevated synthetic indicators rather than asserting a single definitive generator.",
    limitations: [
      "Prototype simulation preview: no live neural detector weights are executed in the browser.",
      "Commercial architectural visualization (3D raytracing) frequently triggers smooth-surface synthetic indicators.",
    ],
    modelFindings: [
      {
        modelName: "Synthetic Texture & Glyph Inspector (Prototype)",
        modality: "Generative Forensics",
        signalLabel: "Elevated Synthetic Indicators",
        scoreRange: "72% – 88% synthetic likelihood",
        status: "elevated",
        detail: "Irregular letterform topology detected on entrance fascia and mirrored pool reflection.",
      },
      {
        modelName: "EXIF & C2PA Provenance Parser",
        modality: "Container Metadata",
        signalLabel: "No Camera Capture Signature",
        scoreRange: "Unavailable",
        status: "caution",
        detail: "Missing shutter, ISO, focal length, and lens profile metadata.",
      },
      {
        modelName: "Illumination Symmetry Check (Prototype)",
        modality: "Visual Consistency",
        signalLabel: "Hyper-Uniform Gradient Profile",
        scoreRange: "68% – 80% anomaly score",
        status: "caution",
        detail: "Interior ceiling lights and pool reflection exhibit near-zero ambient surface imperfection.",
      },
    ],
    evidenceTable: [
      {
        id: "ev-g1",
        category: "Text & Micro-Detail Integrity",
        finding: "Entrance fascia characters exhibit non-standard glyph distortions inconsistent with physical signage.",
        polarity: "contradicting",
        sourceOrModule: "OCR & Glyph Geometry Check",
        weight: "High",
      },
      {
        id: "ev-g2",
        category: "Surface Noise Floor",
        finding: "Twilight sky and brushed concrete lack natural high-ISO chromatic sensor variance.",
        polarity: "contradicting",
        sourceOrModule: "Noise Floor Estimator",
        weight: "Moderate",
      },
      {
        id: "ev-g3",
        category: "Metadata Provenance",
        finding: "No camera EXIF or C2PA provenance tag attached to asset.",
        polarity: "neutral",
        sourceOrModule: "Metadata Parser",
        weight: "Moderate",
      },
    ],
    sourceReferences: [],
    isMockSimulation: true,
    imagePayload: {
      previewUrl: SAMPLE_IMAGE_GLASS_PAVILION,
      metadata: {
        fileName: "glass_pavilion_twilight_sample.jpg",
        mimeType: "image/jpeg",
        fileSizeBytes: 1294400,
        dimensions: "1408 × 1056 px",
        sha256: "3c19e4a772b0d814f62199b0a5e82d317f6a4021bc98e1204f7a6d2e110c9b45",
        exifStatus: "Absent (No camera device or C2PA credentials)",
        cameraOrSoftware: "Unspecified",
        c2paManifest: "Not present",
      },
      manipulationIndicators: [
        {
          indicator: "Local Region Splicing",
          severity: "Low",
          observation: "Global image synthesis profile is uniform; no pasted foreground cutouts detected.",
        },
        {
          indicator: "Signage Structural Anomaly",
          severity: "Elevated",
          observation: "Entrance header lettering breaks standard typographic stroke consistency.",
        },
      ],
      visualConsistencyFindings: [
        "Reflecting pool symmetry is unusually pristine with negligible water ripple distortion.",
        "Perspective lines are geometrically clean, typical of either architectural CAD renders or modern diffusion models.",
      ],
      aiGenerationIndicators: [
        {
          signal: "Typography & Fine Signage Degradation",
          observation: "Distorted characters on the central glass atrium banner.",
          level: "Elevated",
        },
        {
          signal: "Synthetic Surface Smoothness",
          observation: "Low residual sensor noise in shadowed concrete columns.",
          level: "Elevated",
        },
      ],
    },
  },
  {
    id: "VTY-2026-1039",
    type: "news",
    title: "Municipal Grid Battery Reserve Claim Verification",
    summary:
      "Claim asserting a 400% single-quarter surge in municipal grid storage capacity omits baseline denominators and mixes contracted capacity with operational output.",
    createdAt: "2026-11-22T18:40:00Z",
    status: "completed",
    overallAssessment: "Misleading",
    confidence: {
      low: 74,
      high: 88,
      uncertaintyNote:
        "±14% uncertainty band. Prototype retrieval compares against curated sample policy records; live web retrieval requires FastAPI backend integration.",
    },
    explanation:
      "The submitted statement correctly references an expansion in municipal grid battery approvals, but conflates multi-year permitted pipeline capacity (400% larger than 2022 baseline) with active single-quarter grid-connected discharge capacity (+38% year-over-year).",
    limitations: [
      "Prototype simulation: evidence excerpts below are structured demonstration records and do not query live external news indexes.",
      "Assessment reflects textual framing against sample regulatory metrics; regional utility revisions may change quarterly totals.",
    ],
    modelFindings: [
      {
        modelName: "Claim Decomposition & Numeric Grounding (Prototype)",
        modality: "NLP Claim Extraction",
        signalLabel: "Denominator Mismatch",
        scoreRange: "2 atomic claims extracted",
        status: "caution",
        detail: "Separates permitted pipeline capacity from operational megawatt-hour output.",
      },
      {
        modelName: "Cross-Source NLI Entailment (Prototype)",
        modality: "Evidence Alignment",
        signalLabel: "Partial Contradiction",
        scoreRange: "74% – 88% framing discrepancy",
        status: "caution",
        detail: "Operational capacity rose 38% rather than 400% in the cited quarter.",
      },
    ],
    evidenceTable: [
      {
        id: "ev-n1",
        category: "Operational Capacity",
        finding: "Utility quarterly filing shows operational storage increased by 38% YoY, not 400% in one quarter.",
        polarity: "contradicting",
        sourceOrModule: "Prototype Reference Brief",
        weight: "High",
      },
      {
        id: "ev-n2",
        category: "Permitted Pipeline",
        finding: "Multi-year interconnection queue approvals grew nearly 4x compared to the 2022 baseline.",
        polarity: "supporting",
        sourceOrModule: "Prototype Reference Brief",
        weight: "Moderate",
      },
    ],
    sourceReferences: [
      {
        id: "src-1",
        sourceName: "Sample Energy Commission Quarterly Dataset (Prototype Record)",
        title: "Grid-Scale Storage Interconnection & Active Dispatch Summary",
        publicationDate: "2026-10-15",
        url: "#prototype-reference-record",
        stance: "Contradicting",
        excerpt:
          "Active synchronized battery storage rose 38% year-over-year in Q3, while long-term queued permits reached 4.1x the 2022 baseline.",
        isPrototypeReference: true,
      },
    ],
    isMockSimulation: true,
    newsPayload: {
      inputMode: "claim",
      submittedClaim:
        "City grid authorities confirmed a 400% overnight surge in active battery storage output during Q3, eliminating peak fossil peaker usage.",
      extractedClaims: [
        {
          id: "clm-1",
          claimText: "Active battery storage output surged 400% during Q3.",
          assessment: "Misleading",
          rationale:
            "Conflates multi-year permitted pipeline growth (4.1x vs. 2022) with active single-quarter operational output (+38% YoY).",
          supportingEvidence: [
            "Interconnection queue filings confirm roughly 4x growth in proposed/approved storage permits relative to 2022.",
          ],
          contradictingEvidence: [
            "Operational telemetry records indicate a 38% year-over-year increase in synchronized dispatch capacity during Q3.",
          ],
          sources: [
            {
              id: "src-1",
              sourceName: "Sample Energy Commission Quarterly Dataset (Prototype Record)",
              title: "Grid-Scale Storage Interconnection & Active Dispatch Summary",
              publicationDate: "2026-10-15",
              url: "#prototype-reference-record",
              stance: "Contradicting",
              excerpt:
                "Active synchronized battery storage rose 38% year-over-year in Q3, while long-term queued permits reached 4.1x the 2022 baseline.",
              isPrototypeReference: true,
            },
          ],
        },
        {
          id: "clm-2",
          claimText: "Peak fossil peaker plant usage was completely eliminated.",
          assessment: "Contradicted",
          rationale:
            "Regional dispatch summaries indicate gas peaker plants still supplied 11% of evening peak demand during heatwave events.",
          supportingEvidence: [],
          contradictingEvidence: [
            "Evening peak generation logs record continued thermal peaker dispatch during high-load days.",
          ],
          sources: [],
        },
      ],
    },
  },
  {
    id: "VTY-2026-1035",
    type: "document",
    title: "2026_Regional_Transit_Sustainability_Brief.pdf",
    summary:
      "PDF metadata and internal financial tables are internally consistent, with one forward-looking ridership projection requiring external agency verification.",
    createdAt: "2026-11-21T09:15:00Z",
    status: "completed",
    overallAssessment: "Requires Cross-Verification",
    confidence: {
      low: 69,
      high: 83,
      uncertaintyNote:
        "±14% uncertainty band. Document consistency checks cannot verify external fiscal assumptions without live treasury database access.",
    },
    explanation:
      "Structural PDF parsing confirms clean page-tree provenance with no incremental shadow-layer overrides. Historical 2024–2025 capital expenditure figures match across executive summary and appendix tables, while the 2028 ridership elasticity projection lacks cited sensitivity bounds.",
    limitations: [
      "Prototype simulation: PDF OCR and cross-document retrieval run in simulated mode until FastAPI/PyMuPDF backend is attached.",
      "Internal table consistency does not guarantee external accuracy of baseline assumptions.",
    ],
    modelFindings: [
      {
        modelName: "PDF Structure & Revision Inspector (Prototype)",
        modality: "Document Forensics",
        signalLabel: "Single-Pass Export",
        scoreRange: "0 hidden incremental updates",
        status: "nominal",
        detail: "XRef table shows clean single-generation export from LaTeX / TeX Live.",
      },
      {
        modelName: "Cross-Table Arithmetic & Claim Extractor (Prototype)",
        modality: "Document NLP",
        signalLabel: "1 Unsourced Forecast Claim",
        scoreRange: "3 key claims extracted",
        status: "caution",
        detail: "Historical budgets reconcile to 0.1% variance; 2028 ridership figure lacks confidence interval.",
      },
    ],
    evidenceTable: [
      {
        id: "ev-d1",
        category: "Table Reconciliation",
        finding: "Summary capital cost ($142.4M) matches Appendix B itemized ledger ($142.4M).",
        polarity: "supporting",
        sourceOrModule: "Numeric Consistency Pass",
        weight: "High",
      },
      {
        id: "ev-d2",
        category: "Forecast Grounding",
        finding: "Projected 28% commuter mode shift by 2028 does not cite methodology or elasticity assumptions.",
        polarity: "neutral",
        sourceOrModule: "Claim Grounding Pass",
        weight: "Moderate",
      },
    ],
    sourceReferences: [],
    isMockSimulation: true,
    documentPayload: {
      metadata: {
        fileName: "2026_Regional_Transit_Sustainability_Brief.pdf",
        fileSizeBytes: 2418900,
        pageCount: 14,
        sha256: "9d2f41880a6b3e7c1180e249b5a0c19d77f2a801e4c9b22d84a701e93f60b112",
        author: "Metropolitan Transit Policy Office",
        producer: "pdfTeX-1.40.25",
        createdDate: "2026-11-12",
        modifiedDate: "2026-11-12",
      },
      extractedText:
        "SECTION 1 — EXECUTIVE SUMMARY\nRegional rail electrification Phase II requires $142.4M in combined capital outlay across FY2025–FY2027. Independent rolling-stock procurement audits completed in Q2 confirmed unit battery-railcar pricing within 1.8% of initial engineering estimates.\n\nSECTION 3 — RIDERSHIP & EMISSIONS OUTLOOK\nFollowing corridor signal modernization, preliminary modeling estimates a 28% mode shift from private passenger vehicles by 2028 along the North-South commuter trunk.",
      keyClaims: [
        {
          id: "doc-c1",
          pageNumber: 2,
          statement: "Phase II electrification requires $142.4M in combined capital outlay across FY2025–FY2027.",
          verificationStatus: "Supported",
          note: "Reconciles identically against Appendix B capital ledger totals.",
        },
        {
          id: "doc-c2",
          pageNumber: 5,
          statement: "Q2 procurement audit confirmed unit pricing within 1.8% of engineering estimates.",
          verificationStatus: "Supported",
          note: "Consistent with cited procurement schedule figures on page 11.",
        },
        {
          id: "doc-c3",
          pageNumber: 9,
          statement: "Corridor modernization will drive a 28% commuter mode shift by 2028.",
          verificationStatus: "Unverified",
          note: "Forward-looking model projection; appendix omits sensitivity bounds and external elasticity citations.",
        },
      ],
      comparisonFindings: [
        "No mismatched totals between narrative executive summary and Appendix B tables.",
        "PDF creation and modification timestamps match cleanly without post-export editing layers.",
        "Page 9 ridership projection requires external baseline comparison before publication.",
      ],
    },
  },
];

export const INITIAL_ACTIVITY_METRICS: ActivityMetricPoint[] = [
  { date: "Nov 10", image: 2, news: 3, document: 1, total: 6 },
  { date: "Nov 12", image: 4, news: 2, document: 2, total: 8 },
  { date: "Nov 14", image: 3, news: 5, document: 1, total: 9 },
  { date: "Nov 16", image: 5, news: 4, document: 3, total: 12 },
  { date: "Nov 18", image: 4, news: 6, document: 2, total: 12 },
  { date: "Nov 20", image: 6, news: 5, document: 4, total: 15 },
  { date: "Nov 22", image: 7, news: 8, document: 3, total: 18 },
  { date: "Nov 23", image: 5, news: 4, document: 2, total: 11 },
];
