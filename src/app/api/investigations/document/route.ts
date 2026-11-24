import { NextResponse } from "next/server";
import { buildSimulatedDocumentInvestigation } from "@/src/services/prototypeEngine";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = String(
      formData.get("fileName") || (file instanceof File ? file.name : "")
    );
    const fileSizeBytes = Number(
      formData.get("fileSizeBytes") || (file instanceof File ? file.size : 0)
    );
    const sha256 = String(formData.get("sha256") || "server-hash-pending");
    const sampleKeyRaw = formData.get("sampleKey");
    const sampleKey = sampleKeyRaw === "climate_brief" ? "climate_brief" : undefined;

    if (!fileName) {
      return NextResponse.json(
        { error: "PDF file or sample identifier is required." },
        { status: 400 }
      );
    }

    const result = buildSimulatedDocumentInvestigation({
      fileName,
      fileSizeBytes,
      sha256,
      sampleKey,
    });

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process document analysis request." },
      { status: 500 }
    );
  }
}
