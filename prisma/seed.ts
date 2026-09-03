/**
 * Seed script — reads content from /content/ Markdown files.
 *
 * Source of truth: /content/ directory (Git-versioned Markdown + JSON).
 * Database is regenerated from these files on every `bun prisma/seed.ts`.
 *
 * Structure:
 *   content/
 *     categories.json       — 10 drop-off categories
 *     tags.json             — 10 tags
 *     patterns/{slug}.md    — one Markdown file per pattern (frontmatter + body)
 *
 * Each pattern Markdown file has:
 *   - YAML frontmatter: slug, title, category, mockupType, severity, author,
 *                       tags[], platforms[], published, moderationStatus, mockupConfig
 *   - Markdown body: summary (blockquote), description, problem, solution,
 *                    pros (list), cons (list), use cases (list),
 *                    guidelines (## sections with **Источник:** marker)
 *
 * To add a new pattern: drop a new .md file in content/patterns/ and re-run seed.
 */
import { db } from '../src/lib/db';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');
const PATTERNS_DIR = join(CONTENT_DIR, 'patterns');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  order: number;
};

type Tag = { slug: string; name: string };

type GuidelineSeed = {
  title: string;
  body: string;
  source: string;
};

type PatternSeed = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  problemStatement: string;
  solution: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  mockupType: string;
  mockupConfig: Record<string, unknown>;
  platforms: string[];
  severity: 'high' | 'medium' | 'low';
  authorName: string;
  published: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  categorySlug: string;
  tagSlugs: string[];
  guidelines: GuidelineSeed[];
};

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

function loadCategories(): Category[] {
  const raw = readFileSync(join(CONTENT_DIR, 'categories.json'), 'utf8');
  return JSON.parse(raw) as Category[];
}

function loadTags(): Tag[] {
  const raw = readFileSync(join(CONTENT_DIR, 'tags.json'), 'utf8');
  return JSON.parse(raw) as Tag[];
}

/** Parse Markdown body into structured fields. */
function parsePatternBody(body: string): {
  summary: string;
  description: string;
  problemStatement: string;
  solution: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  guidelines: GuidelineSeed[];
} {
  // Split into sections by ## headings
  const sections: { heading: string; content: string }[] = [];
  const lines = body.split('\n');
  let currentHeading = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      if (currentHeading || currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join('\n').trim(),
        });
      }
      currentHeading = headingMatch[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentHeading || currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join('\n').trim(),
    });
  }

  // Summary: first blockquote line (before any ##)
  const preSection = sections.find((s) => !s.heading);
  let summary = '';
  if (preSection) {
    const bqMatch = preSection.content.match(/^>\s*(.+)$/m);
    summary = bqMatch ? bqMatch[1].trim() : preSection.content.split('\n')[0].trim();
  }

  // Helper to get section content by heading
  const getSection = (name: string): string => {
    const s = sections.find((s) => s.heading.toLowerCase().includes(name.toLowerCase()));
    return s?.content ?? '';
  };

  // Helper to parse a list section (- item per line)
  const getList = (name: string): string[] => {
    const content = getSection(name);
    return content
      .split('\n')
      .map((l) => l.match(/^-\s+(.+)$/)?.[1]?.trim())
      .filter((s): s is string => Boolean(s));
  };

  // Guidelines: ### subsections under "Принципы и гайдлайны"
  const guidelinesSection = sections.find((s) =>
    s.heading.toLowerCase().includes('гайдлайн'),
  );
  const guidelines: GuidelineSeed[] = [];
  if (guidelinesSection) {
    // Split by ### subsections
    const subLines = guidelinesSection.content.split('\n');
    let currentTitle = '';
    let currentBody: string[] = [];
    let currentSource = '';
    const flush = () => {
      if (currentTitle) {
        // Remove the "**Источник:** `xxx`" line from body
        const bodyText = currentBody
          .join('\n')
          .replace(/\*\*Источник:\*\*\s*`?([^`]+)`?/i, (_m, src) => {
            currentSource = src.trim();
            return '';
          })
          .trim();
        guidelines.push({
          title: currentTitle,
          body: bodyText,
          source: currentSource || 'custom',
        });
      }
      currentTitle = '';
      currentBody = [];
      currentSource = '';
    };
    for (const line of subLines) {
      const subMatch = line.match(/^###\s+(.+)$/);
      if (subMatch) {
        flush();
        currentTitle = subMatch[1].trim();
      } else if (currentTitle) {
        currentBody.push(line);
      }
    }
    flush();
  }

  return {
    summary,
    description: getSection('описание'),
    problemStatement: getSection('проблем'),
    solution: getSection('решен'),
    pros: getList('плюс'),
    cons: getList('минус'),
    useCases: getList('использовать'),
    guidelines,
  };
}

function loadPatterns(): PatternSeed[] {
  const files = readdirSync(PATTERNS_DIR).filter((f) => f.endsWith('.md'));
  const patterns: PatternSeed[] = [];

  for (const file of files) {
    const raw = readFileSync(join(PATTERNS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const body = parsePatternBody(content);

    patterns.push({
      slug: data.slug,
      title: data.title,
      summary: body.summary,
      description: body.description,
      problemStatement: body.problemStatement,
      solution: body.solution,
      pros: body.pros,
      cons: body.cons,
      useCases: body.useCases,
      mockupType: data.mockupType,
      mockupConfig: (data.mockupConfig ?? {}) as Record<string, unknown>,
      platforms: data.platforms ?? [],
      severity: (data.severity ?? 'medium') as 'high' | 'medium' | 'low',
      authorName: data.author ?? 'Community',
      published: data.published ?? true,
      moderationStatus: (data.moderationStatus ?? 'approved') as
        | 'pending'
        | 'approved'
        | 'rejected',
      categorySlug: data.category,
      tagSlugs: data.tags ?? [],
      guidelines: body.guidelines,
    });
  }

  return patterns;
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Seeding database from /content/ ...');

  const categories = loadCategories();
  const tags = loadTags();
  const patterns = loadPatterns();

  console.log(
    `  loaded ${categories.length} categories, ${tags.length} tags, ${patterns.length} patterns`,
  );

  // 1. Categories
  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description || null,
        icon: c.icon || null,
        accent: c.accent || null,
        order: c.order,
      },
      create: {
        slug: c.slug,
        name: c.name,
        description: c.description || null,
        icon: c.icon || null,
        accent: c.accent || null,
        order: c.order,
      },
    });
  }
  console.log(`✓ ${categories.length} categories`);

  // 2. Tags
  for (const t of tags) {
    await db.tag.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: { slug: t.slug, name: t.name },
    });
  }
  console.log(`✓ ${tags.length} tags`);

  // 3. Clean existing patterns (and cascade)
  await db.patternTag.deleteMany();
  await db.guideline.deleteMany();
  await db.pattern.deleteMany();

  for (const p of patterns) {
    const category = await db.category.findUnique({
      where: { slug: p.categorySlug },
    });
    if (!category) {
      console.warn(`  ⚠ pattern "${p.slug}" has unknown category "${p.categorySlug}" — skipped`);
      continue;
    }

    const created = await db.pattern.create({
      data: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        description: p.description,
        problemStatement: p.problemStatement,
        solution: p.solution,
        pros: JSON.stringify(p.pros),
        cons: JSON.stringify(p.cons),
        useCases: JSON.stringify(p.useCases),
        mockupType: p.mockupType,
        mockupConfig: JSON.stringify(p.mockupConfig),
        platforms: JSON.stringify(p.platforms),
        severity: p.severity,
        authorName: p.authorName,
        published: p.published,
        moderationStatus: p.moderationStatus,
        categoryId: category.id,
      },
    });

    // tags
    for (const slug of p.tagSlugs) {
      const tag = await db.tag.findUnique({ where: { slug } });
      if (tag) {
        await db.patternTag.create({
          data: { patternId: created.id, tagId: tag.id },
        });
      }
    }

    // guidelines
    for (const g of p.guidelines) {
      await db.guideline.create({
        data: {
          title: g.title,
          body: g.body,
          source: g.source,
          patternId: created.id,
        },
      });
    }
  }
  console.log(`✓ ${patterns.length} patterns with tags and guidelines`);

  console.log('🌱 Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
