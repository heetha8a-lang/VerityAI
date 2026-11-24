import { NextResponse } from "next/server";
import { INITIAL_MOCK_INVESTIGATIONS } from "@/src/mocks/investigations";

export async function GET() {
  return NextResponse.json(INITIAL_MOCK_INVESTIGATIONS);
}
