# Read Next — Design Spec
**Date:** 2026-04-05

---

## Overview

A curated "Read Next" feature: an evergreen list of editorially recommended books, sourced from 6 publications (NYT Notable Books, Book Riot, Esquire, GQ/Vogue, The Guardian, Oprah's Book Club, Paste Magazine), updated monthly with 2–3 new additions. Source attribution is deferred — the data structure supports it but nothing is disclosed to users at launch.

Two surfaces:
1. **Homepage teaser** — top 4 books by score, between Weekly Bestsellers and Popular Series
2. **`/read-next` page** — full list with genre pills + "New this month" toggle

---

## Data: `src/data/read-next.json`

```json
{
  "updated": "2026-04-05",
  "books": [
    {
      "id": "intermezzo",
      "title": "Intermezzo",
      "author": "Sally Rooney",
      "cover_url": "https://covers.openlibrary.org/b/id/...-M.jpg",
      "description": "Two grieving brothers, a chess prodigy and a lawyer, navigate love and loss in Rooney's most ambitious novel yet.",
      "genres": ["Literary Fiction"],
      "sources": ["nyt", "book-riot", "guardian", "esquire"],
      "score": 4,
      "added_date": "2026-04-01",
      "amazon_url": "https://www.amazon.com/s?k=Intermezzo+Rooney&tag=jacketlist-20",
      "series_id": null
    }
  ]
}
```

**Field reference:**

| Field | Type | Notes |
|---|---|---|
| `id` | string | URL-safe slug |
| `title` | string | Book title |
| `author` | string | Author name(s) |
| `cover_url` | string | Open Library URL or placeholder |
| `description` | string | One-to-two sentence editorial hook |
| `genres` | string[] | Match genre vocabulary from `series.json` |
| `sources` | string[] | Source slugs — not displayed at launch, ready for future disclosure |
| `score` | number | Count of sources recommending it (1–6+) |
| `added_date` | string | ISO date (YYYY-MM-DD); used for "New this month" badge and tiebreaking |
| `amazon_url` | string | Amazon Associates search link |
| `series_id` | string \| null | If set, links to `/series/[id]`; null for standalone books |

**Score badges:** Same thresholds as `bestsellers.json` — 🔥 5+, ⬆️ 3–4, 👀 1–2.

**Sort order:** `score` desc, tiebroken by `added_date` desc (newest wins ties). Applied consistently on both homepage teaser and full page.

**"New this month":** Any book where `added_date` falls within the current calendar month.

---

## Homepage Teaser

New section in `HomeContent.jsx`, positioned between **Weekly Bestsellers** and **Popular Series**.

- **Heading:** "Read Next"
- **Subheading:** "Editorially curated — updated monthly."
- Renders top 4 books (score desc → added_date desc) as `BookCard` components with `showScore={false}`
- `✨ New` badge on any book where `added_date` is in the current calendar month (reuses `isNewRelease` logic pattern — compare month+year, not a 6-month window)
- **"See all recommendations →"** link to `/read-next` below the grid
- Hidden when homepage search query is active (same behaviour as "Also trending" compact list)
- `seriesMap` passed through so series badge renders if `series_id` is set

---

## `/read-next` Page

### New Files

| Path | Type | Purpose |
|---|---|---|
| `src/app/read-next/page.jsx` | Server component | Imports `read-next.json`, renders page shell |
| `src/app/read-next/ReadNextContent.jsx` | Client component | Owns genre + "New this month" filter state |

### `ReadNextContent` Filter Bar

- **Genre pills:** All (clears filters) + one pill per unique genre in the data, sorted alphabetically. Multi-select — active genres use `bg-secondary text-on-secondary`, inactive use `bg-surface-container-high text-on-surface-variant`.
- **"✨ New this month" pill:** Independent toggle. When active, only books with `added_date` in the current calendar month are shown.
- Filters AND together: genre filter AND new-this-month filter both apply simultaneously.
- "No results for these filters." message when filtered set is empty.

### Page Structure

1. **Heading:** "Read Next"
2. **Subheading:** "Editorially curated picks, updated monthly."
3. Filter bar (genre pills + New this month toggle)
4. `BookCard` grid — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `showScore={false}`
5. `FooterAdZone` + `Footer`

---

## Nav Update

`Nav.jsx` gets a fourth link: **Read Next** → `/read-next`, positioned after "Adaptations". Same className as existing nav links.

---

## `HomeContent.jsx` Changes

- Accept new `readNext` prop (array of book objects, pre-sorted top 4)
- Add "Read Next" section between bestsellers and series sections
- "New this month" detection: `new Date(book.added_date).getMonth() === new Date().getMonth() && new Date(book.added_date).getFullYear() === new Date().getFullYear()`
- Section hidden when `query` is active

## `src/app/page.jsx` Changes

- Import `readNextData` from `@/data/read-next.json`
- Sort and slice top 4, pass as `readNext` prop to `HomeContent`

---

## Out of Scope (v1)

- Source attribution / disclosure UI
- User-facing "updated on [date]" per-book provenance
- Pagination (list stays under ~20 books for now)
- Separate archive of past monthly additions
- Ratings or user voting
