import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CategoryDTO } from "@/lib/types";

// GET /api/categories
// Returns all categories ordered by `order`, each with the count of
// published + approved patterns. Useful for the portal's primary nav.
export async function GET(): Promise<Response> {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            patterns: {
              where: {
                published: true,
                moderationStatus: "approved",
              },
            },
          },
        },
      },
    });

    const out: CategoryDTO[] = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      accent: c.accent,
      order: c.order,
      patternCount: c._count.patterns,
    }));

    return NextResponse.json(out);
  } catch (err) {
    console.error("[GET /api/categories] failed:", err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}
