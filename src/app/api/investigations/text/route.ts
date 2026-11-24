import { NextResponse } from "next/server";
import { buildSimulatedNewsInvestigation } from "@/src/services/prototypeEngine";
import type { NewsAnalysisRequest } from "@/src/types/investigation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<NewsAnalysisRequest>;
    const claimText = (body.claimText || "").trim();

    if (!claimText) {
      return NextResponse.json(
        { error: "Claim text is required." },
        { status: 400 }
      );
    }

    const result = buildSimulatedNewsInvestigation({
      claimText,
      url: body.url,
    });

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process text claim verification request." },
      { status: 500 }
    );
  }
}
