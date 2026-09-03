# Content

This directory holds the **canonical content** of the UX Patterns Atlas —
the patterns, categories, and tags that power the catalog. The SQLite
database (`db/custom.db`) is regenerated from these files on every
`bun prisma/seed.ts`, so anything committed here is what users see on the
site.

## Structure

```
content/
├── categories.json              10 drop-off categories
├── tags.json                    10 tags (filters)
└── patterns/                    one Markdown file per pattern
    ├── value-first-carousel.md
    ├── permission-priming.md
    └── ... (71 files total)
```

## How to add a new pattern

1. Create a new `.md` file in `content/patterns/{your-slug}.md`.
2. Use the template below.
3. Run `bun prisma/seed.ts` to load it into the database.
4. Refresh the page — your pattern appears in the catalog.

### Markdown template

```markdown
---
slug: my-new-pattern
title: My New Pattern
category: onboarding                    # must exist in categories.json
mockupType: onboarding-carousel         # must exist in mockup-registry.tsx
severity: high                          # high | medium | low
author: My Company
tags:                                    # must exist in tags.json
  - high-dropoff
  - clarity
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "slides": [{ "title": "Hello" }]
  }
---

> Short one-line summary that appears in cards and list views.

## Описание

Full description of the pattern — what it is, how it works.

## Проблема

Why users drop off here without this pattern.

## Решение

How this pattern addresses the problem.

## Плюсы

- First benefit
- Second benefit

## Минусы

- First drawback
- Second drawback

## Когда использовать

- Use case 1
- Use case 2

## Принципы и гайдлайны

### Title of the guideline

**Источник:** \`material\`

Body of the guideline — what Material/HIG/Nielsen says about this.

### Another guideline

**Источник:** \`nielsen\`

Body of the second guideline.
```

### Required fields (frontmatter)

| Field             | Type                  | Description                              |
| ----------------- | --------------------- | ---------------------------------------- |
| `slug`            | string                | URL-safe identifier                      |
| `title`           | string                | Display title                            |
| `category`         | string                | Must match a slug in `categories.json`   |
| `mockupType`      | string                | Must match a key in `mockup-registry.tsx`|
| `severity`        | `high`/`medium`/`low` | Drop-off risk level                      |
| `author`          | string                | Source attribution                       |
| `tags`            | string[]              | Must match slugs in `tags.json`          |
| `platforms`       | string[]              | `ios`, `android`, or both                |
| `published`       | boolean               | Show in catalog?                         |
| `moderationStatus`| string                | `approved`, `pending`, `rejected`       |
| `mockupConfig`    | object                | JSON config passed to the mockup component |

### Required sections (body)

| Section                  | Purpose                                |
| ------------------------ | -------------------------------------- |
| `> Summary` (blockquote) | Card summary, ~1 sentence              |
| `## Описание`            | Full description                       |
| `## Проблема`            | Why users drop off                     |
| `## Решение`             | How the pattern addresses it          |
| `## Плюсы` (list)        | Benefits                               |
| `## Минусы` (list)       | Drawbacks                              |
| `## Когда использовать`  | Use cases                              |
| `## Принципы и гайдлайны`| Design guidelines from Material/HIG/Nielsen |

## How to add a category

Edit `categories.json`:

```json
[
  {
    "slug": "new-category",
    "name": "New Category",
    "description": "Where users drop off here.",
    "icon": "AlertTriangle",
    "accent": "amber",
    "order": 11
  }
]
```

`icon` must be a `lucide-react` icon name. `accent` must be one of:
`amber`, `rose`, `emerald`, `teal`, `orange`, `red`, `violet`, `sky`,
`pink`, `slate`.

## How to add a tag

Edit `tags.json`:

```json
[
  { "slug": "new-tag", "name": "New Tag" }
]
```

## Workflow

```
content/*.md  ──>  bun prisma/seed.ts  ──>  db/custom.db  ──>  Next.js app
   (source)         (parser + writer)        (cache)            (runtime)
```

- **Edit** Markdown files in `/content/` — they are version-controlled.
- **Run** `bun prisma/seed.ts` to regenerate the database.
- **Restart** dev server (or it auto-reloads via hot reload).

The database file (`db/custom.db`) is gitignored — it's a build artifact.
The Markdown files in `/content/` are the source of truth.
