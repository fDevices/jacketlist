# JacketList v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build JacketList v1 — a fully static Next.js 14 book discovery site with Weekly Bestsellers and Book Series Guide, deployable as a zero-server static export.

**Architecture:** Next.js 14 App Router with `output: 'export'`; all data imported from JSON at build time; Tailwind CSS with the full design token set extracted verbatim from the Stitch mockups; no runtime APIs, no database.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Jest, @testing-library/react, Google Fonts (Newsreader + Inter)

---

## File Map

**Created:**
```
src/
  app/
    layout.jsx                        ← Root layout: Nav, fonts, global styles
    globals.css                       ← Tailwind directives + body defaults
    page.jsx                          ← HomePage (Hero + Bestsellers + Series)
    series/[id]/page.jsx              ← SeriesPage with generateStaticParams
    methodology/page.jsx              ← Static content page
    editorial-policy/page.jsx         ← Static content page
  components/
    Nav.jsx
    Footer.jsx
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
tailwind.config.js
next.config.js
jest.config.js
jest.setup.js
__tests__/
  utils/amazonLink.test.js
  utils/scoring.test.js
  components/BookCard.test.jsx
  components/AdCard.test.jsx
  components/ReadingOrderTabs.test.jsx
  components/SearchBar.test.jsx
  components/FooterAdZone.test.jsx
```

**Modified:** `package.json` (add deps + test script)

---

## Task 1: Project Scaffold

**Files:**
- Create: `next.config.js`
- Create: `tailwind.config.js`
- Create: `src/app/globals.css`
- Create: `src/app/layout.jsx`
- Modify: `package.json`

- [ ] **Step 1: Initialise the Next.js project**

```bash
cd /Users/christian/Documents/jacketlist
npx create-next-app@14 . --yes --app --src-dir --no-typescript --tailwind --eslint --import-alias "@/*"
```

Expected: project scaffolded with `src/app/`, `tailwind.config.js`, `next.config.js`, `package.json`.

- [ ] **Step 2: Configure static export in `next.config.js`**

Replace the generated file:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Replace `tailwind.config.js` with full design token set**

The tokens below are extracted verbatim from the Stitch mockup `<script id="tailwind-config">`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface-container-high': '#e9e8e4',
        'on-tertiary-fixed-variant': '#544520',
        'on-primary-container': '#858383',
        'on-surface-variant': '#444748',
        'on-tertiary-fixed': '#251a00',
        'surface-dim': '#dbdad6',
        'surface-container-low': '#f4f4f0',
        'on-primary': '#ffffff',
        'outline-variant': '#c4c7c7',
        'surface-container-highest': '#e3e2df',
        'secondary-container': '#fed65b',
        'on-error': '#ffffff',
        'primary-fixed': '#e5e2e1',
        tertiary: '#6d5c35',
        'secondary-fixed-dim': '#e9c349',
        'surface-bright': '#faf9f5',
        background: '#faf9f5',
        error: '#ba1a1a',
        'primary-container': '#1c1b1b',
        'on-secondary': '#ffffff',
        'on-primary-fixed-variant': '#474746',
        'secondary-fixed': '#ffe088',
        'tertiary-fixed-dim': '#dbc494',
        'on-tertiary': '#ffffff',
        'primary-fixed-dim': '#c8c6c5',
        'on-secondary-fixed-variant': '#574500',
        'inverse-primary': '#c8c6c5',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#1b1c1a',
        'error-container': '#ffdad6',
        'on-secondary-fixed': '#241a00',
        primary: '#000000',
        'on-primary-fixed': '#1c1b1b',
        'surface-variant': '#e3e2df',
        'on-tertiary-container': '#4c3d19',
        'on-background': '#1b1c1a',
        secondary: '#735c00',
        'tertiary-container': '#bea97a',
        'surface-tint': '#5f5e5e',
        'inverse-surface': '#2f312e',
        outline: '#747878',
        'tertiary-fixed': '#f8e0ae',
        'on-secondary-container': '#745c00',
        surface: '#faf9f5',
        'inverse-on-surface': '#f2f1ed',
        'surface-container': '#efeeea',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        headline: ['Newsreader', 'serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Replace `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background-color: #faf9f5;
  color: #1b1c1a;
}
```

- [ ] **Step 5: Replace `src/app/layout.jsx` with root layout**

```jsx
import './globals.css';

export const metadata = {
  title: 'JacketList | The list worth reading. In the right order.',
  description:
    'Weekly bestsellers ranked from NYT, The Guardian, and Goodreads — plus reading order guides for popular book series.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface">{children}</body>
    </html>
  );
}
```

Note: Nav and Footer will be added here in Task 3 once those components are built.

- [ ] **Step 6: Install Jest and React Testing Library**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 7: Create `jest.config.js`**

The correct Jest config key for setup files that run after the test framework is installed is `setupFilesAfterEnv` (confirmed from Next.js + Jest docs).

```js
// jest.config.js
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
});
```

- [ ] **Step 8: Create `jest.setup.js`**

```js
import '@testing-library/jest-dom';
```

- [ ] **Step 9: Add test script to `package.json`**

Add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 10: Verify scaffold builds**

```bash
npm run build
```

Expected: `out/` directory created with `index.html`. No errors.

- [ ] **Step 11: Commit**

```bash
git init
git add next.config.js tailwind.config.js src/app/globals.css src/app/layout.jsx jest.config.js jest.setup.js package.json package-lock.json
git commit -m "feat: scaffold Next.js 14 static export with Tailwind design tokens and Jest"
```

---

## Task 2: Seed Data + Utilities

**Files:**
- Create: `src/data/bestsellers.json`
- Create: `src/data/series.json`
- Create: `src/data/ads.json`
- Create: `src/utils/amazonLink.js`
- Create: `src/utils/scoring.js`
- Create: `__tests__/utils/amazonLink.test.js`
- Create: `__tests__/utils/scoring.test.js`

- [ ] **Step 1: Write failing tests for `amazonLink.js`**

```js
// __tests__/utils/amazonLink.test.js
import { buildAmazonSearchLink, buildAmazonAsinLink } from '@/utils/amazonLink';

describe('buildAmazonSearchLink', () => {
  it('encodes title and author into a search URL with affiliate tag', () => {
    const url = buildAmazonSearchLink('The Eye of the World', 'Robert Jordan');
    expect(url).toBe(
      'https://www.amazon.com/s?k=The%20Eye%20of%20the%20World%20Robert%20Jordan&tag=YOURTAG-20'
    );
  });

  it('works with title only when author is omitted', () => {
    const url = buildAmazonSearchLink('Dune');
    expect(url).toBe('https://www.amazon.com/s?k=Dune&tag=YOURTAG-20');
  });
});

describe('buildAmazonAsinLink', () => {
  it('builds a direct ASIN product URL with affiliate tag', () => {
    const url = buildAmazonAsinLink('0765326353');
    expect(url).toBe('https://www.amazon.com/dp/0765326353?tag=YOURTAG-20');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern=amazonLink
```

Expected: FAIL — "Cannot find module '@/utils/amazonLink'"

- [ ] **Step 3: Write failing tests for `scoring.js`**

```js
// __tests__/utils/scoring.test.js
import { scoreBook, scoreBadge } from '@/utils/scoring';

describe('scoreBook', () => {
  it('returns the number of sources', () => {
    expect(scoreBook(['nyt', 'guardian', 'goodreads'])).toBe(3);
    expect(scoreBook(['nyt', 'goodreads'])).toBe(2);
    expect(scoreBook(['nyt'])).toBe(1);
  });
});

describe('scoreBadge', () => {
  it('returns 🔥 Top Pick for score 3', () => {
    expect(scoreBadge(3)).toEqual({ emoji: '🔥', label: 'Top Pick' });
  });
  it('returns ⬆️ Trending for score 2', () => {
    expect(scoreBadge(2)).toEqual({ emoji: '⬆️', label: 'Trending' });
  });
  it('returns 👀 Worth Watching for score 1', () => {
    expect(scoreBadge(1)).toEqual({ emoji: '👀', label: 'Worth Watching' });
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

```bash
npm test -- --testPathPattern=scoring
```

Expected: FAIL — "Cannot find module '@/utils/scoring'"

- [ ] **Step 5: Implement `amazonLink.js`**

```js
// src/utils/amazonLink.js
const AMAZON_TAG = 'YOURTAG-20';

export function buildAmazonSearchLink(title, author = '') {
  const query = encodeURIComponent(`${title} ${author}`.trim());
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`;
}

export function buildAmazonAsinLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}
```

- [ ] **Step 6: Implement `scoring.js`**

```js
// src/utils/scoring.js
export function scoreBook(sources) {
  return sources.length;
}

export function scoreBadge(score) {
  if (score === 3) return { emoji: '🔥', label: 'Top Pick' };
  if (score === 2) return { emoji: '⬆️', label: 'Trending' };
  return { emoji: '👀', label: 'Worth Watching' };
}
```

- [ ] **Step 7: Run all utility tests to verify they pass**

```bash
npm test -- --testPathPattern="utils/"
```

Expected: 6 tests PASS.

- [ ] **Step 8: Create `src/data/bestsellers.json`**

6 books: 2× score 3, 2× score 2, 2× score 1. Mix of standalone and series-linked. `wheel-of-time` and `stormlight-archive` are valid `series_id` values from `series.json`.

```json
{
  "updated": "2026-03-24",
  "books": [
    {
      "id": "words-of-radiance",
      "title": "Words of Radiance",
      "author": "Brandon Sanderson",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9780765326362-M.jpg",
      "description": "The second volume in the Stormlight Archive series follows Kaladin and Shallan as the Everstorm approaches.",
      "sources": ["nyt", "guardian", "goodreads"],
      "score": 3,
      "rank": 1,
      "new_this_week": true,
      "weeks_on_list": 1,
      "series_id": "stormlight-archive",
      "series_book_number": 2,
      "amazon_url": "https://www.amazon.com/s?k=Words+of+Radiance+Sanderson&tag=YOURTAG-20"
    },
    {
      "id": "the-way-of-kings",
      "title": "The Way of Kings",
      "author": "Brandon Sanderson",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9780765326355-M.jpg",
      "description": "Epic fantasy opener following Kaladin, Shallan, and Dalinar on the storm-swept world of Roshar.",
      "sources": ["nyt", "guardian", "goodreads"],
      "score": 3,
      "rank": 2,
      "new_this_week": false,
      "weeks_on_list": 8,
      "series_id": "stormlight-archive",
      "series_book_number": 1,
      "amazon_url": "https://www.amazon.com/s?k=The+Way+of+Kings+Sanderson&tag=YOURTAG-20"
    },
    {
      "id": "the-eye-of-the-world",
      "title": "The Eye of the World",
      "author": "Robert Jordan",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9780765326355-M.jpg",
      "description": "The first book of the Wheel of Time — a young farmboy discovers he may be destined to save or destroy the world.",
      "sources": ["nyt", "goodreads"],
      "score": 2,
      "rank": 3,
      "new_this_week": false,
      "weeks_on_list": 4,
      "series_id": "wheel-of-time",
      "series_book_number": 1,
      "amazon_url": "https://www.amazon.com/s?k=Eye+of+the+World+Jordan&tag=YOURTAG-20"
    },
    {
      "id": "outlander",
      "title": "Outlander",
      "author": "Diana Gabaldon",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9780440212560-M.jpg",
      "description": "A WWII combat nurse is swept back to 18th-century Scotland in this sweeping historical romance.",
      "sources": ["guardian", "goodreads"],
      "score": 2,
      "rank": 4,
      "new_this_week": false,
      "weeks_on_list": 12,
      "series_id": "outlander",
      "series_book_number": 1,
      "amazon_url": "https://www.amazon.com/s?k=Outlander+Gabaldon&tag=YOURTAG-20"
    },
    {
      "id": "killing-floor",
      "title": "Killing Floor",
      "author": "Lee Child",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9780515153651-M.jpg",
      "description": "The first Jack Reacher novel — ex-military cop wanders into a small Georgia town and stumbles into a murder.",
      "sources": ["nyt"],
      "score": 1,
      "rank": 5,
      "new_this_week": false,
      "weeks_on_list": 3,
      "series_id": "jack-reacher",
      "series_book_number": 1,
      "amazon_url": "https://www.amazon.com/s?k=Killing+Floor+Lee+Child&tag=YOURTAG-20"
    },
    {
      "id": "project-hail-mary",
      "title": "Project Hail Mary",
      "author": "Andy Weir",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg",
      "description": "A lone astronaut wakes up millions of miles from Earth with no memory — and the fate of humanity on his shoulders.",
      "sources": ["goodreads"],
      "score": 1,
      "rank": 6,
      "new_this_week": false,
      "weeks_on_list": 6,
      "amazon_url": "https://www.amazon.com/s?k=Project+Hail+Mary+Andy+Weir&tag=YOURTAG-20"
    }
  ]
}
```

- [ ] **Step 9: Create `src/data/series.json`**

4 series: Wheel of Time (chronological ≠ recommended), Stormlight Archive (chronological ≠ recommended), Jack Reacher (identical orders — tests tab-hiding), Outlander.

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
      "description": "One of the most epic fantasy series ever written. A young man from a backwater village learns he may be the Dragon Reborn — destined to save the world, or break it.",
      "orders": {
        "chronological": [
          { "position": 1, "title": "New Spring", "note": "Prequel — many readers recommend saving this until after Book 10.", "amazon_url": "https://www.amazon.com/s?k=New+Spring+Robert+Jordan&tag=YOURTAG-20" },
          { "position": 2, "title": "The Eye of the World", "amazon_url": "https://www.amazon.com/s?k=Eye+of+the+World+Jordan&tag=YOURTAG-20" },
          { "position": 3, "title": "The Great Hunt", "amazon_url": "https://www.amazon.com/s?k=The+Great+Hunt+Jordan&tag=YOURTAG-20" },
          { "position": 4, "title": "The Dragon Reborn", "amazon_url": "https://www.amazon.com/s?k=The+Dragon+Reborn+Jordan&tag=YOURTAG-20" }
        ],
        "authors_recommended": [
          { "position": 1, "title": "The Eye of the World", "note": "Start here — best first-time experience.", "amazon_url": "https://www.amazon.com/s?k=Eye+of+the+World+Jordan&tag=YOURTAG-20" },
          { "position": 2, "title": "The Great Hunt", "amazon_url": "https://www.amazon.com/s?k=The+Great+Hunt+Jordan&tag=YOURTAG-20" },
          { "position": 3, "title": "The Dragon Reborn", "amazon_url": "https://www.amazon.com/s?k=The+Dragon+Reborn+Jordan&tag=YOURTAG-20" },
          { "position": 4, "title": "New Spring", "note": "Read after Book 10 for best impact.", "amazon_url": "https://www.amazon.com/s?k=New+Spring+Robert+Jordan&tag=YOURTAG-20" }
        ]
      }
    },
    {
      "id": "stormlight-archive",
      "title": "The Stormlight Archive",
      "author": "Brandon Sanderson",
      "genres": ["Fantasy"],
      "total_books": 5,
      "currently_on_bestseller_list": true,
      "description": "Set on the storm-ravaged world of Roshar, this epic series follows soldiers, scholars, and assassins bound together by ancient oaths and a coming desolation.",
      "orders": {
        "chronological": [
          { "position": 1, "title": "The Way of Kings", "amazon_url": "https://www.amazon.com/s?k=The+Way+of+Kings+Sanderson&tag=YOURTAG-20" },
          { "position": 2, "title": "Words of Radiance", "amazon_url": "https://www.amazon.com/s?k=Words+of+Radiance+Sanderson&tag=YOURTAG-20" },
          { "position": 3, "title": "Edgedancer", "note": "Novella — can be read between Books 2 and 3.", "amazon_url": "https://www.amazon.com/s?k=Edgedancer+Sanderson&tag=YOURTAG-20" },
          { "position": 4, "title": "Oathbringer", "amazon_url": "https://www.amazon.com/s?k=Oathbringer+Sanderson&tag=YOURTAG-20" },
          { "position": 5, "title": "Rhythm of War", "amazon_url": "https://www.amazon.com/s?k=Rhythm+of+War+Sanderson&tag=YOURTAG-20" }
        ],
        "authors_recommended": [
          { "position": 1, "title": "The Way of Kings", "note": "Start here — do not skip.", "amazon_url": "https://www.amazon.com/s?k=The+Way+of+Kings+Sanderson&tag=YOURTAG-20" },
          { "position": 2, "title": "Words of Radiance", "amazon_url": "https://www.amazon.com/s?k=Words+of+Radiance+Sanderson&tag=YOURTAG-20" },
          { "position": 3, "title": "Oathbringer", "amazon_url": "https://www.amazon.com/s?k=Oathbringer+Sanderson&tag=YOURTAG-20" },
          { "position": 4, "title": "Edgedancer", "note": "Read after Oathbringer.", "amazon_url": "https://www.amazon.com/s?k=Edgedancer+Sanderson&tag=YOURTAG-20" },
          { "position": 5, "title": "Rhythm of War", "amazon_url": "https://www.amazon.com/s?k=Rhythm+of+War+Sanderson&tag=YOURTAG-20" }
        ]
      }
    },
    {
      "id": "jack-reacher",
      "title": "Jack Reacher",
      "author": "Lee Child",
      "genres": ["Thriller"],
      "total_books": 27,
      "currently_on_bestseller_list": false,
      "description": "A nomadic ex-military cop with no address, no phone, and no agenda — just a toothbrush and a talent for trouble. Pure thriller momentum.",
      "orders": {
        "chronological": [
          { "position": 1, "title": "Killing Floor", "amazon_url": "https://www.amazon.com/s?k=Killing+Floor+Lee+Child&tag=YOURTAG-20" },
          { "position": 2, "title": "Die Trying", "amazon_url": "https://www.amazon.com/s?k=Die+Trying+Lee+Child&tag=YOURTAG-20" },
          { "position": 3, "title": "Tripwire", "amazon_url": "https://www.amazon.com/s?k=Tripwire+Lee+Child&tag=YOURTAG-20" }
        ],
        "authors_recommended": [
          { "position": 1, "title": "Killing Floor", "amazon_url": "https://www.amazon.com/s?k=Killing+Floor+Lee+Child&tag=YOURTAG-20" },
          { "position": 2, "title": "Die Trying", "amazon_url": "https://www.amazon.com/s?k=Die+Trying+Lee+Child&tag=YOURTAG-20" },
          { "position": 3, "title": "Tripwire", "amazon_url": "https://www.amazon.com/s?k=Tripwire+Lee+Child&tag=YOURTAG-20" }
        ]
      }
    },
    {
      "id": "outlander",
      "title": "Outlander",
      "author": "Diana Gabaldon",
      "genres": ["Historical Fiction", "Romance"],
      "total_books": 9,
      "currently_on_bestseller_list": false,
      "description": "A time-travel historical epic beginning in 1945 Scotland, sweeping through Jacobite rebellions and American Revolution. Romantic, detailed, addictive.",
      "orders": {
        "chronological": [
          { "position": 1, "title": "Outlander", "amazon_url": "https://www.amazon.com/s?k=Outlander+Gabaldon&tag=YOURTAG-20" },
          { "position": 2, "title": "Dragonfly in Amber", "amazon_url": "https://www.amazon.com/s?k=Dragonfly+in+Amber+Gabaldon&tag=YOURTAG-20" },
          { "position": 3, "title": "Voyager", "amazon_url": "https://www.amazon.com/s?k=Voyager+Gabaldon&tag=YOURTAG-20" }
        ],
        "authors_recommended": [
          { "position": 1, "title": "Outlander", "note": "Begin here — the books must be read in order.", "amazon_url": "https://www.amazon.com/s?k=Outlander+Gabaldon&tag=YOURTAG-20" },
          { "position": 2, "title": "Dragonfly in Amber", "amazon_url": "https://www.amazon.com/s?k=Dragonfly+in+Amber+Gabaldon&tag=YOURTAG-20" },
          { "position": 3, "title": "Voyager", "amazon_url": "https://www.amazon.com/s?k=Voyager+Gabaldon&tag=YOURTAG-20" }
        ]
      }
    }
  ]
}
```

- [ ] **Step 10: Create `src/data/ads.json`**

```json
{
  "footer_ads": [
    {
      "id": "ad-001",
      "type": "direct",
      "title": "BookBrowse",
      "description": "Discover your next great read with expert reviews and reading guides.",
      "image_url": "/images/ads/bookbrowse.jpg",
      "cta_text": "Explore now",
      "url": "https://www.bookbrowse.com",
      "active": true
    },
    {
      "id": "ad-002",
      "type": "adsense",
      "slot_id": "0000000000",
      "active": true
    },
    {
      "id": "ad-003",
      "type": "bookbub",
      "title": "BookBub",
      "description": "Get alerted to free and deeply discounted e-books in your favourite genres.",
      "image_url": "/images/ads/bookbub.jpg",
      "cta_text": "Get deals",
      "url": "https://www.bookbub.com",
      "active": false
    }
  ]
}
```

- [ ] **Step 11: Commit**

```bash
git add src/data/ src/utils/ __tests__/utils/
git commit -m "feat: add seed data and utility functions with tests"
```

---

## Task 3: Nav + Footer

**Files:**
- Create: `src/components/Nav.jsx`
- Create: `src/components/Footer.jsx`
- Modify: `src/app/layout.jsx`

No unit tests needed — these are layout-only components with no logic. Verify visually in the browser.

- [ ] **Step 1: Create `src/components/Nav.jsx`**

Per spec: slim top bar, "JacketList" in Newsreader linking to `/`, glassmorphism background, non-sticky.

```jsx
// src/components/Nav.jsx
import Link from 'next/link';

export default function Nav() {
  return (
    <header className="bg-surface/80 backdrop-blur-[20px]">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-semibold font-headline text-on-surface"
        >
          JacketList
        </Link>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create `src/components/Footer.jsx`**

Per spec: FTC disclosure, links to /methodology and /editorial-policy, no dividers.

```jsx
// src/components/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-10 px-8 max-w-7xl mx-auto">
      <p className="text-label text-on-surface-variant text-sm mb-4">
        As an Amazon Associate JacketList earns from qualifying purchases.
      </p>
      <div className="flex gap-6">
        <Link
          href="/methodology"
          className="text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-300"
        >
          Methodology
        </Link>
        <Link
          href="/editorial-policy"
          className="text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-300"
        >
          Editorial Policy
        </Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Add Nav and Footer to `src/app/layout.jsx`**

```jsx
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'JacketList | The list worth reading. In the right order.',
  description:
    'Weekly bestsellers ranked from NYT, The Guardian, and Goodreads — plus reading order guides for popular book series.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify dev server shows Nav + Footer**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm "JacketList" header and footer links are visible.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.jsx src/components/Footer.jsx src/app/layout.jsx
git commit -m "feat: add Nav and Footer components, wire into root layout"
```

---

## Task 4: SourceBadge + BookCard

**Files:**
- Create: `src/components/SourceBadge.jsx`
- Create: `src/components/BookCard.jsx`
- Create: `__tests__/components/BookCard.test.jsx`

- [ ] **Step 1: Write failing tests for `BookCard`**

Key behaviours to test: score badge renders, series badge shows when `series_id` matches a known series, series badge is silently omitted when `series_id` is unknown, "weeks on list" shows only when > 1, cover fallback renders when `cover_url` is absent.

```jsx
// __tests__/components/BookCard.test.jsx
import { render, screen } from '@testing-library/react';
import BookCard from '@/components/BookCard';

const seriesMap = { 'stormlight-archive': 'stormlight-archive' };

const baseBook = {
  id: 'test-book',
  title: 'Test Book',
  author: 'Test Author',
  cover_url: '',
  description: 'A test description.',
  sources: ['nyt', 'goodreads'],
  score: 2,
  rank: 1,
  new_this_week: false,
  weeks_on_list: 1,
  amazon_url: 'https://www.amazon.com/s?k=Test+Book&tag=YOURTAG-20',
};

describe('BookCard', () => {
  it('renders title and author', () => {
    render(<BookCard book={baseBook} seriesMap={seriesMap} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders the correct score badge for score 2', () => {
    render(<BookCard book={baseBook} seriesMap={seriesMap} />);
    expect(screen.getByText(/Trending/)).toBeInTheDocument();
  });

  it('renders score 3 badge as Top Pick', () => {
    render(<BookCard book={{ ...baseBook, score: 3, sources: ['nyt', 'guardian', 'goodreads'] }} seriesMap={seriesMap} />);
    expect(screen.getByText(/Top Pick/)).toBeInTheDocument();
  });

  it('does not show "weeks on list" when weeks_on_list is 1', () => {
    render(<BookCard book={{ ...baseBook, weeks_on_list: 1 }} seriesMap={seriesMap} />);
    expect(screen.queryByText(/weeks on list/i)).not.toBeInTheDocument();
  });

  it('shows "weeks on list" when weeks_on_list > 1', () => {
    render(<BookCard book={{ ...baseBook, weeks_on_list: 5 }} seriesMap={seriesMap} />);
    expect(screen.getByText(/5 weeks on list/i)).toBeInTheDocument();
  });

  it('shows series badge when series_id exists in seriesMap', () => {
    render(
      <BookCard
        book={{ ...baseBook, series_id: 'stormlight-archive', series_book_number: 2 }}
        seriesMap={seriesMap}
      />
    );
    expect(screen.getByText(/Part of a series/i)).toBeInTheDocument();
  });

  it('silently omits series badge when series_id is not in seriesMap', () => {
    render(
      <BookCard
        book={{ ...baseBook, series_id: 'unknown-series' }}
        seriesMap={seriesMap}
      />
    );
    expect(screen.queryByText(/Part of a series/i)).not.toBeInTheDocument();
  });

  it('renders a Buy on Amazon link', () => {
    render(<BookCard book={baseBook} seriesMap={seriesMap} />);
    const link = screen.getByRole('link', { name: /buy on amazon/i });
    expect(link).toHaveAttribute('href', baseBook.amazon_url);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders a text placeholder when cover_url is empty', () => {
    render(<BookCard book={{ ...baseBook, cover_url: '' }} seriesMap={seriesMap} />);
    // placeholder shows the book title
    expect(screen.getAllByText('Test Book').length).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern=BookCard
```

Expected: FAIL — "Cannot find module '@/components/BookCard'"

- [ ] **Step 3: Create `src/components/SourceBadge.jsx`**

```jsx
// src/components/SourceBadge.jsx
const SOURCE_LABELS = {
  nyt: 'NYT',
  guardian: 'Guardian',
  goodreads: 'Goodreads',
};

export default function SourceBadge({ source }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-label uppercase tracking-wide">
      {SOURCE_LABELS[source] ?? source}
    </span>
  );
}
```

- [ ] **Step 4: Create `src/components/BookCard.jsx`**

`seriesMap` is a plain object keyed by `series_id`. It is passed from the parent page so the card can check if a series_id is valid without importing the full series data.

```jsx
// src/components/BookCard.jsx
import Link from 'next/link';
import SourceBadge from './SourceBadge';
import { scoreBadge } from '@/utils/scoring';

export default function BookCard({ book, seriesMap = {} }) {
  const badge = scoreBadge(book.score);
  const hasValidSeries = book.series_id && seriesMap[book.series_id];

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
      {/* Cover */}
      <div className="w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-center text-on-surface-variant text-sm font-body px-4">
            {book.title}
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Score badge */}
        <span className="text-xs font-label font-medium text-secondary">
          {badge.emoji} {badge.label}
        </span>

        <div>
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {book.title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{book.author}</p>
        </div>

        {/* Source badges */}
        <div className="flex flex-wrap gap-1">
          {book.sources.map((s) => (
            <SourceBadge key={s} source={s} />
          ))}
        </div>

        {/* Weeks on list */}
        {book.weeks_on_list > 1 && (
          <p className="text-xs text-on-surface-variant font-label">
            {book.weeks_on_list} weeks on list
          </p>
        )}

        {/* Series badge */}
        {hasValidSeries && (
          <Link
            href={`/series/${book.series_id}`}
            className="text-xs text-secondary font-label hover:underline"
          >
            📚 Part of a series
          </Link>
        )}

        {/* Description */}
        <p className="text-sm text-on-surface-variant font-body flex-1">
          {book.description}
        </p>

        {/* CTA */}
        <a
          href={book.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block text-center bg-primary text-on-primary text-sm font-label font-medium px-4 py-2 rounded-lg transition-opacity duration-300 hover:opacity-80"
        >
          Buy on Amazon
        </a>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Run BookCard tests to verify they pass**

```bash
npm test -- --testPathPattern=BookCard
```

Expected: 9 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/SourceBadge.jsx src/components/BookCard.jsx __tests__/components/BookCard.test.jsx
git commit -m "feat: add SourceBadge and BookCard components with tests"
```

---

## Task 5: AdCard + FooterAdZone

**Files:**
- Create: `src/components/AdCard.jsx`
- Create: `src/components/FooterAdZone.jsx`
- Create: `__tests__/components/AdCard.test.jsx`
- Create: `__tests__/components/FooterAdZone.test.jsx`

- [ ] **Step 1: Write failing tests for `AdCard`**

```jsx
// __tests__/components/AdCard.test.jsx
import { render, screen } from '@testing-library/react';
import AdCard from '@/components/AdCard';

describe('AdCard', () => {
  it('renders direct ad with title and CTA', () => {
    const ad = {
      id: 'ad-001',
      type: 'direct',
      title: 'Test Sponsor',
      description: 'A sponsor description.',
      image_url: '/images/test.jpg',
      cta_text: 'Learn more',
      url: 'https://example.com',
      active: true,
    };
    render(<AdCard ad={ad} />);
    expect(screen.getByText('Test Sponsor')).toBeInTheDocument();
    expect(screen.getByText('Sponsored')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render when active is false', () => {
    const ad = { id: 'ad-003', type: 'direct', title: 'Inactive', active: false };
    const { container } = render(<AdCard ad={ad} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders AdSense ins tag for adsense type', () => {
    const ad = { id: 'ad-002', type: 'adsense', slot_id: '0000000000', active: true };
    render(<AdCard ad={ad} />);
    expect(screen.getByText('Sponsored')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Write failing tests for `FooterAdZone`**

```jsx
// __tests__/components/FooterAdZone.test.jsx
import { render, screen } from '@testing-library/react';
import FooterAdZone from '@/components/FooterAdZone';

const ads = [
  { id: 'ad-001', type: 'direct', title: 'Active Ad', description: 'Desc', cta_text: 'Go', url: '#', active: true },
  { id: 'ad-002', type: 'direct', title: 'Inactive Ad', description: 'Desc', cta_text: 'Go', url: '#', active: false },
];

describe('FooterAdZone', () => {
  it('renders the section heading', () => {
    render(<FooterAdZone ads={ads} />);
    expect(screen.getByText('You might also enjoy')).toBeInTheDocument();
  });

  it('renders only active ads', () => {
    render(<FooterAdZone ads={ads} />);
    expect(screen.getByText('Active Ad')).toBeInTheDocument();
    expect(screen.queryByText('Inactive Ad')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm test -- --testPathPattern="AdCard|FooterAdZone"
```

Expected: FAIL — modules not found.

- [ ] **Step 4: Create `src/components/AdCard.jsx`**

Must visually match `BookCard` exactly in dimensions, radius, shadow, and padding. "Sponsored" label top-right.

```jsx
// src/components/AdCard.jsx
export default function AdCard({ ad }) {
  if (!ad.active) return null;

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300 relative">
      {/* Sponsored label */}
      <span className="absolute top-3 right-3 text-xs text-on-surface-variant font-label">
        Sponsored
      </span>

      {/* Image */}
      {ad.image_url && (
        <div className="w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low">
          <img src={ad.image_url} alt={ad.title ?? ''} className="w-full h-full object-cover" />
        </div>
      )}

      {/* AdSense slot */}
      {ad.type === 'adsense' && (
        <div className="w-full aspect-[2/3] rounded-t-xl bg-surface-container-low flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-PLACEHOLDER"
            data-ad-slot={ad.slot_id}
            data-ad-format="auto"
          />
        </div>
      )}

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {ad.title && (
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {ad.title}
          </h3>
        )}
        {ad.description && (
          <p className="text-sm text-on-surface-variant font-body flex-1">{ad.description}</p>
        )}
        {ad.url && ad.cta_text && (
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-auto block text-center bg-primary text-on-primary text-sm font-label font-medium px-4 py-2 rounded-lg transition-opacity duration-300 hover:opacity-80"
          >
            {ad.cta_text}
          </a>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Create `src/components/FooterAdZone.jsx`**

```jsx
// src/components/FooterAdZone.jsx
import AdCard from './AdCard';

export default function FooterAdZone({ ads }) {
  const activeAds = ads.filter((ad) => ad.active);
  if (activeAds.length === 0) return null;

  return (
    <section className="bg-surface-container-low py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-headline text-[1.75rem] font-medium text-on-surface mb-8">
          You might also enjoy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run AdCard + FooterAdZone tests to verify they pass**

```bash
npm test -- --testPathPattern="AdCard|FooterAdZone"
```

Expected: 5 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/AdCard.jsx src/components/FooterAdZone.jsx __tests__/components/AdCard.test.jsx __tests__/components/FooterAdZone.test.jsx
git commit -m "feat: add AdCard and FooterAdZone components with tests"
```

---

## Task 6: SeriesCard

**Files:**
- Create: `src/components/SeriesCard.jsx`

No unit tests — pure presentational card with no logic. Verify visually.

- [ ] **Step 1: Create `src/components/SeriesCard.jsx`**

Shows: title, author, genre chips, book count. Links to `/series/[id]`.

```jsx
// src/components/SeriesCard.jsx
import Link from 'next/link';

export default function SeriesCard({ series }) {
  return (
    <Link href={`/series/${series.id}`} className="block">
      <article className="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-3 hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
        <div>
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {series.title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{series.author}</p>
        </div>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-1">
          {series.genres.map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-label"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="text-xs text-on-surface-variant font-label">
          {series.total_books} {series.total_books === 1 ? 'book' : 'books'}
        </p>
      </article>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SeriesCard.jsx
git commit -m "feat: add SeriesCard component"
```

---

## Task 7: SearchBar

**Files:**
- Create: `src/components/SearchBar.jsx`
- Create: `__tests__/components/SearchBar.test.jsx`

- [ ] **Step 1: Write failing tests for `SearchBar`**

The SearchBar calls `onChange(query)` with the current input value on every keystroke.

```jsx
// __tests__/components/SearchBar.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders an input field', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onChange with the new value when user types', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'dune' } });
    expect(onChange).toHaveBeenCalledWith('dune');
  });

  it('displays the controlled value', () => {
    render(<SearchBar value="reacher" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('reacher');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern=SearchBar
```

Expected: FAIL — "Cannot find module '@/components/SearchBar'"

- [ ] **Step 3: Create `src/components/SearchBar.jsx`**

Controlled component. `onChange` is called with the raw string value — no routing, no dropdown.

```jsx
// src/components/SearchBar.jsx
'use client';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search books and series…"
        className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-secondary outline-none px-0 py-2 text-on-surface placeholder-on-surface-variant text-base font-body transition-colors duration-300"
      />
    </div>
  );
}
```

- [ ] **Step 4: Run SearchBar tests to verify they pass**

```bash
npm test -- --testPathPattern=SearchBar
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SearchBar.jsx __tests__/components/SearchBar.test.jsx
git commit -m "feat: add SearchBar component with tests"
```

---

## Task 8: ReadingOrderTabs

**Files:**
- Create: `src/components/ReadingOrderTabs.jsx`
- Create: `__tests__/components/ReadingOrderTabs.test.jsx`

- [ ] **Step 1: Write failing tests for `ReadingOrderTabs`**

Key behaviours: tab toggle visible when orders differ; tab toggle hidden and single list shown when orders are identical (compared by title at each position); clicking a tab switches the displayed list.

```jsx
// __tests__/components/ReadingOrderTabs.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ReadingOrderTabs from '@/components/ReadingOrderTabs';

const differentOrders = {
  chronological: [
    { position: 1, title: 'New Spring', amazon_url: '#' },
    { position: 2, title: 'Eye of the World', amazon_url: '#' },
  ],
  authors_recommended: [
    { position: 1, title: 'Eye of the World', amazon_url: '#' },
    { position: 2, title: 'New Spring', amazon_url: '#' },
  ],
};

const identicalOrders = {
  chronological: [
    { position: 1, title: 'Killing Floor', amazon_url: '#' },
    { position: 2, title: 'Die Trying', amazon_url: '#' },
  ],
  authors_recommended: [
    { position: 1, title: 'Killing Floor', amazon_url: '#' },
    { position: 2, title: 'Die Trying', amazon_url: '#' },
  ],
};

describe('ReadingOrderTabs', () => {
  it('shows tab toggle when orders differ', () => {
    render(<ReadingOrderTabs orders={differentOrders} />);
    expect(screen.getByText(/Chronological/)).toBeInTheDocument();
    expect(screen.getByText(/Author's Recommended/)).toBeInTheDocument();
  });

  it("defaults to Author's Recommended tab", () => {
    render(<ReadingOrderTabs orders={differentOrders} />);
    expect(screen.getByText('Eye of the World')).toBeInTheDocument();
  });

  it('switches to Chronological list on tab click', () => {
    render(<ReadingOrderTabs orders={differentOrders} />);
    fireEvent.click(screen.getByText(/Chronological/));
    expect(screen.getByText('New Spring')).toBeInTheDocument();
  });

  it('hides tab toggle and shows single list when orders are identical', () => {
    render(<ReadingOrderTabs orders={identicalOrders} />);
    expect(screen.queryByText(/Chronological/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Author's Recommended/)).not.toBeInTheDocument();
    expect(screen.getByText('Killing Floor')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --testPathPattern=ReadingOrderTabs
```

Expected: FAIL — "Cannot find module '@/components/ReadingOrderTabs'"

- [ ] **Step 3: Create `src/components/ReadingOrderTabs.jsx`**

```jsx
// src/components/ReadingOrderTabs.jsx
'use client';

import { useState } from 'react';

function ordersAreIdentical(a, b) {
  if (a.length !== b.length) return false;
  return a.every((item, i) => item.title === b[i].title);
}

function BookList({ books }) {
  return (
    <ol className="flex flex-col gap-4">
      {books.map((book) => (
        <li key={book.position} className="flex items-start gap-4">
          <span className="text-sm font-label font-medium text-on-surface-variant w-6 shrink-0 pt-0.5">
            {book.position}.
          </span>
          <div className="flex-1">
            <p className="font-body font-semibold text-on-surface text-base">{book.title}</p>
            {book.note && (
              <p className="text-xs text-on-surface-variant mt-0.5 italic">{book.note}</p>
            )}
          </div>
          <a
            href={book.amazon_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-label font-medium bg-primary text-on-primary px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity duration-300 shrink-0"
          >
            Buy
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function ReadingOrderTabs({ orders }) {
  const [activeTab, setActiveTab] = useState('authors_recommended');
  const identical = ordersAreIdentical(orders.chronological, orders.authors_recommended);

  if (identical) {
    return <BookList books={orders.chronological} />;
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-8">
        {[
          { key: 'authors_recommended', label: "✍️ Author's Recommended" },
          { key: 'chronological', label: '📖 Chronological' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-label font-medium transition-colors duration-300 ${
              activeTab === tab.key
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <BookList books={orders[activeTab]} />
    </div>
  );
}
```

- [ ] **Step 4: Run ReadingOrderTabs tests to verify they pass**

```bash
npm test -- --testPathPattern=ReadingOrderTabs
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ReadingOrderTabs.jsx __tests__/components/ReadingOrderTabs.test.jsx
git commit -m "feat: add ReadingOrderTabs component with tests"
```

---

## Task 9: HomePage

**Files:**
- Modify: `src/app/page.jsx`

This is a Server Component. It imports data from JSON, builds a `seriesMap` for BookCard lookups, and manages search state via a client-side island (`SearchBar`). Since Server Components can't hold state, `page.jsx` delegates filtering to a client wrapper.

Create a thin client wrapper `src/app/HomeContent.jsx` that holds the search state and receives the raw data as props from the server component.

- Create: `src/app/HomeContent.jsx`
- Modify: `src/app/page.jsx`

- [ ] **Step 1: Create `src/app/HomeContent.jsx`**

This is the client island that owns the search query state and filters both lists.

```jsx
// src/app/HomeContent.jsx
'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import SeriesCard from '@/components/SeriesCard';

function matchesQuery(query, ...fields) {
  const q = query.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

export default function HomeContent({ books, series, seriesMap, updatedDate }) {
  const [query, setQuery] = useState('');

  const filteredBooks = query
    ? books.filter((b) => matchesQuery(query, b.title, b.author))
    : books;

  const filteredSeries = query
    ? series.filter((s) => matchesQuery(query, s.title, s.author))
    : series;

  const allGenres = [...new Set(series.flatMap((s) => s.genres))].sort();
  const [activeGenre, setActiveGenre] = useState(null);

  const displayedSeries = activeGenre
    ? filteredSeries.filter((s) => s.genres.includes(activeGenre))
    : filteredSeries;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-container py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-[3.5rem] font-semibold text-on-primary leading-tight tracking-[-0.02em] mb-4">
            JacketList
          </h1>
          <p className="text-on-primary/80 text-lg font-body mb-8">
            The list worth reading. In the right order.
          </p>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {/* Weekly Bestsellers */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4 mb-8">
            <h2 className="font-headline text-[1.75rem] font-medium text-on-surface">
              Weekly Bestsellers
            </h2>
            <span className="text-sm text-on-surface-variant font-label">
              Updated {updatedDate}
            </span>
          </div>
          {filteredBooks.length === 0 ? (
            <p className="text-on-surface-variant">No books match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} seriesMap={seriesMap} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Series */}
      <section className="bg-surface-container-low py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-[1.75rem] font-medium text-on-surface mb-6">
            Popular Series
          </h2>

          {/* Genre filter chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveGenre(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300 ${
                activeGenre === null
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              All
            </button>
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre === activeGenre ? null : genre)}
                className={`px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300 ${
                  activeGenre === genre
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {displayedSeries.length === 0 ? (
            <p className="text-on-surface-variant">No series match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedSeries.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Replace `src/app/page.jsx`**

```jsx
// src/app/page.jsx
import bestsellersData from '@/data/bestsellers.json';
import seriesData from '@/data/series.json';
import adsData from '@/data/ads.json';
import HomeContent from './HomeContent';
import FooterAdZone from '@/components/FooterAdZone';

export default function HomePage() {
  // Build seriesMap: { [series_id]: series_id } for BookCard validity checks
  const seriesMap = Object.fromEntries(
    seriesData.series.map((s) => [s.id, s.id])
  );

  // Sort books: score desc, rank asc
  const books = [...bestsellersData.books].sort(
    (a, b) => b.score - a.score || a.rank - b.rank
  );

  return (
    <>
      <HomeContent
        books={books}
        series={seriesData.series}
        seriesMap={seriesMap}
        updatedDate={bestsellersData.updated}
      />
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
```

- [ ] **Step 3: Start dev server and verify HomePage**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Hero with "JacketList" headline and search input
- 6 BookCards in grid, sorted score-desc then rank-asc
- Score badges correct (🔥🔥⬆️⬆️👀👀)
- Series badges visible on series-linked books
- "Weeks on list" text visible on books with weeks_on_list > 1
- Series section with 4 SeriesCards
- Genre filter chips for "Fantasy", "Historical Fiction", "Romance", "Thriller"
- FooterAdZone with "You might also enjoy" and 2 active ads
- Footer with FTC disclosure

- [ ] **Step 4: Verify search filters both sections**

Type "Sanderson" in the search bar. Confirm only Sanderson books/series appear.
Type "Lee Child" — confirm Killing Floor and Jack Reacher appear.
Note: genre filtering uses the genre chip buttons, not the search bar — "Thriller" typed into search won't filter by genre.
Clear the input — confirm all results return.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.jsx src/app/HomeContent.jsx
git commit -m "feat: build HomePage with hero, bestsellers, series grid, and search filtering"
```

---

## Task 10: SeriesPage

**Files:**
- Create: `src/app/series/[id]/page.jsx`

- [ ] **Step 1: Create `src/app/series/[id]/page.jsx`**

```jsx
// src/app/series/[id]/page.jsx
import { notFound } from 'next/navigation';
import seriesData from '@/data/series.json';
import adsData from '@/data/ads.json';
import ReadingOrderTabs from '@/components/ReadingOrderTabs';
import FooterAdZone from '@/components/FooterAdZone';

export function generateStaticParams() {
  return seriesData.series.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }) {
  const series = seriesData.series.find((s) => s.id === params.id);
  if (!series) return {};
  return {
    title: `${series.title} Reading Order | JacketList`,
    description: series.description,
  };
}

export default function SeriesPage({ params }) {
  const series = seriesData.series.find((s) => s.id === params.id);
  if (!series) notFound();

  return (
    <>
      {/* Series header */}
      <section className="py-16 px-8">
        <div className="max-w-3xl mx-auto">
          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {series.genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-label"
              >
                {genre}
              </span>
            ))}
          </div>

          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface leading-tight tracking-[-0.02em] mb-2">
            {series.title}
          </h1>
          <p className="text-on-surface-variant text-base font-body mb-1">{series.author}</p>
          <p className="text-sm text-on-surface-variant font-label mb-6">
            {series.total_books} {series.total_books === 1 ? 'book' : 'books'}
          </p>
          <p className="text-base font-body text-on-surface leading-relaxed">{series.description}</p>
        </div>
      </section>

      {/* Bestseller banner */}
      {series.currently_on_bestseller_list && (
        <section className="px-8 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-secondary-container text-on-secondary-container rounded-xl px-5 py-3 text-sm font-label font-medium">
              🔥 Currently on the bestseller list
            </div>
          </div>
        </section>
      )}

      {/* Reading order */}
      <section className="bg-surface-container-low py-16 px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline text-[1.75rem] font-medium text-on-surface mb-8">
            Reading Order
          </h2>
          <ReadingOrderTabs orders={series.orders} />
        </div>
      </section>

      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
```

- [ ] **Step 2: Verify series pages in dev**

```bash
npm run dev
```

Visit `http://localhost:3000/series/wheel-of-time`. Confirm:
- Title, author, genres, book count, description
- Bestseller banner visible (currently_on_bestseller_list: true)
- Two tabs visible (orders differ)
- Author's Recommended is default active tab
- Tab toggle switches the list

Visit `http://localhost:3000/series/jack-reacher`. Confirm:
- No bestseller banner
- No tab toggle (orders are identical)
- Single list of 3 books

- [ ] **Step 3: Commit**

```bash
git add src/app/series/
git commit -m "feat: build SeriesPage with reading order tabs and static params"
```

---

## Task 11: Static Content Pages

**Files:**
- Create: `src/app/methodology/page.jsx`
- Create: `src/app/editorial-policy/page.jsx`

- [ ] **Step 1: Create `src/app/methodology/page.jsx`**

```jsx
// src/app/methodology/page.jsx
export const metadata = {
  title: 'Methodology | JacketList',
  description: 'How JacketList compiles its weekly bestseller rankings.',
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface leading-tight tracking-[-0.02em] mb-8">
        Methodology
      </h1>

      <div className="prose-like space-y-8 font-body text-on-surface">
        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">How we compile the list</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            Every week, JacketList aggregates bestseller data from three authoritative sources: the{' '}
            <strong className="text-on-surface">New York Times</strong> bestseller list, the{' '}
            <strong className="text-on-surface">Guardian</strong> books chart, and{' '}
            <strong className="text-on-surface">Goodreads</strong> trending titles. We look at
            current rankings across all three sources and compile a unified list.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">Scoring</h2>
          <p className="text-base leading-relaxed text-on-surface-variant mb-4">
            Each book earns a score based on how many of the three sources it appears in:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="text-xl">🔥</span>
              <div>
                <strong className="text-on-surface">Top Pick (score 3)</strong>
                <p className="text-sm text-on-surface-variant">Appears on all three lists simultaneously.</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">⬆️</span>
              <div>
                <strong className="text-on-surface">Trending (score 2)</strong>
                <p className="text-sm text-on-surface-variant">Appears on two of the three lists.</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">👀</span>
              <div>
                <strong className="text-on-surface">Worth Watching (score 1)</strong>
                <p className="text-sm text-on-surface-variant">Appears on one list — newly charting or niche breakout.</p>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">Update frequency</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            The list is refreshed every <strong className="text-on-surface">Monday</strong> using
            publicly available bestseller data. The date shown on the homepage reflects the most
            recent update.
          </p>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/editorial-policy/page.jsx`**

```jsx
// src/app/editorial-policy/page.jsx
export const metadata = {
  title: 'Editorial Policy | JacketList',
  description: "How JacketList determines series reading orders.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface leading-tight tracking-[-0.02em] mb-8">
        Editorial Policy
      </h1>

      <div className="space-y-8 font-body text-on-surface">
        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">How reading orders are determined</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            JacketList maintains two reading orders for every series: a{' '}
            <strong className="text-on-surface">Chronological</strong> order and an{' '}
            <strong className="text-on-surface">Author{"'"}s Recommended</strong> order. These are
            researched from author interviews, official series websites, and publishing notes.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">
            What "Author{"'"}s Recommended" means
          </h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            The Author{"'"}s Recommended order reflects the sequence the author has publicly stated
            is the best way to experience the series for the first time. This is often — but not
            always — the publication order. Where an author has given conflicting advice over time,
            we use the most recent authoritative statement.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">How we resolve conflicts</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            When the chronological order and the author{"'"}s recommended order are identical, we
            display a single reading list without the tab toggle. When they differ, we default to
            showing the Author{"'"}s Recommended order and allow readers to switch to Chronological
            if they prefer.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">Affiliate disclosure</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            All book links on JacketList are Amazon Associates affiliate links. JacketList earns a
            small commission on qualifying purchases at no extra cost to you. This does not influence
            which books or series appear on the site — our rankings and reading orders are editorially
            independent.
          </p>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify pages in dev**

Open `http://localhost:3000/methodology` and `http://localhost:3000/editorial-policy`. Confirm Nav and Footer render, content is legible.

- [ ] **Step 4: Commit**

```bash
git add src/app/methodology/ src/app/editorial-policy/
git commit -m "feat: add Methodology and Editorial Policy static pages"
```

---

## Task 12: Final Build Validation

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests PASS. Confirm count ≥ 25 tests.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: `out/` directory produced with no errors. Pages generated:
- `out/index.html`
- `out/series/wheel-of-time/index.html`
- `out/series/stormlight-archive/index.html`
- `out/series/jack-reacher/index.html`
- `out/series/outlander/index.html`
- `out/methodology/index.html`
- `out/editorial-policy/index.html`

- [ ] **Step 3: Serve and smoke-test the static build**

```bash
npx serve out
```

Open `http://localhost:3000`. Click through:
- Homepage loads, search works
- Each series page loads from the nav
- Methodology and Editorial Policy pages load
- Footer links work
- All Amazon links have `target="_blank"`

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: final build validation — all pages generated, all tests passing"
```

---

## Pre-Launch Checklist (not in scope for this plan — for reference)

- Replace all `YOURTAG-20` instances with real Amazon Associates tag
- Replace AdSense slot `0000000000` with real slot ID
- Add real book cover images or verify Open Library URLs resolve
- Add real sponsor images to `public/images/ads/`
- Deploy `out/` to Vercel/Netlify
