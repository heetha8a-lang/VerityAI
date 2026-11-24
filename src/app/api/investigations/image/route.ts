import { NextResponse } from "next/server";
import { buildSimulatedImageInvestigation } from "@/src/services/prototypeEngine";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const dimensions = String(formData.get("dimensions") || "");
    const sha256 = String(formData.get("sha256") || "");
    const sampleKeyRaw = formData.get("sampleKey");
    const sampleKey =
      sampleKeyRaw === "urban_rain" || sampleKeyRaw === "glass_pavilion"
        ? sampleKeyRaw
        : undefined;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required in multipart form field 'file'." },
        { status: 400 }
      );
    }

    const result = buildSimulatedImageInvestigation({
      fileName: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
      dimensions: dimensions || undefined,
      sha256: sha256 || "server-hash-pending",
      sampleKey,
    });

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process image verification request." },
      { status: 500 }
    );
  }
}
