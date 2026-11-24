import { NextResponse } from "next/server";
import { buildSimulatedNewsInvestigation } from "@/src/services/prototypeEngine";
import type { NewsAnalysisRequest } from "@/src/types/investigation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<NewsAnalysisRequest>;
    const claimText = (body.claimText || "").trim();
    const url = (body.url || "").trim();

    if (!claimText && !url) {
      return NextResponse.json(
        { error: "Provide an article URL or claim text." },
        { status: 400 }
      );
    }

    const result = buildSimulatedNewsInvestigation({
      url: url || undefined,
      claimText: claimText || `Evaluate article claims from ${url}`,
    });

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process news verification request." },
      { status: 500 }
    );
  }
}
