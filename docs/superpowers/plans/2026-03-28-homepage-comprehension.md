# Homepage Comprehension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add explicit "X/7 lists" source count to the score badge and threshold-based editorial label chips to BookCard.

**Architecture:** Two surgical changes — add `editorialLabels(book)` to the scoring utility, then update BookCard to display the source count and render the label chips. No data schema changes; all fields required already exist on every book object.

**Tech Stack:** React (JSX), Tailwind CSS, Jest + @testing-library/react

---

## File Map

| File | Change |
|---|---|
| `src/utils/scoring.js` | Add `editorialLabels(book)` export |
| `src/utils/__tests__/scoring.test.js` | New — tests for `editorialLabels` |
| `src/components/BookCard.jsx` | Append `· {score}/7 lists` to badge; render editorial chips |
| `src/components/__tests__/BookCard.test.jsx` | New — tests for score count and editorial chips |

---

## Task 1: `editorialLabels` utility (TDD)

**Files:**
- Modify: `src/utils/scoring.js`
- Create: `src/utils/__tests__/scoring.test.js`

- [ ] **Step 1: Create the test file**

```js
// src/utils/__tests__/scoring.test.js
import { editorialLabels } from '@/utils/scoring';

function makeBook(overrides) {
  return {
    new_this_week: false,
    score: 3,
    weeks_on_list: 2,
    ...overrides,
  };
}

describe('editorialLabels', () => {
  it('returns empty array for a plain book', () => {
    expect(editorialLabels(makeBook({ score: 3, weeks_on_list: 2 }))).toEqual([]);
  });

  it('returns New This Week when new_this_week is true', () => {
    expect(editorialLabels(makeBook({ new_this_week: true, score: 3, weeks_on_list: 1 }))).toContain('New This Week');
  });

  it('returns Top Consensus when score is 6', () => {
    expect(editorialLabels(makeBook({ score: 6 }))).toContain('Top Consensus');
  });

  it('returns Top Consensus when score is 7', () => {
    expect(editorialLabels(makeBook({ score: 7 }))).toContain('Top Consensus');
  });

  it('does not return Top Consensus when score is 5', () => {
    expect(editorialLabels(makeBook({ score: 5 }))).not.toContain('Top Consensus');
  });

  it('returns Long Running when weeks_on_list is 8', () => {
    expect(editorialLabels(makeBook({ weeks_on_list: 8 }))).toContain('Long Running');
  });

  it('returns Long Running when weeks_on_list is 12', () => {
    expect(editorialLabels(makeBook({ weeks_on_list: 12 }))).toContain('Long Running');
  });

  it('does not return Long Running when weeks_on_list is 7', () => {
    expect(editorialLabels(makeBook({ weeks_on_list: 7 }))).not.toContain('Long Running');
  });

  it('returns Rising Fast for weeks 2-4 with score >= 5 and not new', () => {
    expect(editorialLabels(makeBook({ new_this_week: false, score: 5, weeks_on_list: 3 }))).toContain('Rising Fast');
  });

  it('does not return Rising Fast when new_this_week is true', () => {
    expect(editorialLabels(makeBook({ new_this_week: true, score: 5, weeks_on_list: 1 }))).not.toContain('Rising Fast');
  });

  it('does not return Rising Fast when score is below 5', () => {
    expect(editorialLabels(makeBook({ new_this_week: false, score: 4, weeks_on_list: 3 }))).not.toContain('Rising Fast');
  });

  it('does not return Rising Fast when weeks_on_list is outside 2-4', () => {
    expect(editorialLabels(makeBook({ new_this_week: false, score: 5, weeks_on_list: 5 }))).not.toContain('Rising Fast');
  });

  it('can return multiple labels', () => {
    const labels = editorialLabels(makeBook({ new_this_week: false, score: 6, weeks_on_list: 3 }));
    expect(labels).toContain('Top Consensus');
    expect(labels).toContain('Rising Fast');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx jest src/utils/__tests__/scoring.test.js --no-coverage
```

Expected: All `editorialLabels` tests fail with `editorialLabels is not a function`.

- [ ] **Step 3: Add `editorialLabels` to scoring.js**

Append to `src/utils/scoring.js`:

```js
export function editorialLabels(book) {
  const labels = [];
  if (book.new_this_week) labels.push('New This Week');
  if (book.score >= 6) labels.push('Top Consensus');
  if (book.weeks_on_list >= 8) labels.push('Long Running');
  if (!book.new_this_week && book.weeks_on_list >= 2 && book.weeks_on_list <= 4 && book.score >= 5) {
    labels.push('Rising Fast');
  }
  return labels;
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx jest src/utils/__tests__/scoring.test.js --no-coverage
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/scoring.js src/utils/__tests__/scoring.test.js
git commit -m "feat: add editorialLabels utility to scoring.js"
```

---

## Task 2: Update BookCard — score count + editorial chips (TDD)

**Files:**
- Modify: `src/components/BookCard.jsx`
- Create: `src/components/__tests__/BookCard.test.jsx`

- [ ] **Step 1: Create the test file**

```jsx
// src/components/__tests__/BookCard.test.jsx
import { render, screen } from '@testing-library/react';
import BookCard from '@/components/BookCard';

jest.mock('next/link', () => ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>);
jest.mock('@/components/SourceBadge', () => ({ source }) => <span data-testid="source-badge">{source}</span>);

const mockScoreBadge = jest.fn(() => ({ emoji: '🔥', label: 'Top Pick' }));
const mockEditorialLabels = jest.fn(() => []);

jest.mock('@/utils/scoring', () => ({
  scoreBadge: (...args) => mockScoreBadge(...args),
  editorialLabels: (...args) => mockEditorialLabels(...args),
}));

function makeBook(overrides = {}) {
  return {
    id: 'test-book',
    title: 'Test Book',
    author: 'Test Author',
    score: 7,
    sources: ['nyt', 'amazon'],
    sources_positions: [],
    weeks_on_list: 1,
    new_this_week: false,
    cover_url: null,
    description: 'A test book.',
    amazon_url: 'https://amazon.com/test',
    series_id: null,
    ...overrides,
  };
}

beforeEach(() => {
  mockScoreBadge.mockReturnValue({ emoji: '🔥', label: 'Top Pick' });
  mockEditorialLabels.mockReturnValue([]);
});

describe('BookCard score badge', () => {
  it('shows emoji, label, and source count', () => {
    render(<BookCard book={makeBook({ score: 7 })} seriesMap={{}} />);
    expect(screen.getByText('🔥 Top Pick · 7/7 lists')).toBeInTheDocument();
  });

  it('shows correct count for score 3', () => {
    mockScoreBadge.mockReturnValue({ emoji: '⬆️', label: 'Trending' });
    render(<BookCard book={makeBook({ score: 3 })} seriesMap={{}} />);
    expect(screen.getByText('⬆️ Trending · 3/7 lists')).toBeInTheDocument();
  });

  it('does not show score badge when showScore is false', () => {
    render(<BookCard book={makeBook({ score: 7 })} seriesMap={{}} showScore={false} />);
    expect(screen.queryByText(/7\/7 lists/)).not.toBeInTheDocument();
  });
});

describe('BookCard editorial labels', () => {
  it('renders editorial chip when editorialLabels returns a label', () => {
    mockEditorialLabels.mockReturnValue(['New This Week']);
    render(<BookCard book={makeBook()} seriesMap={{}} />);
    expect(screen.getByText('New This Week')).toBeInTheDocument();
  });

  it('renders multiple chips when editorialLabels returns multiple labels', () => {
    mockEditorialLabels.mockReturnValue(['Top Consensus', 'Rising Fast']);
    render(<BookCard book={makeBook()} seriesMap={{}} />);
    expect(screen.getByText('Top Consensus')).toBeInTheDocument();
    expect(screen.getByText('Rising Fast')).toBeInTheDocument();
  });

  it('renders no chips when editorialLabels returns empty array', () => {
    mockEditorialLabels.mockReturnValue([]);
    render(<BookCard book={makeBook()} seriesMap={{}} />);
    expect(screen.queryByText('New This Week')).not.toBeInTheDocument();
    expect(screen.queryByText('Top Consensus')).not.toBeInTheDocument();
  });

  it('does not render chips when showScore is false', () => {
    mockEditorialLabels.mockReturnValue(['New This Week']);
    render(<BookCard book={makeBook()} seriesMap={{}} showScore={false} />);
    expect(screen.queryByText('New This Week')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx jest src/components/__tests__/BookCard.test.jsx --no-coverage
```

Expected: Score count tests fail (badge text doesn't include `· X/7 lists`). Chip tests fail (`editorialLabels` not called / chips not rendered).

- [ ] **Step 3: Update BookCard.jsx**

Replace the entire file content:

```jsx
'use client';
// src/components/BookCard.jsx
import { useState } from 'react';
import Link from 'next/link';
import SourceBadge from './SourceBadge';
import { scoreBadge, editorialLabels } from '@/utils/scoring';

export default function BookCard({ book, seriesMap = {}, showScore = true }) {
  const badge = book.score !== null ? scoreBadge(book.score) : null;
  const hasValidSeries = book.series_id && seriesMap[book.series_id];
  const [coverFailed, setCoverFailed] = useState(false);
  const labels = showScore ? editorialLabels(book) : [];

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
      {/* Cover */}
      <a
        href={book.amazon_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low flex items-center justify-center"
      >
        {book.cover_url && !coverFailed ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className="text-center text-on-surface-variant text-sm font-body px-4">
            {book.title}
          </span>
        )}
      </a>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Score badge */}
        {showScore && badge && (
          <span className="text-xs font-label font-medium text-secondary">
            {badge.emoji} {badge.label} · {book.score}/7 lists
          </span>
        )}

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

        {/* Editorial label chips */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {labels.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-label"
              >
                {label}
              </span>
            ))}
          </div>
        )}

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
        {book.description && (
          <p className="text-sm text-on-surface-variant font-body flex-1">
            {book.description}
          </p>
        )}

        {/* CTA */}
        <a
          href={book.amazon_url}
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

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx jest src/components/__tests__/BookCard.test.jsx --no-coverage
```

Expected: All tests pass.

- [ ] **Step 5: Run the full test suite**

```bash
npx jest --no-coverage
```

Expected: All tests pass (existing load-more tests unaffected).

- [ ] **Step 6: Commit**

```bash
git add src/components/BookCard.jsx src/components/__tests__/BookCard.test.jsx
git commit -m "feat: add source count and editorial label chips to BookCard"
```
