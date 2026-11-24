import { NextResponse } from "next/server";
import { INITIAL_MOCK_INVESTIGATIONS } from "@/src/mocks/investigations";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const item = INITIAL_MOCK_INVESTIGATIONS.find((inv) => inv.id === id);

  if (!item) {
    return NextResponse.json(
      { error: `Investigation "${id}" not found in prototype store.` },
      { status: 404 }
    );
  }

  return NextResponse.json(item);
}
