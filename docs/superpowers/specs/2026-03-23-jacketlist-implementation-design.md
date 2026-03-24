# JacketList — Implementation Design

**Date:** 2026-03-23
**Status:** Approved

---

## 1. Overview

This document describes the implementation design for JacketList v1 — a static book discovery site with two core features: Weekly Bestsellers and a Book Series Guide. The goal of this implementation is to convert the existing Stitch mockups and project spec into a working, deployable Next.js application.

---

## 2. Architecture

### Framework
**Next.js 14 with App Router, configured for static export (`output: 'export'`).**

- Produces a fully static site — no server required at runtime
- Deployable to Vercel, Netlify, or any static host
- File-based routing via the App Router

### Routing
| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.jsx` | HomePage |
| `/series/[id]` | `src/app/series/[id]/page.jsx` | SeriesPage |
| `/methodology` | `src/app/methodology/page.jsx` | How rankings are compiled (launch requirement) |
| `/editorial-policy` | `src/app/editorial-policy/page.jsx` | How reading orders are determined (launch requirement) |

Series pages are statically generated at build time using `generateStaticParams()` over `series.json`.

The Methodology and Editorial Policy pages are launch requirements per STRATEGY.md. They are static content pages — no components beyond the root layout and footer are needed.

### Styling
Tailwind CSS, configured with the full design token set extracted verbatim from the Stitch mockups:
- Color tokens (surface hierarchy, primary/secondary/tertiary)
- Font families: Newsreader (headline/display), Inter (body/UI)
- Border radius scale
- Google Fonts loaded via `<head>` in the root layout

### Data
All data imported statically from JSON files at build time. No API routes, no runtime data fetching. Open Library cover images are fetched client-side with a fallback chain.

### Folder Structure
```
src/
  app/
    layout.jsx                  ← Root layout (Nav, fonts, global styles)
    page.jsx                    ← HomePage
    series/
      [id]/
        page.jsx                ← SeriesPage
    methodology/
      page.jsx                  ← Methodology page (launch requirement)
    editorial-policy/
      page.jsx                  ← Editorial Policy page (launch requirement)
  components/
    Nav.jsx                     ← Top navigation bar
    Footer.jsx                  ← Footer with FTC disclosure + links
    BookCard.jsx
    SeriesCard.jsx
    AdCard.jsx
    ReadingOrderTabs.jsx
    SourceBadge.jsx
    FooterAdZone.jsx
    SearchBar.jsx
  data/
    bestsellers.json
    series.json
    ads.json
  utils/
    amazonLink.js
    scoring.js
public/
  images/
cowork/
  bestseller-prompt.md
  series-prompt.md
```

---

## 3. Build Order (Pages-First)

Components are extracted naturally as each page is built, top-down.

1. **Scaffold** — Next.js project, Tailwind config, root layout, Google Fonts
2. **Seed data** — Placeholder JSON files
3. **Utilities** — `amazonLink.js`, `scoring.js`
4. **HomePage** — Convert Stitch mockup; extract components as encountered
5. **SeriesPage** — Convert Stitch mockup; extract/reuse components

---

## 4. Components

### `Nav` (rendered in root layout, shared across all pages)
- Slim top bar: site name "JacketList" in Newsreader serif (links to `/`), search icon
- Glassmorphism background: semi-transparent `surface` + `backdrop-blur-[20px]`
- Non-sticky (scrolls with page). A sticky top nav is explicitly excluded.

### `SearchBar`
- Rendered in the Hero section of HomePage
- Client-side filter only — searches across both bestsellers and series by title and author
- Input style: underline-only, `surface-container-low` background, `secondary` bottom border on focus
- On input: updates React state in `page.jsx`; HomePage passes filtered arrays as props to the Bestsellers and Series sections — no CSS visibility toggling
- Empty query: shows all results (default state)
- No dropdown, no server query, no routing

### `BookCard`
- Background: `surface-container-lowest` (#ffffff)
- Corner radius: `xl` (0.5rem)
- Hover: ambient shadow (`0 12px 40px rgba(27,28,26,0.05)`), no background change
- Cover image: `cover_url` → `https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg` → text placeholder showing title
- Cover dimensions: fixed aspect ratio 2:3 (portrait), full card width
- Score badge: emoji + label using `secondary` amber/gold accent
- Source badges: pill chips (NYT / Guardian / Goodreads)
- Series badge: "📚 Part of a series" → links to `/series/[id]`. If `series_id` not found in series.json, badge is silently omitted.
- CTA: "Buy on Amazon" primary button, `target="_blank"`

### `SeriesCard`
- Grid card for the Popular Series section on HomePage
- Shows: cover thumbnail, title, author, genre chips, book count
- Links to `/series/[id]`

### `AdCard`
- Visually identical to `BookCard` in dimensions, radius, shadow, padding
- "Sponsored" label: top-right, `on-surface-variant` color, muted
- Supports three types:
  - `direct` — uses `title`, `description`, `image_url`, `cta_text`, `url`
  - `adsense` — renders `<ins>` AdSense tag inside the card shell
  - `bookbub` — treated identically to `direct` (uses `title`, `description`, `image_url`, `cta_text`, `url`); no special embed format at v1
- Never renders if `active: false`

### `ReadingOrderTabs`
- Tabs: "📖 Chronological" | "✍️ Author's Recommended" (default active)
- If both orders are identical (compared by `title` field across all positions): hide tab toggle, show single list
- Each tab: numbered list with title, optional note, Amazon button

### `SourceBadge`
- Pill chip showing source name (NYT, Guardian, Goodreads)
- Uses `surface-container-high` background (unselected filter chip style)

### `FooterAdZone`
- Heading: "You might also enjoy" (same style as section headings)
- Renders `AdCard`s from `ads.json` where `active: true`
- Layout: horizontal row (1–3 cards), single column on mobile
- Appears at the bottom of every page

### Footer
- FTC disclosure text: "As an Amazon Associate JacketList earns from qualifying purchases" — rendered on every page via the shared Footer component
- Links: Methodology, Editorial Policy
- No dividers — spacing only

---

## 5. Pages

### HomePage (`/`)
Sections in order:
1. **Hero** — Site name "JacketList" (display-lg, Newsreader), tagline, SearchBar
2. **Weekly Bestsellers** — Last-updated date, BookCards sorted by score desc then rank asc
3. **Popular Series** — Genre filter chips, SeriesCards grid
4. **FooterAdZone + Footer**

### SeriesPage (`/series/[id]`)
Sections in order:
1. **Series header** — Title, author, genre tags, total books, description
2. **Bestseller banner** — Shown if `currently_on_bestseller_list: true`
3. **ReadingOrderTabs** — "📖 Chronological" | "✍️ Author's Recommended" (default active)
4. **FooterAdZone + Footer**

### Methodology (`/methodology`)
Static content page. Content: explanation of how bestseller rankings are compiled — the three sources (NYT, The Guardian, Goodreads), the scoring logic (score 1/2/3), and update frequency (weekly, every Monday). Uses root layout (Nav + Footer). No dynamic data.

### Editorial Policy (`/editorial-policy`)
Static content page. Content: explanation of how series reading orders are determined — what "Author's Recommended" means, how chronological order is defined, and how the site resolves conflicts. Uses root layout (Nav + Footer). No dynamic data.

### Amazon Associate Disclosure
Not a dedicated page. The FTC disclosure text ("As an Amazon Associate JacketList earns from qualifying purchases") is rendered in `Footer.jsx`, which appears on every page. This satisfies the STRATEGY.md requirement for disclosure "on all commercial pages."

---

## 6. Data

### Placeholder Seed Data

**`bestsellers.json`** — 6 books:
- 2× score 3 (all three sources) — 🔥 Top Pick
- 2× score 2 (two sources) — ⬆️ Trending
- 2× score 1 (one source) — 👀 Worth Watching
- Mix of standalone and series-linked books
- One book with `new_this_week: true`, others with `weeks_on_list > 1`

**`series.json`** — 4 series across genres:
- Wheel of Time (Fantasy) — chronological ≠ author's recommended
- Stormlight Archive (Fantasy) — chronological ≠ author's recommended
- Jack Reacher (Thriller) — identical orders (tests tab-hiding logic)
- Outlander (Historical Fiction)

**`ads.json`** — 3 slots:
- 1× `direct` (active: true) — placeholder sponsor
- 1× `adsense` (active: true) — dummy slot ID (`"slot_id": "0000000000"`); real ID to be substituted at launch
- 1× `bookbub` (active: false) — tests inactive filtering

### Utilities

**`amazonLink.js`**
```javascript
const AMAZON_TAG = 'YOURTAG-20';
export function buildAmazonSearchLink(title, author = '') { ... }
export function buildAmazonAsinLink(asin) { ... }
```

**`scoring.js`**
```javascript
export function scoreBook(sources) { return sources.length; }
export function scoreBadge(score) { ... }
```

### Data Integrity
- `series_id` references in `bestsellers.json` are assumed valid at build time — no runtime validation. Placeholder data must keep these consistent.
- For identical reading orders, `ReadingOrderTabs` compares the `title` field of each entry across both arrays by position. If all titles match, the tab toggle is hidden.

---

## 7. Styling Rules (from DESIGN.md)

- No 1px borders — sections defined by background color shifts only
- No drop shadows — tonal layering + ambient shadow on hover only
- No dividers — use spacing scale (`spacing-8`/`spacing-10`) for visual silence
- Transitions: 300ms ease-in-out only
- Body text: `on-surface` (#1b1c1a), never pure black
- Amber/gold (`secondary`) used sparingly — badges, ratings, primary CTAs only
- `secondary-fixed` (#ffe088) for "Add to Library" or highlight buttons

---

## 8. Out of Scope (v1)

- User accounts, personalisation
- Comments or reviews
- Newsletter / email capture
- Server-side rendering
- Non-English books
- Real bestseller data (placeholder until launch)
- Sticky navigation (non-sticky top nav is in scope)
- Production AdSense / affiliate tags (placeholder values used throughout; substituted at launch)
