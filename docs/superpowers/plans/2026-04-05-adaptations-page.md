# Adaptations Page + Series Gaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/adaptations` page listing books adapted into movies/TV, a genre+type filter bar, and a `docs/series-gaps.md` checklist of ~25 missing series; update Nav and CLAUDE.md.

**Architecture:** Static data in `src/data/adaptations.json` imported at build time by a server component (`src/app/adaptations/page.jsx`) that passes data to a client component (`AdaptationsContent.jsx`) owning filter state. A new `AdaptationCard` component matches the visual footprint of `BookCard` and `SeriesCard`.

**Tech Stack:** Next.js 14 App Router (static export), React JSX, Tailwind CSS, Jest + @testing-library/react

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/data/adaptations.json` | Seed data — 10 adaptation entries |
| Create | `src/components/AdaptationCard.jsx` | Renders a single adaptation card |
| Create | `src/app/adaptations/AdaptationsContent.jsx` | Client component — owns type + genre filter state |
| Create | `src/app/adaptations/page.jsx` | Server component — imports JSON, renders page shell |
| Modify | `src/components/Nav.jsx` | Add "Adaptations" link |
| Create | `__tests__/components/AdaptationCard.test.jsx` | Unit tests for AdaptationCard |
| Create | `__tests__/components/AdaptationsContent.test.jsx` | Unit tests for AdaptationsContent filter logic |
| Create | `docs/series-gaps.md` | Living checklist of ~25 missing series |
| Modify | `CLAUDE.md` | Document new page, component, and data file |

---

## Task 1: Create `adaptations.json` seed data

**Files:**
- Create: `src/data/adaptations.json`

- [ ] **Step 1: Write the file**

```json
{
  "updated": "2026-04-05",
  "adaptations": [
    {
      "id": "gone-girl",
      "book_title": "Gone Girl",
      "author": "Gillian Flynn",
      "adaptation_title": "Gone Girl (2014)",
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
    },
    {
      "id": "big-little-lies",
      "book_title": "Big Little Lies",
      "author": "Liane Moriarty",
      "adaptation_title": "Big Little Lies (HBO)",
      "type": "tv",
      "genres": ["Thriller", "Mystery"],
      "hook": "The show is superb — the book gives you an extra layer of dark wit.",
      "cover_url": "https://covers.openlibrary.org/b/id/8228691-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Big+Little+Lies+Liane+Moriarty&tag=jacketlist-20",
      "series_id": null
    },
    {
      "id": "the-handmaids-tale",
      "book_title": "The Handmaid's Tale",
      "author": "Margaret Atwood",
      "adaptation_title": "The Handmaid's Tale (Hulu)",
      "type": "tv",
      "genres": ["Sci-Fi"],
      "hook": "Atwood's prose is as suffocating as the world it describes.",
      "cover_url": "https://covers.openlibrary.org/b/id/8406526-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=The+Handmaids+Tale+Atwood&tag=jacketlist-20",
      "series_id": null
    },
    {
      "id": "game-of-thrones",
      "book_title": "A Song of Ice and Fire",
      "author": "George R.R. Martin",
      "adaptation_title": "Game of Thrones (HBO)",
      "type": "tv",
      "genres": ["Fantasy"],
      "hook": "The show ended. The books haven't — and they go much further.",
      "cover_url": "https://covers.openlibrary.org/b/id/8655752-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=A+Game+of+Thrones+George+Martin&tag=jacketlist-20",
      "series_id": "a-song-of-ice-and-fire"
    },
    {
      "id": "the-martian",
      "book_title": "The Martian",
      "author": "Andy Weir",
      "adaptation_title": "The Martian (2015)",
      "type": "movie",
      "genres": ["Sci-Fi"],
      "hook": "More jokes, more science, more survival anxiety — in the best way.",
      "cover_url": "https://covers.openlibrary.org/b/id/8219682-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=The+Martian+Andy+Weir&tag=jacketlist-20",
      "series_id": null
    },
    {
      "id": "outlander",
      "book_title": "Outlander",
      "author": "Diana Gabaldon",
      "adaptation_title": "Outlander (Starz)",
      "type": "tv",
      "genres": ["Romance", "Historical Fiction"],
      "hook": "Eight seasons of TV can't contain what Gabaldon packed into eight novels.",
      "cover_url": "https://covers.openlibrary.org/b/id/8408951-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Outlander+Diana+Gabaldon&tag=jacketlist-20",
      "series_id": "outlander"
    },
    {
      "id": "lord-of-the-rings",
      "book_title": "The Lord of the Rings",
      "author": "J.R.R. Tolkien",
      "adaptation_title": "The Lord of the Rings (films)",
      "type": "movie",
      "genres": ["Fantasy"],
      "hook": "Jackson's trilogy is a masterpiece — Tolkien's prose is a different kind of magic.",
      "cover_url": "https://covers.openlibrary.org/b/id/8405665-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Lord+of+the+Rings+Tolkien&tag=jacketlist-20",
      "series_id": "the-lord-of-the-rings"
    },
    {
      "id": "sharp-objects",
      "book_title": "Sharp Objects",
      "author": "Gillian Flynn",
      "adaptation_title": "Sharp Objects (HBO)",
      "type": "tv",
      "genres": ["Thriller", "Mystery"],
      "hook": "The mini-series is haunting. Flynn's debut novel is even more unsettling.",
      "cover_url": "https://covers.openlibrary.org/b/id/8353362-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Sharp+Objects+Gillian+Flynn&tag=jacketlist-20",
      "series_id": null
    },
    {
      "id": "dune",
      "book_title": "Dune",
      "author": "Frank Herbert",
      "adaptation_title": "Dune (films)",
      "type": "movie",
      "genres": ["Sci-Fi"],
      "hook": "Villeneuve captured the scale — the book captures the philosophy.",
      "cover_url": "https://covers.openlibrary.org/b/id/8474139-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Dune+Frank+Herbert&tag=jacketlist-20",
      "series_id": "dune"
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/adaptations.json
git commit -m "feat: add adaptations.json seed data (10 entries)"
```

---

## Task 2: `AdaptationCard` component + test

**Files:**
- Create: `src/components/AdaptationCard.jsx`
- Create: `__tests__/components/AdaptationCard.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
// __tests__/components/AdaptationCard.test.jsx
import { render, screen } from '@testing-library/react';
import AdaptationCard from '@/components/AdaptationCard';

const baseAdaptation = {
  id: 'gone-girl',
  book_title: 'Gone Girl',
  author: 'Gillian Flynn',
  adaptation_title: 'Gone Girl (2014)',
  type: 'movie',
  genres: ['Thriller', 'Mystery'],
  hook: "If the film's unreliable narrators gripped you, the book cuts even deeper.",
  cover_url: '',
  amazon_url: 'https://www.amazon.com/s?k=Gone+Girl&tag=jacketlist-20',
  series_id: null,
};

const tvAdaptation = {
  ...baseAdaptation,
  id: 'the-witcher',
  book_title: 'The Witcher',
  author: 'Andrzej Sapkowski',
  adaptation_title: 'The Witcher (Netflix)',
  type: 'tv',
  genres: ['Fantasy'],
  hook: "The show barely scratches the surface of Sapkowski's richly built world.",
  series_id: 'the-witcher',
};

describe('AdaptationCard', () => {
  it('renders book title and author', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getByRole('heading', { name: 'Gone Girl' })).toBeInTheDocument();
    expect(screen.getByText('Gillian Flynn')).toBeInTheDocument();
  });

  it('renders the adaptation title', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getByText('Gone Girl (2014)')).toBeInTheDocument();
  });

  it('renders the hook text', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getByText(baseAdaptation.hook)).toBeInTheDocument();
  });

  it('shows 🎬 Movie badge for type "movie"', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getByText('🎬 Movie')).toBeInTheDocument();
  });

  it('shows 📺 TV Series badge for type "tv"', () => {
    render(<AdaptationCard adaptation={tvAdaptation} />);
    expect(screen.getByText('📺 TV Series')).toBeInTheDocument();
  });

  it('shows "📚 Full series →" link when series_id is set', () => {
    render(<AdaptationCard adaptation={tvAdaptation} />);
    const link = screen.getByRole('link', { name: /Full series/i });
    expect(link).toHaveAttribute('href', '/series/the-witcher');
  });

  it('omits series link when series_id is null', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.queryByRole('link', { name: /Full series/i })).not.toBeInTheDocument();
  });

  it('renders a Buy on Amazon link that opens in a new tab', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    const link = screen.getByRole('link', { name: /buy on amazon/i });
    expect(link).toHaveAttribute('href', baseAdaptation.amazon_url);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders a text placeholder when cover_url is empty', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getAllByText('Gone Girl').length).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest __tests__/components/AdaptationCard.test.jsx --no-coverage
```

Expected: FAIL — `Cannot find module '@/components/AdaptationCard'`

- [ ] **Step 3: Write the component**

```jsx
// src/components/AdaptationCard.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

const TYPE_BADGE = {
  movie: '🎬 Movie',
  tv: '📺 TV Series',
};

export default function AdaptationCard({ adaptation }) {
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
      {/* Cover */}
      <div className="relative w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
        {adaptation.cover_url && !coverFailed ? (
          <img
            src={adaptation.cover_url}
            alt={adaptation.book_title}
            className="w-full h-full object-cover"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className="text-center text-on-surface-variant text-sm font-body px-4">
            {adaptation.book_title}
          </span>
        )}
        {/* Type badge overlay */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-label">
          {TYPE_BADGE[adaptation.type]}
        </span>
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {adaptation.book_title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{adaptation.author}</p>
          <p className="text-xs text-on-surface-variant mt-0.5 italic">
            {adaptation.adaptation_title}
          </p>
        </div>

        <p className="text-sm text-on-surface-variant font-body italic flex-1">
          {adaptation.hook}
        </p>

        {adaptation.series_id && (
          <Link
            href={`/series/${adaptation.series_id}`}
            className="text-xs text-secondary font-label hover:underline"
          >
            📚 Full series →
          </Link>
        )}

        <a
          href={adaptation.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block text-center bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed text-sm font-label font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Buy on Amazon
        </a>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npx jest __tests__/components/AdaptationCard.test.jsx --no-coverage
```

Expected: PASS — all 9 tests green

- [ ] **Step 5: Commit**

```bash
git add src/components/AdaptationCard.jsx __tests__/components/AdaptationCard.test.jsx
git commit -m "feat: add AdaptationCard component"
```

---

## Task 3: `AdaptationsContent` client component + test

**Files:**
- Create: `src/app/adaptations/AdaptationsContent.jsx`
- Create: `__tests__/components/AdaptationsContent.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
// __tests__/components/AdaptationsContent.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import AdaptationsContent from '@/app/adaptations/AdaptationsContent';

const adaptations = [
  {
    id: 'gone-girl',
    book_title: 'Gone Girl',
    author: 'Gillian Flynn',
    adaptation_title: 'Gone Girl (2014)',
    type: 'movie',
    genres: ['Thriller', 'Mystery'],
    hook: 'A great thriller.',
    cover_url: '',
    amazon_url: 'https://www.amazon.com/s?k=Gone+Girl&tag=jacketlist-20',
    series_id: null,
  },
  {
    id: 'the-witcher',
    book_title: 'The Witcher',
    author: 'Andrzej Sapkowski',
    adaptation_title: 'The Witcher (Netflix)',
    type: 'tv',
    genres: ['Fantasy'],
    hook: 'A rich world.',
    cover_url: '',
    amazon_url: 'https://www.amazon.com/s?k=Witcher&tag=jacketlist-20',
    series_id: 'the-witcher',
  },
  {
    id: 'game-of-thrones',
    book_title: 'A Song of Ice and Fire',
    author: 'George R.R. Martin',
    adaptation_title: 'Game of Thrones (HBO)',
    type: 'tv',
    genres: ['Fantasy'],
    hook: 'The show ended.',
    cover_url: '',
    amazon_url: 'https://www.amazon.com/s?k=ASOIAF&tag=jacketlist-20',
    series_id: 'a-song-of-ice-and-fire',
  },
];

describe('AdaptationsContent', () => {
  it('renders all adaptations by default', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    expect(screen.getByText('Gone Girl')).toBeInTheDocument();
    expect(screen.getByText('The Witcher')).toBeInTheDocument();
    expect(screen.getByText('A Song of Ice and Fire')).toBeInTheDocument();
  });

  it('filters to movies only when Movie pill is clicked', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'Movie' }));
    expect(screen.getByText('Gone Girl')).toBeInTheDocument();
    expect(screen.queryByText('The Witcher')).not.toBeInTheDocument();
  });

  it('filters to TV only when TV Series pill is clicked', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'TV Series' }));
    expect(screen.queryByText('Gone Girl')).not.toBeInTheDocument();
    expect(screen.getByText('The Witcher')).toBeInTheDocument();
  });

  it('filters by genre pill', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fantasy' }));
    expect(screen.queryByText('Gone Girl')).not.toBeInTheDocument();
    expect(screen.getByText('The Witcher')).toBeInTheDocument();
    expect(screen.getByText('A Song of Ice and Fire')).toBeInTheDocument();
  });

  it('ANDs type and genre filters', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'TV Series' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fantasy' }));
    expect(screen.queryByText('Gone Girl')).not.toBeInTheDocument();
    expect(screen.getByText('The Witcher')).toBeInTheDocument();
    expect(screen.getByText('A Song of Ice and Fire')).toBeInTheDocument();
  });

  it('shows empty state when no results match', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'Movie' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fantasy' }));
    expect(screen.getByText('No results for these filters.')).toBeInTheDocument();
  });

  it('resets to all when All type pill is clicked', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'Movie' }));
    fireEvent.click(screen.getByRole('button', { name: /^All$/ }));
    expect(screen.getByText('Gone Girl')).toBeInTheDocument();
    expect(screen.getByText('The Witcher')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest __tests__/components/AdaptationsContent.test.jsx --no-coverage
```

Expected: FAIL — `Cannot find module '@/app/adaptations/AdaptationsContent'`

- [ ] **Step 3: Write the component**

```jsx
// src/app/adaptations/AdaptationsContent.jsx
'use client';

import { useState } from 'react';
import AdaptationCard from '@/components/AdaptationCard';

export default function AdaptationsContent({ allAdaptations }) {
  const [activeType, setActiveType] = useState('all');
  const [activeGenres, setActiveGenres] = useState(new Set());

  const allGenres = [...new Set(allAdaptations.flatMap((a) => a.genres))].sort();

  function toggleGenre(genre) {
    setActiveGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) { next.delete(genre); } else { next.add(genre); }
      return next;
    });
  }

  const filtered = allAdaptations.filter((a) => {
    if (activeType !== 'all' && a.type !== activeType) return false;
    if (activeGenres.size > 0 && !a.genres.some((g) => activeGenres.has(g))) return false;
    return true;
  });

  const pillBase = 'px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300';
  const pillActive = 'bg-secondary text-on-secondary';
  const pillInactive = 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container';

  return (
    <>
      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: 'All', value: 'all' },
          { label: 'Movie', value: 'movie' },
          { label: 'TV Series', value: 'tv' },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveType(value)}
            className={`${pillBase} ${activeType === value ? pillActive : pillInactive}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Genre filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`${pillBase} ${activeGenres.has(genre) ? pillActive : pillInactive}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-on-surface-variant">No results for these filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((adaptation) => (
            <AdaptationCard key={adaptation.id} adaptation={adaptation} />
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npx jest __tests__/components/AdaptationsContent.test.jsx --no-coverage
```

Expected: PASS — all 7 tests green

- [ ] **Step 5: Commit**

```bash
git add src/app/adaptations/AdaptationsContent.jsx __tests__/components/AdaptationsContent.test.jsx
git commit -m "feat: add AdaptationsContent with type + genre filter"
```

---

## Task 4: `src/app/adaptations/page.jsx` server component

**Files:**
- Create: `src/app/adaptations/page.jsx`

- [ ] **Step 1: Write the file**

```jsx
// src/app/adaptations/page.jsx
import FooterAdZone from '@/components/FooterAdZone';
import AdaptationsContent from './AdaptationsContent';
import adaptationsData from '@/data/adaptations.json';
import adsData from '@/data/ads.json';

export default function AdaptationsPage() {
  return (
    <>
      <main className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface mb-4">
            Books Behind the Screen
          </h1>
          <p className="text-on-surface-variant font-body mb-12 max-w-2xl">
            Read the book before — or after — watching.
          </p>
          <AdaptationsContent allAdaptations={adaptationsData.adaptations} />
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
```

- [ ] **Step 2: Verify the build doesn't error**

```bash
npx next build 2>&1 | tail -20
```

Expected: build completes without errors; `/adaptations` appears in the output page list

- [ ] **Step 3: Commit**

```bash
git add src/app/adaptations/page.jsx
git commit -m "feat: add /adaptations page"
```

---

## Task 5: Update `Nav.jsx`

**Files:**
- Modify: `src/components/Nav.jsx`

- [ ] **Step 1: Add the Adaptations link**

In `src/components/Nav.jsx`, replace the `<div className="flex items-center gap-6">` block:

```jsx
// Before:
<div className="flex items-center gap-6">
  <Link href="/lists" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
    Lists
  </Link>
  <Link href="/series" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
    Series
  </Link>
</div>

// After:
<div className="flex items-center gap-6">
  <Link href="/lists" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
    Lists
  </Link>
  <Link href="/series" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
    Series
  </Link>
  <Link href="/adaptations" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
    Adaptations
  </Link>
</div>
```

- [ ] **Step 2: Run full test suite**

```bash
npx jest --no-coverage
```

Expected: all tests pass

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat: add Adaptations link to Nav"
```

---

## Task 6: Create `docs/series-gaps.md`

**Files:**
- Create: `docs/series-gaps.md`

- [ ] **Step 1: Write the file**

```markdown
# Series Gaps Tracker

Notable series missing from `series.json`, organised by genre. Check a box when the series has been added.

## Thriller / Spy
- [ ] Gabriel Allon (Daniel Silva) — 24-book spy thriller, consistently NYT #1
- [ ] Scot Harvath (Brad Thor) — 23 books
- [ ] Cotton Malone (Steve Berry) — 19 books
- [ ] Sigma Force (James Rollins) — 16 books
- [ ] Dirk Pitt (Clive Cussler) — 26 books, classic adventure thriller

## Crime / Mystery
- [ ] Millennium / Girl with the Dragon Tattoo (Stieg Larsson)
- [ ] Vera (Ann Cleeves) — major TV adaptation
- [ ] Shetland (Ann Cleeves) — major TV adaptation
- [ ] Rivers of London / Peter Grant (Ben Aaronovitch) — urban fantasy/crime crossover
- [ ] Spenser (Robert B. Parker) — classic American PI, 40+ books
- [ ] Cadfael (Ellis Peters) — classic historical mystery

## Romance
- [ ] Bridgerton (Julia Quinn) — Netflix adaptation, major gap
- [ ] In Death / J.D. Robb (Nora Roberts) — 58 books, long-running
- [ ] Virgin River (Robyn Carr) — 22 books, Netflix show
- [ ] Twisted (Ana Huang) — currently very popular

## Historical Fiction
- [ ] Wolf Hall (Hilary Mantel) — Booker Prize winner
- [ ] Kingsbridge / Pillars of the Earth (Ken Follett) — major bestseller
- [ ] Sharpe (Bernard Cornwell) — more famous than Saxon Stories
- [ ] Hornblower (C.S. Forester) — classic naval fiction

## Literary Fiction
- [ ] Neapolitan Novels (Elena Ferrante) — huge international bestseller

## Children's
- [ ] Redwall (Brian Jacques) — 22 books, beloved classic
- [ ] A Series of Unfortunate Events (Lemony Snicket) — Netflix show
- [ ] How to Train Your Dragon (Cressida Cowell) — 12 books, major film franchise

## Young Adult
- [ ] Shatter Me (Tahereh Mafi) — 7 books, very popular
- [ ] Legend (Marie Lu) — popular dystopian trilogy
```

- [ ] **Step 2: Commit**

```bash
git add docs/series-gaps.md
git commit -m "docs: add series-gaps tracker checklist"
```

---

## Task 7: Update `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add `adaptations.json` to the Data Formats section**

In `CLAUDE.md`, after the `### ads.json` block, add:

````markdown
### `adaptations.json`
```json
{
  "updated": "2026-04-05",
  "adaptations": [
    {
      "id": "gone-girl",
      "book_title": "Gone Girl",
      "author": "Gillian Flynn",
      "adaptation_title": "Gone Girl (2014)",
      "type": "movie",
      "genres": ["Thriller"],
      "hook": "One-line hook shown on the card.",
      "cover_url": "https://covers.openlibrary.org/b/id/8397453-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Gone+Girl+Gillian+Flynn&tag=jacketlist-20",
      "series_id": null
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
| `genres` | string[] | Match genre vocabulary from `series.json` |
| `hook` | string | One-line "if you loved…" hook shown on the card |
| `cover_url` | string | Open Library URL or placeholder |
| `amazon_url` | string | Amazon Associates search link |
| `series_id` | string \| null | If set, links to `/series/[id]`; null for standalone books |
````

- [ ] **Step 2: Add `AdaptationCard` to the Component Guidelines section**

In `CLAUDE.md`, after the `### FooterAdZone` block, add:

```markdown
### AdaptationCard
- Used on the `/adaptations` page only
- Props: `adaptation` (object matching `adaptations.json` schema)
- Shows: cover (2:3 portrait), type badge overlay (`🎬 Movie` / `📺 TV Series`), book title, author, adaptation title (italic subtitle), hook (italic body), optional `📚 Full series →` link when `series_id` is set, "Buy on Amazon" button
- Cover fallback: text placeholder showing `book_title`
- If `series_id` is set: renders a `📚 Full series →` link to `/series/[series_id]`
- Always includes an Amazon Associates "Buy on Amazon" button (`target="_blank"`)
```

- [ ] **Step 3: Add the Adaptations page to the Pages section**

In `CLAUDE.md`, after the `### Editorial Policy` block, add:

```markdown
### Adaptations (`/adaptations`)
1. **Heading** — "Books Behind the Screen"
2. **Subheading** — "Read the book before — or after — watching"
3. **Filter bar** — Type pills (All · Movie · TV Series) + Genre pills (derived from `adaptations.json`). Filters AND together.
4. **AdaptationCard grid** — 1 col (mobile) → 2 col (tablet) → 3 col (desktop). "No results for these filters." when empty.
5. **FooterAdZone + Footer**
```

- [ ] **Step 4: Add the new files to the Project Structure section**

In `CLAUDE.md`, in the Project Structure code block, add the following lines in the appropriate places:

Under `src/app/`:
```
│   │   ├── adaptations/
│   │   │   ├── page.jsx          # AdaptationsPage (/) — server component
│   │   │   └── AdaptationsContent.jsx  # Client component — type + genre filter state
```

Under `src/components/`:
```
│   │   ├── AdaptationCard.jsx    # Adaptation card (movie/TV type badge, hook, series link)
```

Under `src/data/`:
```
│   │   ├── adaptations.json      # All adaptation entries (movie + TV, updated manually)
```

- [ ] **Step 5: Run full test suite one final time**

```bash
npx jest --no-coverage
```

Expected: all tests pass

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for adaptations page, AdaptationCard, adaptations.json"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| `src/data/adaptations.json` with correct schema | Task 1 |
| `AdaptationCard` — cover, type badge, title, author, adaptation_title, hook, series link, Buy button | Task 2 |
| `AdaptationsContent` — type pills, genre pills, AND logic, empty state | Task 3 |
| `/adaptations` page — heading, subheading, filter bar, card grid, FooterAdZone | Task 4 |
| Nav — "Adaptations" link after "Series" | Task 5 |
| `docs/series-gaps.md` — 25 series by genre | Task 6 |
| `CLAUDE.md` updated | Task 7 |
| `adaptation_title` visible on card (gap identified in review) | Task 2 (italic subtitle) |
