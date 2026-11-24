import type {
  DocumentAnalysisRequest,
  ImageAnalysisRequest,
  Investigation,
  NewsAnalysisRequest,
} from "@/src/types/investigation";

/**
 * Configure NEXT_PUBLIC_FASTAPI_URL when connecting the external Python FastAPI backend.
 * When unset, requests route directly to VerityAI's Next.js API Route Handlers (/api/*).
 */
const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "";

export type ProgressCallback = (stepLabel: string, percent: number) => void;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function apiUrl(path: string): string {
  return FASTAPI_BASE_URL ? `${FASTAPI_BASE_URL}${path}` : path;
}

export const verityApiClient = {
  isLiveBackendConnected(): boolean {
    return Boolean(FASTAPI_BASE_URL);
  },

  async listInvestigations(): Promise<Investigation[]> {
    const response = await fetch(apiUrl("/api/investigations"));
    if (!response.ok) throw new Error("Failed to fetch investigations.");
    return response.json();
  },

  async getInvestigationById(id: string): Promise<Investigation | undefined> {
    const response = await fetch(apiUrl(`/api/investigations/${encodeURIComponent(id)}`));
    if (!response.ok) return undefined;
    return response.json();
  },

  async analyzeImage(
    request: ImageAnalysisRequest,
    onProgress?: ProgressCallback
  ): Promise<Investigation> {
    onProgress?.("Reading image container & EXIF / C2PA headers", 25);
    await delay(260);
    onProgress?.("Submitting payload to verification API", 58);

    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("dimensions", request.dimensions || "");
    formData.append("sha256", request.sha256);
    if (request.sampleKey) {
      formData.append("sampleKey", request.sampleKey);
    }

    const response = await fetch(apiUrl("/api/investigations/image"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Image verification request failed (${response.status})`);
    }

    onProgress?.("Aggregating uncertainty bounds & assembling report", 95);
    const data = (await response.json()) as Investigation;
    if (data.imagePayload && request.previewUrl) {
      data.imagePayload.previewUrl = request.previewUrl;
    }
    onProgress?.("Complete", 100);
    return data;
  },

  async analyzeNewsOrClaim(
    request: NewsAnalysisRequest,
    onProgress?: ProgressCallback
  ): Promise<Investigation> {
    onProgress?.("Normalizing submitted URL and claim statements", 25);
    await delay(240);
    onProgress?.("Decomposing assertions & checking evidence index", 65);

    const endpoint = request.url ? "/api/investigations/news" : "/api/investigations/text";
    const response = await fetch(apiUrl(endpoint), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Claim verification request failed (${response.status})`);
    }

    onProgress?.("Compiling cited rationale & uncertainty statement", 100);
    return response.json();
  },

  async analyzeDocument(
    request: DocumentAnalysisRequest,
    onProgress?: ProgressCallback
  ): Promise<Investigation> {
    onProgress?.("Parsing PDF binary structure & SHA-256 fingerprint", 28);
    await delay(240);
    onProgress?.("Extracting text & auditing key claims", 68);

    const formData = new FormData();
    if (request.file) {
      formData.append("file", request.file);
    }
    formData.append("fileName", request.fileName);
    formData.append("fileSizeBytes", String(request.fileSizeBytes));
    formData.append("sha256", request.sha256);
    if (request.sampleKey) {
      formData.append("sampleKey", request.sampleKey);
    }

    const response = await fetch(apiUrl("/api/investigations/document"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Document verification request failed (${response.status})`);
    }

    const data = (await response.json()) as Investigation;
    if (data.documentPayload && request.previewUrl) {
      data.documentPayload.previewUrl = request.previewUrl;
    }
    onProgress?.("Finalizing document intelligence report", 100);
    return data;
  },
};
