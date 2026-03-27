# JacketList — Project Specification for Claude Code

## Project Overview

**JacketList** (jacketlist.com) is a book discovery website with two core features:
1. **Weekly Bestsellers** — ranked list aggregated from 7 sources: NYT, The Guardian, Goodreads, Amazon, USA Today, Publishers Weekly, and Audible
2. **Book Series Guide** — reading order (chronological + author's recommended) for popular series across all genres

Revenue comes from **Amazon Associates affiliate links** on every book, and a **footer ad zone** supporting Google AdSense, BookBub, and direct sponsor placements.

The site is English-language only.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, `output: 'export'` for fully static build)
- **Frontend:** React (JSX), Tailwind CSS
- **Data:** JSON files (no database — flat file approach, imported at build time)
- **Affiliate links:** Amazon Associates (`?tag=YOURTAG-20` — replace with real tag before deploying)
- **Ads:** Footer zone only — Google AdSense, BookBub, direct sponsors
- **Automation:** Claude CoWork handles weekly data refresh (see `/cowork/` folder)
- **Design system:** See `DESIGN.md` for full token set, typography, and styling rules

---

## Project Structure

```
jacketlist/
├── public/
│   └── images/                   # Book cover images
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.jsx            # Root layout — renders Nav + Footer on every page
│   │   ├── page.jsx              # HomePage (/)
│   │   ├── HomeContent.jsx       # Client component — search + interactive state for homepage
│   │   ├── lists/
│   │   │   ├── page.jsx          # Lists hub (/lists) — links to all 7 source pages
│   │   │   └── [source]/
│   │   │       └── page.jsx      # Per-source page (/lists/nyt, /lists/amazon, etc.)
│   │   ├── series/
│   │   │   ├── page.jsx          # Series index (/series) — server component
│   │   │   ├── SeriesContent.jsx # Client component — search + sort for series index
│   │   │   └── [id]/
│   │   │       └── page.jsx      # SeriesPage (/series/[id])
│   │   ├── methodology/
│   │   │   └── page.jsx          # Methodology page — launch requirement
│   │   └── editorial-policy/
│   │       └── page.jsx          # Editorial Policy page — launch requirement
│   ├── components/
│   │   ├── Nav.jsx               # Top navigation bar (non-sticky, glassmorphism)
│   │   ├── Footer.jsx            # Footer with FTC disclosure + links
│   │   ├── BookCard.jsx          # Reusable book card (bestsellers + series)
│   │   ├── SeriesCard.jsx        # Series overview card for homepage grid
│   │   ├── AdCard.jsx            # Sponsored card — matches BookCard styling exactly
│   │   ├── ReadingOrderTabs.jsx  # Chronological / Author's Recommended tab toggle
│   │   ├── SourceBadge.jsx       # NYT / Guardian / Goodreads badge
│   │   ├── FooterAdZone.jsx      # Footer ad strip (1–3 AdCard slots)
│   │   └── SearchBar.jsx         # Client-side filter (title + author, no routing)
│   ├── data/
│   │   ├── sources/              # Raw per-source top 10 lists (updated by CoWork)
│   │   │   ├── nyt.json
│   │   │   ├── guardian.json
│   │   │   ├── goodreads.json
│   │   │   ├── amazon.json
│   │   │   ├── usatoday.json
│   │   │   ├── publishersweekly.json
│   │   │   └── audible.json
│   │   ├── bestsellers.json      # Merged top-25 list (scored from 7 sources, updated by CoWork)
│   │   ├── series.json           # All series data with both reading orders
│   │   └── ads.json              # Current footer ad placements
│   └── utils/
│       ├── amazonLink.js         # Builds affiliate URLs from title/ASIN
│       └── scoring.js            # Cross-source scoring logic
├── cowork/
│   ├── bestseller-prompt.md      # Weekly CoWork prompt for bestseller discovery
│   └── series-prompt.md          # Series discovery + reading order CoWork prompt
├── docs/
│   └── superpowers/
│       └── specs/                # Design specs
└── CLAUDE.md                     # This file
```

---

## Data Formats

### `src/data/sources/*.json`

Each source file holds exactly 10 books (the raw list, no scoring):

```json
{
  "source": "amazon",
  "label": "Amazon Best Sellers",
  "url": "https://www.amazon.com/charts/mostread/books",
  "updated": "2026-03-25",
  "books": [
    {
      "position": 1,
      "title": "Book Title",
      "author": "Author Name",
      "cover_url": "https://covers.openlibrary.org/b/id/{cover_i}-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Book+Title+Author&tag=jacketlist-20"
    }
  ]
}
```

Source slugs: `nyt`, `guardian`, `goodreads`, `amazon`, `usatoday`, `publishersweekly`, `audible`

### `bestsellers.json`

Merged top-25 list produced by CoWork from the 7 source files:

```json
{
  "updated": "2026-03-25",
  "books": [
    {
      "id": "some-book-id",
      "title": "Book Title",
      "author": "Author Name",
      "cover_url": "https://covers.openlibrary.org/...",
      "description": "One or two sentence description.",
      "sources": ["nyt", "amazon", "goodreads"],
      "sources_positions": [
        { "source": "nyt", "position": 1 },
        { "source": "amazon", "position": 3 },
        { "source": "goodreads", "position": 2 }
      ],
      "score": 3,
      "rank": 1,
      "new_this_week": true,
      "weeks_on_list": 1,
      "series_id": "series-id-if-applicable",
      "series_book_number": 2,
      "amazon_url": "https://www.amazon.com/s?k=Book+Title&tag=jacketlist-20"
    }
  ]
}
```

**Scoring rules (out of 7 sources):**
- `score: 5–7` → 🔥 Top Pick
- `score: 3–4` → ⬆️ Trending
- `score: 1–2` → 👀 Worth Watching

**Sort order:** score desc → tiebreaker desc. Tiebreaker = `(position_score + longevity_score) / 2` where `position_score = 11 - avg(sources_positions)` and `longevity_score = min(weeks_on_list, 10)`. Top 10 shown as BookCards; books 11–25 shown as compact ranked list.

### `series.json`
```json
{
  "series": [
    {
      "id": "wheel-of-time",
      "title": "The Wheel of Time",
      "author": "Robert Jordan, Brandon Sanderson",
      "genres": ["Fantasy"],
      "total_books": 14,
      "currently_on_bestseller_list": true,
      "description": "Epic fantasy series set in a world where magic exists...",
      "orders": {
        "chronological": [
          {
            "position": 1,
            "title": "New Spring",
            "note": "Prequel — many recommend reading after book 10",
            "amazon_url": "https://www.amazon.com/s?k=New+Spring+Robert+Jordan&tag=YOURTAG-20"
          }
        ],
        "authors_recommended": [
          {
            "position": 1,
            "title": "The Eye of the World",
            "note": "Start here for the best first-time experience",
            "amazon_url": "https://www.amazon.com/s?k=Eye+of+the+World+Jordan&tag=YOURTAG-20"
          }
        ]
      }
    }
  ]
}
```

### `ads.json`
```json
{
  "footer_ads": [
    {
      "id": "ad-001",
      "type": "direct",
      "title": "Sponsor Name",
      "description": "Short one-line description of the offer.",
      "image_url": "/public/images/ads/sponsor.jpg",
      "cta_text": "Learn more",
      "url": "https://sponsor.com",
      "active": true
    },
    {
      "id": "ad-002",
      "type": "adsense",
      "slot_id": "YOUR_ADSENSE_SLOT_ID",
      "active": true
    },
    {
      "id": "ad-003",
      "type": "bookbub",
      "active": false
    }
  ]
}
```

---

## Component Guidelines

### Nav
- Slim top bar rendered in the root layout — appears on every page
- Site name "JacketList" (Newsreader serif) links to `/`
- Right side: "Lists" link → `/lists`, "Series" link → `/series`
- Glassmorphism background: semi-transparent `surface` + `backdrop-blur-[20px]`
- Non-sticky — scrolls with the page

### SearchBar
- Reusable client-side filter component — used in Hero (HomePage) and Series index page
- Filters by title + author in real time; empty query shows all results; no dropdown, no routing
- On HomePage: state lives in `HomeContent.jsx`, filtered arrays passed as props to each section
- On Series index: state lives in `SeriesContent.jsx`

### BookCard
- Used for bestsellers, series pages, and per-source list pages
- Props: `book`, `seriesMap`, `showScore` (default `true`)
- Shows: cover, title, author, score badge (🔥/⬆️/👀) if `showScore=true`, source badges, "weeks on list" if > 1
- If the book belongs to a series: show a "📚 Part of a series" badge that links to the series page
- If `series_id` is not found in `series.json`, the badge is silently omitted
- Always includes an Amazon Associates "Buy on Amazon" button (`target="_blank"`)
- Cover image: `cover_url` → Open Library (`https://covers.openlibrary.org/b/id/{id}-M.jpg`) → text placeholder showing title
- Cover aspect ratio: 2:3 (portrait), full card width
- Set `showScore={false}` on per-source list pages (raw ranked lists have no cross-source score)

### AdCard
- **Must visually match BookCard exactly** in dimensions, border-radius, shadow, and padding
- Only difference: small "Sponsored" label in top-right corner (subtle, muted `on-surface-variant` color)
- For `type: "adsense"` — render the AdSense `<ins>` tag inside the card shell
- For `type: "direct"` or `type: "bookbub"` — use `title`, `description`, `image_url`, `cta_text`, `url`
- Never render an AdCard if `active: false`

### Footer
- Rendered in the root layout — appears on every page
- FTC disclosure text: "As an Amazon Associate JacketList earns from qualifying purchases"
- Links: Methodology (`/methodology`), Editorial Policy (`/editorial-policy`)
- No dividers — spacing only

### FooterAdZone
- Renders at the bottom of every page
- Heading: "You might also enjoy" (same style as section headings)
- Displays 1–3 AdCards in a horizontal row (same grid as BookCards)
- On mobile: single column stack
- AdCards are pulled from `ads.json` where `active: true`

### ReadingOrderTabs
- Two tabs: "📖 Chronological" | "✍️ Author's Recommended" (default active)
- Each tab shows a numbered list of books with title, optional note, and Amazon button
- If both orders are identical (compared by `title` field at each position), hide the tab toggle and show a single list

---

## Affiliate Link Utility (`amazonLink.js`)

```javascript
const AMAZON_TAG = 'YOURTAG-20'; // Replace with real Associates tag

export function buildAmazonSearchLink(title, author = '') {
  const query = encodeURIComponent(`${title} ${author}`.trim());
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`;
}

export function buildAmazonAsinLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}
```

Prefer ASIN links when available (higher conversion). Fall back to search links.

---

## Scoring Utility (`scoring.js`)

```javascript
export function scoreBook(sources) {
  return sources.length; // 1–7
}

export function scoreBadge(score) {
  if (score >= 5) return { emoji: '🔥', label: 'Top Pick' };
  if (score >= 3) return { emoji: '⬆️', label: 'Trending' };
  return { emoji: '👀', label: 'Worth Watching' };
}

export function computeTiebreaker(book) {
  if (!book.sources_positions || book.sources_positions.length === 0) return 0;
  const positions = book.sources_positions.map((sp) => sp.position);
  const avgPosition = positions.reduce((a, b) => a + b, 0) / positions.length;
  const positionScore = 11 - avgPosition;          // assumes max position = 10
  const longevityScore = Math.min(book.weeks_on_list, 10);
  return (positionScore + longevityScore) / 2;
}
```

---

## Styling Rules

See `DESIGN.md` for the full design system. Key rules for implementation:

- Use **Tailwind CSS** utility classes throughout — config is pre-built from the Stitch mockups
- **No 1px borders** — sections defined by background color shifts only
- **No dividers** — use spacing scale for visual silence between sections
- **No drop shadows** — use ambient shadow on hover only (`0 12px 40px rgba(27,28,26,0.05)`)
- **No sticky nav** — the top nav scrolls with the page
- No pop-ups, no auto-play, no interstitials
- Transitions: 300ms ease-in-out only
- Typography: Newsreader (serif) for headlines/display, Inter for body/UI
- Mobile-first responsive grid: 1 col (mobile) → 2 col (tablet) → 3–4 col (desktop)

---

## Pages

### HomePage (`/`)
1. **Hero** — Site name "JacketList", tagline ("The list worth reading. In the right order."), SearchBar
2. **Weekly Bestsellers** — Section heading with last-updated date, source pills row (NYT, Guardian, Goodreads, Amazon, USA Today, Publishers Weekly, Audible — each links to its per-source page), Top 10 BookCards (score desc → tiebreaker desc), then "Also trending this week" compact ranked list (books 11–25: rank, title, author, badge emoji, Buy → link). Compact list hidden when search is active.
3. **Popular Series** — Section heading, filterable by genre, SeriesCards grid
4. **FooterAdZone + Footer**

### Series Index (`/series`)
1. **Heading** — "Book Series Guide" + count of series
2. **SearchBar** — filters by title or author in real time
3. **SeriesCards grid** — sorted alphabetically by title; shows "No series match your search." when empty
4. **FooterAdZone + Footer**

### Lists Hub (`/lists`)
Grid of 7 source cards, each linking to its per-source page. Linked from Nav.

### Per-Source List (`/lists/[source]`)
One static page per source (nyt, guardian, goodreads, amazon, usatoday, publishersweekly, audible). Shows:
1. Source name + "As seen on" attribution
2. Top 10 BookCards with `showScore={false}` — raw ranked list, no cross-source badge
3. "← See our full merged Top 10" link back to homepage
4. FooterAdZone + Footer

### SeriesPage (`/series/[id]`)
1. **Series header** — Title, author, genre tags, total books, short description
2. **"Currently on bestseller list" banner** — if `currently_on_bestseller_list: true`
3. **ReadingOrderTabs** — "📖 Chronological" | "✍️ Author's Recommended"
4. **FooterAdZone + Footer**

### Methodology (`/methodology`) — launch requirement
Static content page explaining how bestseller rankings are compiled: the seven sources (NYT, The Guardian, Goodreads, Amazon, USA Today, Publishers Weekly, Audible), the scoring logic (score 1–7, badge thresholds 5–7/3–4/1–2), tiebreaker formula, and update frequency (weekly, every Monday).

### Editorial Policy (`/editorial-policy`) — launch requirement
Static content page explaining how series reading orders are determined: what "Author's Recommended" means, how chronological order is defined, and how conflicts are resolved.

---

## CoWork Integration

The `/cowork/` folder contains two markdown prompt files used with Claude CoWork to automate data updates. Claude Code should not modify these files — they are managed separately. However, the JSON output format they produce must match the schemas defined in this file exactly.

**CoWork Task 1 — Weekly Bestsellers** (`cowork/bestseller-prompt.md`)
- Runs every Monday
- Outputs top 10 for each of the 7 sources to `src/data/sources/*.json`
- Outputs merged top-25 to `bestsellers.json`

**CoWork Task 2 — Series Discovery** (`cowork/series-prompt.md`)
- Runs monthly or on-demand
- Outputs additions/updates to `series.json`

---

## Amazon Associates Notes

- Replace all instances of `YOURTAG-20` with the real Associates tracking tag before deploying
- All outbound Amazon links must open in a new tab (`target="_blank"`)
- Required FTC disclosure: add "As an Amazon Associate JacketList earns from qualifying purchases" in the site footer

---

## Out of Scope (for now)

- User accounts or personalisation
- Comments or reviews
- Newsletter / email capture
- Server-side rendering (static export is sufficient for v1)
- Non-English books
- Sticky navigation
- Real bestseller data before launch (placeholder seed data is fine)
- Production AdSense slot ID and Amazon Associates tag (use placeholders; substitute at launch)
