# JacketList — Project Specification for Claude Code

## Project Overview

**JacketList** (jacketlist.com) is a book discovery website with two core features:
1. **Weekly Bestsellers** — ranked list aggregated from NYT, The Guardian, and Goodreads
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
│   │   ├── series/
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
│   │   ├── bestsellers.json      # Weekly bestseller list (updated by CoWork)
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

### `bestsellers.json`
```json
{
  "updated": "2026-03-23",
  "books": [
    {
      "id": "some-book-id",
      "title": "Book Title",
      "author": "Author Name",
      "cover_url": "https://covers.openlibrary.org/...",
      "description": "One or two sentence description.",
      "sources": ["nyt", "guardian", "goodreads"],
      "score": 3,
      "rank": 1,
      "new_this_week": true,
      "weeks_on_list": 1,
      "series_id": "series-id-if-applicable",
      "series_book_number": 2,
      "amazon_url": "https://www.amazon.com/s?k=Book+Title&tag=YOURTAG-20"
    }
  ]
}
```

**Scoring rules:**
- `score: 3` → appears in all three sources → 🔥 Top Pick
- `score: 2` → appears in two sources → ⬆️ Trending  
- `score: 1` → appears in one source → 👀 Worth Watching

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
- Glassmorphism background: semi-transparent `surface` + `backdrop-blur-[20px]`
- Non-sticky — scrolls with the page

### SearchBar
- Rendered in the Hero section of HomePage only
- Client-side filter: searches bestsellers and series by title + author in real time
- Updates React state in `page.jsx`; HomePage passes filtered arrays as props to each section
- Empty query shows all results; no dropdown, no routing

### BookCard
- Used for both bestsellers and individual books within series pages
- Shows: cover, title, author, score badge (🔥/⬆️/👀), source badges, "weeks on list" if > 1
- If the book belongs to a series: show a "📚 Part of a series" badge that links to the series page
- If `series_id` is not found in `series.json`, the badge is silently omitted
- Always includes an Amazon Associates "Buy on Amazon" button (`target="_blank"`)
- Cover image: `cover_url` → Open Library (`https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg`) → text placeholder showing title
- Cover aspect ratio: 2:3 (portrait), full card width

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
  return sources.length; // 1, 2, or 3
}

export function scoreBadge(score) {
  if (score === 3) return { emoji: '🔥', label: 'Top Pick' };
  if (score === 2) return { emoji: '⬆️', label: 'Trending' };
  return { emoji: '👀', label: 'Worth Watching' };
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
2. **Weekly Bestsellers** — Section heading with last-updated date, ranked BookCards sorted by score desc then rank asc
3. **Popular Series** — Section heading, filterable by genre, SeriesCards grid
4. **FooterAdZone + Footer**

### SeriesPage (`/series/[id]`)
1. **Series header** — Title, author, genre tags, total books, short description
2. **"Currently on bestseller list" banner** — if `currently_on_bestseller_list: true`
3. **ReadingOrderTabs** — "📖 Chronological" | "✍️ Author's Recommended"
4. **FooterAdZone + Footer**

### Methodology (`/methodology`) — launch requirement
Static content page explaining how bestseller rankings are compiled: the three sources (NYT, The Guardian, Goodreads), the scoring logic (score 1/2/3), and update frequency (weekly, every Monday).

### Editorial Policy (`/editorial-policy`) — launch requirement
Static content page explaining how series reading orders are determined: what "Author's Recommended" means, how chronological order is defined, and how conflicts are resolved.

---

## CoWork Integration

The `/cowork/` folder contains two markdown prompt files used with Claude CoWork to automate data updates. Claude Code should not modify these files — they are managed separately. However, the JSON output format they produce must match the schemas defined in this file exactly.

**CoWork Task 1 — Weekly Bestsellers** (`cowork/bestseller-prompt.md`)
- Runs every Monday
- Outputs updates to `bestsellers.json`

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
