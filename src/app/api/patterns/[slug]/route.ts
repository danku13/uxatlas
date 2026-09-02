import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toPatternDetailDTO } from "@/lib/types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET /api/patterns/[slug]
// Returns a single published + approved pattern by slug, including its
// category, tags, and guidelines (ordered by source then createdAt).
export async function GET(_req: Request, ctx: RouteContext): Promise<Response> {
  try {
    const { slug } = await ctx.params;

    const pattern = await db.pattern.findFirst({
      where: {
        slug,
        published: true,
        moderationStatus: "approved",
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
        guidelines: true,
      },
    });

    if (!pattern) {
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
