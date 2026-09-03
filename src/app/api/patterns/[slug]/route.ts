import { NextResponse } from "next/server";
import { getPatternBySlug, toPatternDetailDTO } from "@/lib/content";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET /api/patterns/[slug]
// Returns a single published + approved pattern by slug, including its
// category, tags, and guidelines. Reads from /content/ — no DB needed.
export const dynamic = "force-static";

export async function GET(_req: Request, ctx: RouteContext): Promise<Response> {
  try {
    const { slug } = await ctx.params;

    const pattern = getPatternBySlug(slug);
    if (!pattern || !pattern.published || pattern.moderationStatus !== "approved") {
      return NextResponse.json(
        { error: "Pattern not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(toPatternDetailDTO(pattern));
  } catch (err) {
    console.error("[GET /api/patterns/[slug]] failed:", err);
    return NextResponse.json(
      { error: "Failed to load pattern" },
      { status: 500 },
    );
  }
}
