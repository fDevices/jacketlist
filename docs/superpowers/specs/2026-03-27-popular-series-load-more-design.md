# Popular Series — Load More Pagination

**Date:** 2026-03-27

## Problem

The Popular Series section on the homepage renders all 54 series at once. As the series catalog grows, this makes the page feel long and overwhelming.

## Solution

Add a "Load more" button that reveals series in batches of 12 after the initial 3 rows.

## Behavior

- Initial display: 12 cards (3 rows × 4 columns on desktop)
- A "Load more series" button appears below the grid when more remain
- Each click appends 12 more cards
- Button disappears once all matching series are visible
- `visibleCount` resets to 12 whenever the genre filter or search query changes

## Implementation

All changes are confined to `src/app/HomeContent.jsx`:

1. Add `visibleCount` state initialized to `12`
2. Slice `displayedSeries` to `visibleCount` before passing to the grid renderer
3. Reset `visibleCount` to `12` when `activeGenre` or `seriesQuery` changes
4. Render "Load more series" button below the grid when `displayedSeries.length > visibleCount`

No changes to `series.json`, `page.jsx`, `SeriesCard.jsx`, or any other file.

## Out of Scope

- Scroll-position preservation between loads (not needed at this scale)
- Breakpoint-aware batch sizes (fixed 12 is sufficient)
- Numbered pages or prev/next navigation
