import { NextResponse } from "next/server";
import { getCategoriesDTO } from "@/lib/content";

// GET /api/categories
// Returns all categories ordered by `order`, each with the count of
// published + approved patterns. Reads directly from /content/ Markdown files —
// no database needed, works on serverless (Vercel).
export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  try {
    return NextResponse.json(getCategoriesDTO());
  } catch (err) {
    console.error("[GET /api/categories] failed:", err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}
