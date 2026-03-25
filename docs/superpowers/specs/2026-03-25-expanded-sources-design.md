# Expanded Sources & Lists Pages — Design Spec

**Date:** 2026-03-25
**Status:** Approved

---

## Overview

Expand JacketList's bestseller data from 3 sources (NYT, Guardian, Goodreads) to 7 sources by adding Amazon, USA Today, Publishers Weekly, and Audible. Add per-source list pages for SEO. Tighten the homepage to a curated Top 10 with a compact "Also trending" tail (books 11–25).

---

## 1. Data Architecture

**Approach:** Separate source files + merged output (Option B).

```
src/data/
├── sources/
│   ├── nyt.json
│   ├── guardian.json
│   ├── goodreads.json
│   ├── amazon.json
│   ├── usatoday.json
│   ├── publishersweekly.json
│   └── audible.json
└── bestsellers.json        ← merged/scored output, unchanged shape
```

### Source file schema
Each source file holds exactly 10 books:
```json
{
  "source": "amazon",
  "label": "Amazon Bestsellers",
  "url": "https://www.amazon.com/charts/mostread",
  "updated": "2026-03-25",
  "books": [
    {
      "position": 1,
      "title": "Book Title",
      "author": "Author Name",
      "cover_url": "https://covers.openlibrary.org/...",
      "amazon_url": "https://www.amazon.com/s?k=...&tag=jacketlist-20"
    }
  ]
}
```

### bestsellers.json
Unchanged shape. CoWork merges all 7 source files into it weekly — scoring, deduplicating, and selecting the top 25 by score + tiebreaker. Books beyond 25 are discarded.

---

## 2. Scoring System

### Source score (count of sources the book appears in)
| Score | Badge | Label |
|-------|-------|-------|
| 5–7 | 🔥 | Top Pick |
| 3–4 | ⬆️ | Trending |
| 1–2 | 👀 | Worth Watching |

### Tiebreaker (computed at build time, not stored)
Used to sort books within the same score tier:

```
position_score  = 11 - avg(position across all sources where book appears)  → range 1–10
longevity_score = min(weeks_on_list, 10)                                     → range 1–10
tiebreaker      = (position_score + longevity_score) / 2
```

### scoring.js changes
- `scoreBadge(score)` — updated thresholds (5–7 / 3–4 / 1–2)
- `computeTiebreaker(book)` — new export; takes a book object with `sources_positions` (array of positions) and `weeks_on_list`, returns composite tiebreaker score

### Homepage sort
`score desc → tiebreaker desc`

---

## 3. Individual Source Pages + Lists Hub

### `/lists` — Hub page
- Lists all 7 sources as cards (source name, one-line description, "See list →" link)
- Linked from the main Nav alongside "Series"

### `/lists/[source]` — Per-source page
One static page per source, generated at build time via `generateStaticParams` reading the 7 source files.

Each page contains:
1. Source name + attribution line (e.g. "As seen on the NYT Bestseller List")
2. Top 10 books as BookCards — no score badge (raw ranked list, not scored)
3. "See our full merged Top 10 →" link back to homepage
4. FooterAdZone + Footer

The `[source]` slug matches the filename: `nyt`, `amazon`, `guardian`, `goodreads`, `usatoday`, `publishersweekly`, `audible`.

**No new components required** — BookCard handles the layout. A `SourceListPage` layout component maps over the 10 books in rank order.

---

## 4. Homepage Changes

### Top 10 (BookCards)
`page.jsx` slices the sorted books array to the first 10. Passed to `HomeContent` as the `books` prop. Full BookCard layout, unchanged.

### Books 11–25 (compact text list)
A second slice (indices 10–24) passed as a new `alsoTrending` prop to `HomeContent`. Rendered below the Top 10 grid as a simple `<ol>` with a "Also trending this week" heading.

Each row contains:
- Rank number
- Title
- Author
- Score badge emoji (🔥 / ⬆️ / 👀)
- "Buy →" Amazon affiliate link

No cover image, no card shell. Lean ranked list that doesn't compete visually with the Top 10.

### Nav
Add "Lists" link to `Nav.jsx` pointing to `/lists`.

---

## 5. CoWork Changes

The `cowork/bestseller-prompt.md` must be updated to:
- Collect top 10 from all 7 sources and write them to the 7 individual source files
- Merge into `bestsellers.json` (top 25 by score + tiebreaker)
- Use the new `sources_positions` field per book (array of `{source, position}` objects) so `computeTiebreaker` can calculate avg position

### New `sources_positions` field in bestsellers.json books
```json
"sources_positions": [
  { "source": "nyt", "position": 1 },
  { "source": "amazon", "position": 3 }
]
```

---

## Edge Cases

- **Fewer than 25 unique books:** If the 7 lists produce fewer than 25 unique titles after deduplication, `bestsellers.json` contains however many exist. The homepage renders whatever is available (up to 10 for Top 10, up to 15 for the tail).
- **Book appears in fewer than all sources:** Normal — `score` is simply the count of sources it appears in. A book only on Audible scores 1.

---

## Out of Scope

- Filtering or sorting the source list pages
- Showing source-specific data on BookCards on the homepage
- Storing historical source data
