# New Release Badge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a ✨ New chip on SeriesCard, SeriesPage, and BookCard when a series has published a book within the last 6 months.

**Architecture:** Add an optional `latest_book: { title, release_date }` field to `series.json`. A new `isNewRelease` utility in `scoring.js` computes freshness at build time. `seriesMap` is promoted from `{ id: id }` to `{ id: seriesObject }` so BookCard can access `latest_book` without new props. SeriesCard and SeriesPage read directly from the series object.

**Tech Stack:** Next.js 14 (App Router, static export), React JSX, Tailwind CSS, Jest + React Testing Library

---

### Task 1: Add `isNewRelease` to `scoring.js`

**Files:**
- Modify: `src/utils/scoring.js`
- Test: `__tests__/utils/scoring.test.js`

- [ ] **Step 1: Write the failing tests**

Add to `__tests__/utils/scoring.test.js`:

```js
import { scoreBook, scoreBadge, computeTiebreaker, isNewRelease } from '@/utils/scoring';

describe('isNewRelease', () => {
  it('returns true for a date within 6 months', () => {
    const recent = new Date();
    recent.setMonth(recent.getMonth() - 3);
    expect(isNewRelease(recent.toISOString().slice(0, 10))).toBe(true);
  });

  it('returns false for a date older than 6 months', () => {
    const old = new Date();
    old.setMonth(old.getMonth() - 7);
    expect(isNewRelease(old.toISOString().slice(0, 10))).toBe(false);
  });

  it('returns false for null', () => {
    expect(isNewRelease(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isNewRelease(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
cd /Users/christian/Documents/jacketlist && npm test -- --testPathPattern="scoring" --no-coverage
```

Expected: FAIL — `isNewRelease is not a function`

- [ ] **Step 3: Implement `isNewRelease` in `src/utils/scoring.js`**

Add at the end of the file:

```js
export function isNewRelease(releaseDate) {
  if (!releaseDate) return false;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new Date(releaseDate) >= sixMonthsAgo;
}
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
npm test -- --testPathPattern="scoring" --no-coverage
```

Expected: All scoring tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/scoring.js __tests__/utils/scoring.test.js
git commit -m "feat: add isNewRelease utility to scoring.js"
```

---

### Task 2: Promote `seriesMap` to store full series objects

BookCard currently only uses `seriesMap` to check if a `series_id` exists. We need the full object to access `latest_book`. This task changes `seriesMap` from `{ id: id }` to `{ id: seriesObject }` and updates all consumers.

**Files:**
- Modify: `src/app/page.jsx`
- Modify: `src/components/BookCard.jsx`
- Modify: `__tests__/components/BookCard.test.jsx`

- [ ] **Step 1: Update `seriesMap` construction in `src/app/page.jsx`**

Change line 9–11 from:
```js
const seriesMap = Object.fromEntries(
  seriesData.series.map((s) => [s.id, s.id])
);
```
To:
```js
const seriesMap = Object.fromEntries(
  seriesData.series.map((s) => [s.id, s])
);
```

- [ ] **Step 2: Update `hasValidSeries` check in `src/components/BookCard.jsx`**

The existing check `seriesMap[book.series_id]` still works (truthy object vs truthy string), so no change needed there. Verify tests still pass:

```bash
npm test -- --testPathPattern="BookCard" --no-coverage
```

Expected: All BookCard tests PASS (the existing `seriesMap` fixture `{ 'stormlight-archive': 'stormlight-archive' }` remains truthy so existing tests are unaffected)

- [ ] **Step 3: Commit**

```bash
git add src/app/page.jsx
git commit -m "refactor: promote seriesMap values to full series objects"
```

---

### Task 3: Add ✨ New chip to `BookCard`

**Files:**
- Modify: `src/components/BookCard.jsx`
- Modify: `__tests__/components/BookCard.test.jsx`

- [ ] **Step 1: Write failing tests**

Add to `__tests__/components/BookCard.test.jsx`:

```js
import { render, screen } from '@testing-library/react';
import BookCard from '@/components/BookCard';

// Add a seriesMap with full series objects for new-release tests
const recentDate = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  return d.toISOString().slice(0, 10);
})();

const oldDate = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 8);
  return d.toISOString().slice(0, 10);
})();

const seriesMapWithNew = {
  'stormlight-archive': {
    id: 'stormlight-archive',
    latest_book: { title: 'Wind and Truth', release_date: recentDate },
  },
};

const seriesMapWithOld = {
  'stormlight-archive': {
    id: 'stormlight-archive',
    latest_book: { title: 'Rhythm of War', release_date: oldDate },
  },
};

it('shows ✨ New chip when series has a recent latest_book', () => {
  render(
    <BookCard
      book={{ ...baseBook, series_id: 'stormlight-archive' }}
      seriesMap={seriesMapWithNew}
    />
  );
  expect(screen.getByText('✨ New')).toBeInTheDocument();
});

it('does not show ✨ New chip when latest_book is older than 6 months', () => {
  render(
    <BookCard
      book={{ ...baseBook, series_id: 'stormlight-archive' }}
      seriesMap={seriesMapWithOld}
    />
  );
  expect(screen.queryByText('✨ New')).not.toBeInTheDocument();
});

it('does not show ✨ New chip when series has no latest_book', () => {
  render(
    <BookCard
      book={{ ...baseBook, series_id: 'stormlight-archive' }}
      seriesMap={{ 'stormlight-archive': { id: 'stormlight-archive' } }}
    />
  );
  expect(screen.queryByText('✨ New')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
npm test -- --testPathPattern="BookCard" --no-coverage
```

Expected: FAIL — `✨ New` not found

- [ ] **Step 3: Implement ✨ New chip in `src/components/BookCard.jsx`**

Add import at top:
```js
import { scoreBadge, editorialLabels, isNewRelease } from '@/utils/scoring';
```

Add a derived variable after `hasValidSeries`:
```js
const seriesObj = seriesMap[book.series_id];
const hasValidSeries = book.series_id && seriesObj;
const hasNewRelease = hasValidSeries && isNewRelease(seriesObj?.latest_book?.release_date);
```

Replace the existing series badge block:
```jsx
{/* Series badge + New chip */}
{hasValidSeries && (
  <div className="flex items-center gap-2">
    <Link
      href={`/series/${book.series_id}`}
      className="text-xs text-secondary font-label hover:underline"
    >
      📚 Part of a series
    </Link>
    {hasNewRelease && (
      <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-label">
        ✨ New
      </span>
    )}
  </div>
)}
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
npm test -- --testPathPattern="BookCard" --no-coverage
```

Expected: All BookCard tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/BookCard.jsx __tests__/components/BookCard.test.jsx
git commit -m "feat: show ✨ New chip on BookCard when series has recent release"
```

---

### Task 4: Add ✨ New chip to `SeriesCard`

**Files:**
- Modify: `src/components/SeriesCard.jsx`

No existing SeriesCard tests — add a new test file.

- [ ] **Step 1: Write failing test**

Create `__tests__/components/SeriesCard.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import SeriesCard from '@/components/SeriesCard';

const recentDate = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  return d.toISOString().slice(0, 10);
})();

const oldDate = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 8);
  return d.toISOString().slice(0, 10);
})();

const baseSeries = {
  id: 'test-series',
  title: 'Test Series',
  author: 'Test Author',
  genres: ['Fantasy'],
  total_books: 3,
};

describe('SeriesCard', () => {
  it('renders title and author', () => {
    render(<SeriesCard series={baseSeries} />);
    expect(screen.getByText('Test Series')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('shows ✨ New chip when latest_book is recent', () => {
    render(
      <SeriesCard
        series={{ ...baseSeries, latest_book: { title: 'New Book', release_date: recentDate } }}
      />
    );
    expect(screen.getByText('✨ New')).toBeInTheDocument();
  });

  it('does not show ✨ New chip when latest_book is old', () => {
    render(
      <SeriesCard
        series={{ ...baseSeries, latest_book: { title: 'Old Book', release_date: oldDate } }}
      />
    );
    expect(screen.queryByText('✨ New')).not.toBeInTheDocument();
  });

  it('does not show ✨ New chip when latest_book is absent', () => {
    render(<SeriesCard series={baseSeries} />);
    expect(screen.queryByText('✨ New')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

```bash
npm test -- --testPathPattern="SeriesCard" --no-coverage
```

Expected: FAIL — `✨ New` not found

- [ ] **Step 3: Update `src/components/SeriesCard.jsx`**

Replace the full file content:

```jsx
import Link from 'next/link';
import { isNewRelease } from '@/utils/scoring';

export default function SeriesCard({ series }) {
  const showNew = isNewRelease(series.latest_book?.release_date);

  return (
    <Link href={`/series/${series.id}`} className="block">
      <article className="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-3 hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
        <div>
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {series.title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{series.author}</p>
        </div>

        {/* Genre chips + New chip */}
        <div className="flex flex-wrap gap-1">
          {showNew && (
            <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-label">
              ✨ New
            </span>
          )}
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

- [ ] **Step 4: Run tests to confirm pass**

```bash
npm test -- --testPathPattern="SeriesCard" --no-coverage
```

Expected: All SeriesCard tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SeriesCard.jsx __tests__/components/SeriesCard.test.jsx
git commit -m "feat: show ✨ New chip on SeriesCard when series has recent release"
```

---

### Task 5: Add new release banner to `SeriesPage`

**Files:**
- Modify: `src/app/series/[id]/page.jsx`

- [ ] **Step 1: Add new release banner to `src/app/series/[id]/page.jsx`**

Add import at top:
```js
import { isNewRelease } from '@/utils/scoring';
```

Add the banner block immediately after the existing bestseller banner (after the closing `)}` of the `currently_on_bestseller_list` block):

```jsx
{/* New release banner */}
{series.latest_book && isNewRelease(series.latest_book.release_date) && (
  <section className="px-8 pb-8">
    <div className="max-w-3xl mx-auto">
      <div className="bg-tertiary-container text-on-tertiary-container rounded-xl px-5 py-3 text-sm font-label font-medium">
        ✨ New release: {series.latest_book.title}
      </div>
    </div>
  </section>
)}
```

- [ ] **Step 2: Run full test suite to confirm nothing broken**

```bash
npm test -- --no-coverage
```

Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/series/[id]/page.jsx
git commit -m "feat: show new release banner on SeriesPage"
```

---

### Task 6: Add `latest_book` data to `series.json`

Add `latest_book` to series entries where there has been a notable recent release (within approximately the last 2 years — data will age out naturally as the 6-month window moves forward, and CoWork will maintain it going forward).

**Files:**
- Modify: `src/data/series.json`

- [ ] **Step 1: Add `latest_book` to known recent releases**

Use the following data. For each series listed, find its entry in `src/data/series.json` and add the `latest_book` field alongside the other top-level fields:

| Series ID | latest_book title | release_date |
|---|---|---|
| `stormlight-archive` | Wind and Truth | 2024-12-06 |
| `mistborn` | The Lost Metal | 2022-11-15 |
| `kingkiller-chronicle` | (none — no new release) | — |
| `wheel-of-time` | (complete — no new release) | — |
| `dresden-files` | Twelve Days | 2024-12-03 |
| `murderbot-diaries` | System Collapse | 2023-11-14 |
| `locked-tomb` | Alecto the Ninth | 2024-09-10 |
| `first-law` | The Wisdom of Crowds | 2021-09-14 |
| `wayfarers` | A Psalm for the Wild-Built | 2021-07-13 |
| `harry-bosch` | The Wait | 2024-10-15 |
| `cormoran-strike` | The Running Grave | 2023-09-26 |
| `inspector-rebus` | A Heart Full of Headstones | 2022-10-06 |
| `silo` | (trilogy complete) | — |
| `hyperion-cantos` | (complete) | — |
| `dublin-murder-squad` | (no new release) | — |

Example edit for `stormlight-archive` entry — add after `"currently_on_bestseller_list"`:
```json
"latest_book": {
  "title": "Wind and Truth",
  "release_date": "2024-12-06"
},
```

- [ ] **Step 2: Validate JSON**

```bash
python3 -c "import json; data=json.load(open('src/data/series.json')); print(f'Valid — {len(data[\"series\"])} series')"
```

Expected: `Valid — [N] series` with no errors

- [ ] **Step 3: Build to confirm static export works**

```bash
npm run build
```

Expected: Build completes with no errors

- [ ] **Step 4: Commit**

```bash
git add src/data/series.json
git commit -m "feat: add latest_book data to series.json for recent releases"
```

---

### Task 7: Run full test suite and build verification

- [ ] **Step 1: Run all tests**

```bash
npm test -- --no-coverage
```

Expected: All tests PASS

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build completes successfully, no errors or warnings about missing data

- [ ] **Step 3: Commit if any fixes were needed, otherwise done**

All done — new release badges are live across SeriesCard, SeriesPage, and BookCard.
