# New Release Badge — Design Spec

**Date:** 2026-03-28
**Status:** Approved

---

## Goal

Surface when a series has a recently published book so readers can discover new entries without hunting for them. A "new" release is defined as published within the last 6 months of build time.

---

## Data Schema

Add an optional `latest_book` field to series entries in `src/data/series.json`:

```json
"latest_book": {
  "title": "Wind and Truth",
  "release_date": "2024-12-06"
}
```

- Field is optional — omit entirely for series with no recent release
- `release_date` is ISO 8601 date string (YYYY-MM-DD)
- CoWork updates this field when a new book drops

---

## Utility: `isNewRelease(release_date)`

Add to `src/utils/scoring.js`:

```js
export function isNewRelease(releaseDate) {
  if (!releaseDate) return false;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new Date(releaseDate) >= sixMonthsAgo;
}
```

- Uses build-time "today" — accurate given weekly rebuilds
- Returns `false` for missing or unparseable dates

---

## UI Changes

### SeriesCard (`src/components/SeriesCard.jsx`)

Show a `✨ New` chip in the genre chips row when `isNewRelease(series.latest_book?.release_date)` is true.

- Chip style: same pill shape as genre chips, distinct color (e.g., `bg-tertiary-container text-on-tertiary-container`)
- Positioned first in the chips row so it's immediately visible

### SeriesPage (`src/app/series/[id]/page.jsx`)

Add a second banner below the existing 🔥 bestseller banner:

```
✨ New release: [latest_book.title]
```

- Only shown when `isNewRelease` is true
- Styled similarly to the bestseller banner but with a distinct background (tertiary container)

### BookCard (`src/components/BookCard.jsx`)

BookCard already receives `seriesMap`. When `book.series_id` resolves to a series with a new release:

- Show a `✨ New` chip near the existing "📚 Part of a series" badge
- Use the same chip style as SeriesCard
- Silently omit if `series_id` is missing or series has no `latest_book`

---

## Scope

- No changes to routing, static generation, or CoWork prompts (CoWork will update `latest_book` naturally during series discovery passes)
- No new files — all changes are additions to existing files
- Badge logic is purely presentational; no new state required
