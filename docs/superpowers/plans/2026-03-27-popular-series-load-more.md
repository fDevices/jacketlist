# Popular Series Load More Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Load more series" button to the Popular Series section on the homepage that reveals 12 cards at a time instead of dumping all 54 at once.

**Architecture:** Add `visibleCount` state (init: 12) to `HomeContent.jsx`. Slice `displayedSeries` before rendering. Reset `visibleCount` to 12 when genre filter or search query changes. Render the button only when more cards remain.

**Tech Stack:** React 18, Next.js 14 App Router, Jest + React Testing Library

---

### Task 1: Write failing tests for load-more behavior

**Files:**
- Create: `src/app/__tests__/HomeContent.load-more.test.jsx`

The test file needs mock data and mock components to isolate `HomeContent`. Use 13 series in the mock (enough to trigger the button) and 0 books (the bestsellers section is not under test here).

- [x] **Step 1: Create the test file**

```jsx
// src/app/__tests__/HomeContent.load-more.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import HomeContent from '../HomeContent';

// Mock child components that have heavy deps
jest.mock('next/link', () => ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>);
jest.mock('@/components/SearchBar', () => ({ value, onChange }) => (
  <input data-testid="search" value={value} onChange={(e) => onChange(e.target.value)} />
));
jest.mock('@/components/BookCard', () => ({ book }) => <div data-testid="book-card">{book.title}</div>);
jest.mock('@/components/SeriesCard', () => ({ series }) => <div data-testid="series-card">{series.title}</div>);
jest.mock('@/utils/scoring', () => ({
  scoreBadge: () => ({ emoji: '👀', label: 'Worth Watching' }),
}));

function makeSeries(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `series-${i}`,
    title: `Series ${i}`,
    author: `Author ${i}`,
    genres: ['Fantasy'],
    total_books: 3,
    description: '',
    orders: { chronological: [], authors_recommended: [] },
  }));
}

const baseProps = {
  books: [],
  alsoTrending: [],
  seriesMap: {},
  updatedDate: '2026-03-27',
};

describe('Popular Series load-more', () => {
  it('shows 12 cards and a Load more button when there are 13 series', () => {
    render(<HomeContent {...baseProps} series={makeSeries(13)} />);
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);
    expect(screen.getByRole('button', { name: /load more series/i })).toBeInTheDocument();
  });

  it('hides Load more button when series count is exactly 12', () => {
    render(<HomeContent {...baseProps} series={makeSeries(12)} />);
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);
    expect(screen.queryByRole('button', { name: /load more series/i })).not.toBeInTheDocument();
  });

  it('reveals 12 more cards on each click', () => {
    render(<HomeContent {...baseProps} series={makeSeries(25)} />);
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);

    fireEvent.click(screen.getByRole('button', { name: /load more series/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(24);

    fireEvent.click(screen.getByRole('button', { name: /load more series/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(25);
    expect(screen.queryByRole('button', { name: /load more series/i })).not.toBeInTheDocument();
  });

  it('resets to 12 cards when genre filter changes', () => {
    const series = makeSeries(25);
    render(<HomeContent {...baseProps} series={series} />);

    fireEvent.click(screen.getByRole('button', { name: /load more series/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(24);

    // Click "All" genre chip to trigger a reset
    fireEvent.click(screen.getByRole('button', { name: /^all$/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);
  });

  it('resets to 12 cards when search query changes', () => {
    render(<HomeContent {...baseProps} series={makeSeries(25)} />);

    fireEvent.click(screen.getByRole('button', { name: /load more series/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(24);

    // The series SearchBar is the second search input on the page
    const inputs = screen.getAllByTestId('search');
    fireEvent.change(inputs[1], { target: { value: 'Series' } });
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);
  });
});
```

- [x] **Step 2: Run the tests to confirm they fail**

```bash
npx jest src/app/__tests__/HomeContent.load-more.test.jsx --no-coverage
```

Expected: all 5 tests FAIL (button and slicing don't exist yet).

---

### Task 2: Implement load-more in HomeContent.jsx

**Files:**
- Modify: `src/app/HomeContent.jsx`

- [x] **Step 1: Add `visibleCount` state**

In `HomeContent`, after the existing `const [seriesQuery, setSeriesQuery] = useState('');` line, add:

```js
const [visibleCount, setVisibleCount] = useState(12);
```

- [x] **Step 2: Slice `displayedSeries` for rendering**

After the existing `displayedSeries` derivation (lines 40–48), add:

```js
const visibleSeries = displayedSeries.slice(0, visibleCount);
```

- [x] **Step 3: Reset `visibleCount` when genre filter changes**

The genre filter buttons currently call `setActiveGenre(...)`. Wrap each call to also reset visibleCount.

Replace the "All" genre button's `onClick`:
```jsx
onClick={() => { setActiveGenre(null); setVisibleCount(12); }}
```

Replace each genre chip button's `onClick`:
```jsx
onClick={() => { setActiveGenre(genre === activeGenre ? null : genre); setVisibleCount(12); }}
```

- [x] **Step 4: Reset `visibleCount` when series search query changes**

The series `SearchBar` currently has `onChange={setSeriesQuery}`. Replace it:
```jsx
onChange={(val) => { setSeriesQuery(val); setVisibleCount(12); }}
```

- [x] **Step 5: Replace the grid block to use `visibleSeries` and add the Load more button**

Replace the entire closing structure of the Popular Series section (the `displayedSeries.length === 0` ternary and grid):

```jsx
{displayedSeries.length === 0 ? (
  <p className="text-on-surface-variant">No series match your search.</p>
) : (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {visibleSeries.map((s) => (
        <SeriesCard key={s.id} series={s} />
      ))}
    </div>
    {displayedSeries.length > visibleCount && (
      <div className="mt-8 text-center">
        <button
          onClick={() => setVisibleCount((c) => c + 12)}
          className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-label hover:bg-surface-container transition-colors duration-300"
        >
          Load more series
        </button>
      </div>
    )}
  </>
)}
```

- [x] **Step 6: Run the tests to confirm they pass**

```bash
npx jest src/app/__tests__/HomeContent.load-more.test.jsx --no-coverage
```

Expected: all 5 tests PASS.

- [x] **Step 7: Run the full test suite**

```bash
npx jest --no-coverage
```

Expected: all tests pass (no regressions).

- [x] **Step 8: Verify the build succeeds**

```bash
npx next build
```

Expected: build completes with no errors.

- [x] **Step 9: Commit**

```bash
git add src/app/HomeContent.jsx src/app/__tests__/HomeContent.load-more.test.jsx
git commit -m "feat: add load-more pagination to Popular Series section"
```
