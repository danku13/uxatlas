# Mobile UX Patterns Atlas

A portal for **product managers** and **UX designers** that visualizes mobile UX patterns organized by **user drop-off points** — where users leave because of complexity, errors, or confusion.

> Built by **Daniel Kuzmichev** ([@danku13](https://t.me/danku13))

## Why

Most UX pattern libraries group patterns by component type (forms, navigation, etc.). This atlas groups them by **where users actually drop off** — the moments that cost you retention and revenue. Each pattern ships with an interactive demo and design guidelines from Material, Apple HIG, and Nielsen Norman.

## What's inside

- **10 drop-off categories** (onboarding, auth, search, forms, checkout, errors, empty states, loading, notifications, settings)
- **31 interactive HTML/CSS phone mockups** — each is a live, clickable demo, not a screenshot
- **~60 design guidelines** as hints (Material Design, Apple HIG, Nielsen Norman)
- **Catalog** with filters (category, severity, platform, tags) + full-text search
- **Public submission form** with 5-step wizard and live mockup preview
- **Detail dialog** with phone preview + problem/solution/pros/cons/use-cases/guidelines
- **Dark/light theme**, fully responsive (mobile-first)

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui (New York)
- Prisma ORM + SQLite
- TanStack Query v5
- next-themes (dark/light)
- Framer Motion (animations)

## Getting started

```bash
# Install dependencies
bun install

# Set up the database (SQLite is file-based, runs out of the box)
cp .env.example .env  # if you have one, otherwise defaults work
bun run db:push       # apply schema
bun prisma/seed.ts    # seed 31 patterns + guidelines

# Start dev server
bun run dev
```

Open `http://localhost:3000` — the catalog is on the homepage at `#patterns`.

## Project structure

```
prisma/
  schema.prisma        # Category, Pattern, Tag, PatternTag, Guideline
  seed.ts              # 31 patterns with full data + ~60 guidelines
src/
  app/
    api/               # REST endpoints (patterns, categories, tags)
    page.tsx           # homepage (hero + categories + catalog)
    layout.tsx        # ThemeProvider + QueryProvider + fonts
  components/
    home/              # hero, categories grid
    patterns/          # catalog client, cards, filters, detail dialog
    phone/             # PhoneFrame + MockupRenderer registry
      mockups/         # 31 interactive mockup components
    submit/            # public pattern submission form
    ui/                # shadcn/ui component library
  lib/
    db.ts              # Prisma client singleton
    types.ts           # shared DTOs + JSON parse helpers
```

## Adding a new pattern

Patterns are seeded via `prisma/seed.ts`. Each pattern has:

- `slug`, `title`, `summary`, `description`
- `problemStatement` (why users drop off here)
- `solution` (how this pattern addresses it)
- `pros` / `cons` / `useCases` (string arrays)
- `mockupType` (key matching a component in `mockup-registry.tsx`)
- `mockupConfig` (JSON config for that mockup)
- `platforms` (ios, android, or both)
- `severity` (high, medium, low — drop-off risk)
- `guidelines` (Material / HIG / Nielsen hints)

You can also submit patterns via the in-app form (button in the header). Submitted patterns go to a moderation queue (`moderationStatus='pending'`).

## License

MIT — feel free to learn from, fork, and reuse.
