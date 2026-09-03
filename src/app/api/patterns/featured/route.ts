import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SEVERITY_RANK, toPatternDTO, type PatternDTO } from "@/lib/types";

// GET /api/patterns/featured
// Returns up to 6 high-severity patterns for the homepage hero. Falls back to
// medium-severity patterns if fewer than 6 high-severity patterns exist so the
// homepage never looks empty.
export async function GET(): Promise<Response> {
  try {
    const all = await db.pattern.findMany({
      where: {
        published: true,
        moderationStatus: "approved",
        severity: { in: ["high", "medium"] },
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Prefer high severity first, then medium as fallback.
    const sorted = all.sort((a, b) => {
      const sa = SEVERITY_RANK[a.severity] ?? 99;
      const sb = SEVERITY_RANK[b.severity] ?? 99;
      if (sa !== sb) return sa - sb;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const items: PatternDTO[] = sorted.slice(0, 6).map(toPatternDTO);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[GET /api/patterns/featured] failed:", err);
    return NextResponse.json(
      { error: "Failed to load featured patterns" },
      { status: 500 },
    );
  }
}
