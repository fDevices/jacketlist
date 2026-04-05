# Adaptations Page + Series Gaps — Design Spec
**Date:** 2026-04-05

---

## Overview

Two related deliverables:

1. **`/adaptations` page** — a new top-level section listing books (individual titles and series) that have been adapted into movies or TV shows, framed as "read before/after watching"
2. **`docs/series-gaps.md`** — a living checklist of ~25 notable series missing from `series.json`, organised by genre, to be added over time

---

## 1. Adaptations Page

### Goal

Help viewers discover the source books behind shows and films they love. Primary angle: "read the book before — or after — watching."

### Data: `src/data/adaptations.json`

New file. Structure:

```json
{
  "updated": "2026-04-05",
  "adaptations": [
    {
      "id": "gone-girl",
      "book_title": "Gone Girl",
      "author": "Gillian Flynn",
      "adaptation_title": "Gone Girl",
      "type": "movie",
      "genres": ["Thriller", "Mystery"],
      "hook": "If the film's unreliable narrators gripped you, the book cuts even deeper.",
      "cover_url": "https://covers.openlibrary.org/b/id/8397453-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Gone+Girl+Gillian+Flynn&tag=jacketlist-20",
      "series_id": null
    },
    {
      "id": "the-witcher",
      "book_title": "The Witcher",
      "author": "Andrzej Sapkowski",
      "adaptation_title": "The Witcher (Netflix)",
      "type": "tv",
      "genres": ["Fantasy"],
      "hook": "The show barely scratches the surface of Sapkowski's richly built world.",
      "cover_url": "https://covers.openlibrary.org/b/id/8479819-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=The+Last+Wish+Sapkowski&tag=jacketlist-20",
      "series_id": "the-witcher"
    }
  ]
}
```

**Field reference:**

| Field | Type | Notes |
|---|---|---|
| `id` | string | URL-safe slug |
| `book_title` | string | Title of the source book or series |
| `author` | string | Author name(s) |
| `adaptation_title` | string | Title of the adaptation (may differ from book) |
| `type` | `"movie"` \| `"tv"` | Used for type filter |
| `genres` | string[] | Used for genre filter; match genre vocabulary from `series.json` |
| `hook` | string | One-line "if you loved…" hook shown on the card |
| `cover_url` | string | Open Library URL or placeholder |
| `amazon_url` | string | Amazon Associates search link |
| `series_id` | string \| null | If set, links through to `/series/[id]`; null for standalone books |

### New Files

| Path | Type | Purpose |
|---|---|---|
| `src/app/adaptations/page.jsx` | Server component | Imports `adaptations.json`, passes data to `AdaptationsContent` |
| `src/app/adaptations/AdaptationsContent.jsx` | Client component | Owns filter state (type + genre) |
| `src/components/AdaptationCard.jsx` | Component | Renders a single adaptation entry |

### `AdaptationCard` Layout

Same dimensions, border-radius, shadow, and padding as `BookCard` and `SeriesCard`.

- Cover image — 2:3 portrait, full card width
- Type badge (top-left overlay): `🎬 Movie` or `📺 TV Series`
- Book title (Newsreader serif) + author (Inter, muted)
- Italic hook line
- If `series_id` is set: `📚 Full series →` link to `/series/[id]`
- "Buy on Amazon" button (`target="_blank"`, Amazon Associates tag)

### `AdaptationsContent` Filter Bar

Rendered above the card grid.

- **Type pills:** All · Movie · TV Series
- **Genre pills or dropdown:** derived from the unique genres present in `adaptations.json`
- Filters are AND'd: selecting TV + Fantasy shows only entries matching both
- "No results for these filters." message when the filtered set is empty

### Page Structure (`/adaptations`)

1. Heading: "Books Behind the Screen"
2. Subheading: "Read the book before — or after — watching"
3. Filter bar (type + genre)
4. Card grid — 1 col (mobile) → 2 col (tablet) → 3 col (desktop), same as rest of site
5. `FooterAdZone` + `Footer`

### Nav Update

`Nav.jsx` gets a third link: **Adaptations** → `/adaptations`, positioned after "Series".

### Styling

Follows all rules in `DESIGN.md`:
- No 1px borders, no dividers, no drop shadows at rest
- Hover: `0 12px 40px rgba(27,28,26,0.05)` ambient shadow
- Transitions: 300ms ease-in-out
- Type badge: pill style, `surface-variant` background, `on-surface-variant` text

---

## 2. Series Gaps Tracker

### File: `docs/series-gaps.md`

A living checklist of notable series missing from `series.json`, organised by genre. Each entry is a checkbox so it can be ticked off as series are added.

**Genres and series to include:**

**Thriller / Spy**
- Gabriel Allon (Daniel Silva) — 24-book spy thriller, consistently NYT #1
- Scot Harvath (Brad Thor) — 23 books
- Cotton Malone (Steve Berry) — 19 books
- Sigma Force (James Rollins) — 16 books
- Dirk Pitt (Clive Cussler) — 26 books, classic adventure thriller

**Crime / Mystery**
- Millennium / Girl with the Dragon Tattoo (Stieg Larsson)
- Vera (Ann Cleeves) — major TV adaptation
- Shetland (Ann Cleeves) — major TV adaptation
- Rivers of London / Peter Grant (Ben Aaronovitch) — urban fantasy/crime crossover
- Spenser (Robert B. Parker) — classic American PI, 40+ books
- Cadfael (Ellis Peters) — classic historical mystery

**Romance**
- Bridgerton (Julia Quinn) — Netflix adaptation, major gap
- In Death / J.D. Robb (Nora Roberts) — 58 books, long-running
- Virgin River (Robyn Carr) — 22 books, Netflix show
- Twisted (Ana Huang) — currently very popular

**Historical Fiction**
- Wolf Hall (Hilary Mantel) — Booker Prize winner
- Kingsbridge / Pillars of the Earth (Ken Follett) — major bestseller
- Sharpe (Bernard Cornwell) — more famous than Saxon Stories
- Hornblower (C.S. Forester) — classic naval fiction

**Literary Fiction**
- Neapolitan Novels (Elena Ferrante) — huge international bestseller

**Children's**
- Redwall (Brian Jacques) — 22 books, beloved classic
- A Series of Unfortunate Events (Lemony Snicket) — Netflix show
- How to Train Your Dragon (Cressida Cowell) — 12 books, major film franchise

**Young Adult**
- Shatter Me (Tahereh Mafi) — 7 books, very popular
- Legend (Marie Lu) — popular dystopian trilogy

---

## Out of Scope (v1)

- Streaming platform filter (high maintenance, goes stale)
- "Currently streaming" status badges
- User ratings or reviews
- Trailer embeds
