export type InvestigationType = "image" | "news" | "document";

export type InvestigationStatus = "completed" | "needs_review" | "failed";

export type NewsAssessmentLabel =
  | "Supported"
  | "Contradicted"
  | "Misleading"
  | "Unverified";

export type ImageAssessmentTier =
  | "No Strong Manipulation Signals"
  | "Inconclusive / Mixed Signals"
  | "Elevated Manipulation Indicators"
  | "Elevated Synthetic Generation Indicators";

export type DocumentAssessmentTier =
  | "Consistent Metadata & Claims"
  | "Requires Cross-Verification"
  | "Inconsistencies Detected";

export type OverallAssessment =
  | NewsAssessmentLabel
  | ImageAssessmentTier
  | DocumentAssessmentTier;

export interface ConfidenceInterval {
  low: number; // e.g., 64
  high: number; // e.g., 81
  uncertaintyNote: string;
}

export interface ModelSignal {
  modelName: string;
  modality: string;
  signalLabel: string;
  scoreRange: string;
  status: "nominal" | "caution" | "elevated" | "neutral";
  detail: string;
}

export interface EvidenceRow {
  id: string;
  category: string;
  finding: string;
  polarity: "supporting" | "contradicting" | "neutral";
  sourceOrModule: string;
  weight: "High" | "Moderate" | "Low";
}

export interface SourceReference {
  id: string;
  sourceName: string;
  title: string;
  publicationDate: string;
  url: string;
  stance: "Supporting" | "Contradicting" | "Contextual";
  excerpt: string;
  isPrototypeReference: boolean;
}

export interface ImageMetadataInfo {
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  dimensions: string;
  sha256: string;
  exifStatus: string;
  cameraOrSoftware: string;
  c2paManifest: string;
}

export interface ImageAnalysisPayload {
  previewUrl: string;
  metadata: ImageMetadataInfo;
  manipulationIndicators: {
    indicator: string;
    severity: "Low" | "Moderate" | "Elevated";
    observation: string;
  }[];
  visualConsistencyFindings: string[];
  aiGenerationIndicators: {
    signal: string;
    observation: string;
    level: "Low" | "Moderate" | "Elevated";
  }[];
}

export interface ExtractedClaim {
  id: string;
  claimText: string;
  assessment: NewsAssessmentLabel;
  rationale: string;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  sources: SourceReference[];
}

export interface NewsAnalysisPayload {
  inputMode: "url" | "claim";
  submittedUrl?: string;
  submittedClaim: string;
  headline?: string;
  publisherDomain?: string;
  extractedClaims: ExtractedClaim[];
}

export interface DocumentMetadataInfo {
  fileName: string;
  fileSizeBytes: number;
  pageCount: number;
  sha256: string;
  author: string;
  producer: string;
  createdDate: string;
  modifiedDate: string;
}

export interface DocumentAnalysisPayload {
  previewUrl?: string;
  metadata: DocumentMetadataInfo;
  extractedText: string;
  keyClaims: {
    id: string;
    pageNumber: number;
    statement: string;
    verificationStatus: NewsAssessmentLabel;
    note: string;
  }[];
  comparisonFindings: string[];
}

export interface Investigation {
  id: string;
  type: InvestigationType;
  title: string;
  summary: string;
  createdAt: string;
  status: InvestigationStatus;
  overallAssessment: OverallAssessment;
  confidence: ConfidenceInterval;
  explanation: string;
  limitations: string[];
  modelFindings: ModelSignal[];
  evidenceTable: EvidenceRow[];
  sourceReferences: SourceReference[];
  isMockSimulation: boolean;
  imagePayload?: ImageAnalysisPayload;
  newsPayload?: NewsAnalysisPayload;
  documentPayload?: DocumentAnalysisPayload;
}

export interface ActivityMetricPoint {
  date: string;
  image: number;
  news: number;
  document: number;
  total: number;
}

export interface ImageAnalysisRequest {
  file: File;
  dimensions?: string;
  sha256: string;
  previewUrl: string;
  sampleKey?: "urban_rain" | "glass_pavilion";
}

export interface NewsAnalysisRequest {
  url?: string;
  claimText: string;
}

export interface DocumentAnalysisRequest {
  file?: File;
  sampleKey?: "climate_brief" | "financial_filing";
  sha256: string;
  previewUrl?: string;
  fileName: string;
  fileSizeBytes: number;
  extractedPreviewText?: string;
}
