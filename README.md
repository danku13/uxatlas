# Mobile UX Patterns Atlas

A portal for **product managers** and **UX designers** that visualizes mobile UX patterns organized by **user drop-off points** — where users leave because of complexity, errors, or confusion.

> Built by **Daniel Kuzmichev** ([@danku13](https://t.me/danku13))

## Why

Most UX pattern libraries group patterns by component type (forms, navigation, etc.). This atlas groups them by **where users actually drop off** — the moments that cost you retention and revenue. Each pattern ships with an interactive demo and design guidelines from Material, Apple HIG, and Nielsen Norman.

## What's inside

- **10 drop-off categories** (onboarding, auth, search, forms, checkout, errors, empty states, loading, notifications, settings)
- **71 interactive HTML/CSS phone mockups** — each is a live, clickable demo, not a screenshot
- **~135 design guidelines** as hints (Material Design, Apple HIG, Nielsen Norman)
- **Catalog** with filters (category, severity, platform, tags) + full-text search
- **Detail dialog** with phone preview + problem/solution/pros/cons/use-cases/guidelines
- **Dark/light theme**, fully responsive (mobile-first)

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript 5**
- **Tailwind CSS 4** + shadcn/ui (New York)
- **Markdown + YAML frontmatter** for content (gray-matter)
- **Prisma ORM + SQLite** (optional — only for pattern submissions)
- TanStack Query v5
- next-themes (dark/light)
- Framer Motion (animations)

## Content architecture

The canonical content lives in `/content/` as Markdown files with YAML frontmatter — version-controlled, human-editable, and rendered nicely on GitHub.

```
content/
├── README.md                  # documentation + template for new patterns
├── categories.json            # 10 drop-off categories
├── tags.json                  # 10 tags (filters)
└── patterns/                  # 71 Markdown files, one per pattern
    ├── value-first-carousel.md
    ├── permission-priming.md
    └── ... (69 more)
```

Each pattern Markdown file has:
- **Frontmatter (YAML)**: slug, title, category, mockupType, severity, author, tags[], platforms[], published, moderationStatus, mockupConfig
- **Body (Markdown)**: summary (blockquote), Описание, Проблема, Решение, Плюсы (list), Минусы (list), Когда использовать (list), Принципы и гайдлайны (### subsections)

See [`content/README.md`](content/README.md) for the full template and workflow.

## Getting started

```bash
# Install dependencies
bun install

# (Optional) Set up the SQLite database — only needed for pattern submissions.
# Reads (catalog, search, detail pages) work without it via /content/.
bun run db:push       # apply schema
bun run db:seed       # seed DB from /content/ Markdown files

# Start dev server
bun run dev
```

Open `http://localhost:3000` — the catalog is on the homepage at `#patterns`.

### Fresh clone setup

```bash
git clone https://github.com/danku13/uxatlas.git
cd uxatlas
bun install
bun run dev            # that's it — reads directly from /content/
```

No database required for read-only usage. The Markdown files in `/content/` are the source of truth.

## Project structure

```
content/                       # canonical content (Markdown + JSON)
├── categories.json
├── tags.json
├── README.md                  # template + workflow docs
└── patterns/                  # 71 Markdown files (one per pattern)

prisma/
  schema.prisma                # Category, Pattern, Tag, PatternTag, Guideline
  seed.ts                      # reads /content/ → fills DB (optional, for submissions)

scripts/
  export-db-to-content.ts      # DB → Markdown (one-time migration tool)

src/
  app/
    api/                       # REST endpoints — read from /content/, no DB
      categories/route.ts
      tags/route.ts
      patterns/route.ts        # GET list + POST submit
      patterns/[slug]/route.ts
      patterns/featured/route.ts
    page.tsx                   # homepage (hero + categories + catalog)
    layout.tsx                 # ThemeProvider + QueryProvider + fonts
  components/
    home/                      # hero, categories grid (server components)
    patterns/                  # catalog client, cards, filters, detail dialog
    phone/                     # PhoneFrame + MockupRenderer registry
      mockups/                 # 71 interactive mockup components
    submit/                    # public pattern submission form
    ui/                        # shadcn/ui component library
  lib/
    content.ts                 # reads /content/ Markdown files → typed data
    db.ts                     # Prisma client (optional, for submissions)
    types.ts                  # shared DTO types
```

## How reads work (no database needed)

```
content/*.md  ──>  src/lib/content.ts  ──>  API routes & server components
```

The `src/lib/content.ts` module reads Markdown files from `/content/` directly — no Prisma, no SQLite, no HTTP fetch. This works on Vercel, serverless, and any Node environment.

API routes (`/api/categories`, `/api/tags`, `/api/patterns`, `/api/patterns/[slug]`) all use this module — they're stateless and serverless-friendly.

## How submissions work (need a database)

Pattern submissions via the in-app form require persistent storage. To enable:

1. Set up a database (SQLite locally, or PostgreSQL/MySQL for production)
2. Run `bun run db:push` to apply the Prisma schema
3. Run `bun run db:seed` to populate from `/content/`
4. POST `/api/patterns` will save new patterns with `moderationStatus='pending'`

Without a database configured, POST returns 503 with a clear message.

## Adding a new pattern

1. Create a new `.md` file in `content/patterns/{your-slug}.md`.
2. Use the template in [`content/README.md`](content/README.md).
3. (Optional) Run `bun run db:seed` to sync to the database.
4. Refresh the page — your pattern appears in the catalog.

## Deploying to Vercel

The app deploys cleanly to Vercel with no extra configuration:

1. Push to GitHub
2. Import the repo in Vercel
3. Deploy — no environment variables needed for reads

Reads work via `/content/` Markdown files bundled into the deployment. Pattern submissions won't work without configuring a real database (see "How submissions work" above).

## License

MIT — feel free to learn from, fork, and reuse.
