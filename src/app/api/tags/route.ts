import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { TagDTO } from "@/lib/types";

// GET /api/tags
// Returns all tags ordered by name, each with the count of approved +
// published patterns that use it.
export async function GET(): Promise<Response> {
  try {
    const tags = await db.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            patterns: {
              where: {
                pattern: {
                  published: true,
                  moderationStatus: "approved",
                },
              },
            },
          },
        },
      },
    });

    const out: TagDTO[] = tags.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      patternCount: t._count.patterns,
    }));

    return NextResponse.json(out);
  } catch (err) {
    console.error("[GET /api/tags] failed:", err);
    return NextResponse.json(
      { error: "Failed to load tags" },
      { status: 500 },
    );
  }
}
