import { NextResponse } from "next/server";
import { getTagsDTO } from "@/lib/content";

// GET /api/tags
// Returns all tags ordered by name, each with the count of approved +
// published patterns that use it. Reads from /content/ — no DB needed.
export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  try {
    return NextResponse.json(getTagsDTO());
  } catch (err) {
    console.error("[GET /api/tags] failed:", err);
    return NextResponse.json(
      { error: "Failed to load tags" },
      { status: 500 },
    );
  }
}
