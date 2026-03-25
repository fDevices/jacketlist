# Expanded Sources & Lists Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand bestseller sources from 3 to 7, add per-source list pages, cap homepage to Top 10 + compact tail (books 11–25).

**Architecture:** Seven raw source JSON files live in `src/data/sources/`; CoWork merges them weekly into `bestsellers.json` (top 25). The homepage splits into a Top 10 BookCard grid and a lean ranked list for books 11–25. New `/lists` hub and `/lists/[source]` static pages serve SEO.

**Tech Stack:** Next.js 14 App Router (static export), React JSX, Tailwind CSS, Jest + Testing Library.

---

## File Map

| Action | Path |
|--------|------|
| Modify | `src/utils/scoring.js` |
| Modify | `__tests__/utils/scoring.test.js` |
| Create | `src/data/sources/nyt.json` |
| Create | `src/data/sources/guardian.json` |
| Create | `src/data/sources/goodreads.json` |
| Create | `src/data/sources/amazon.json` |
| Create | `src/data/sources/usatoday.json` |
| Create | `src/data/sources/publishersweekly.json` |
| Create | `src/data/sources/audible.json` |
| Modify | `src/data/bestsellers.json` |
| Modify | `src/app/page.jsx` |
| Modify | `src/app/HomeContent.jsx` |
| Create | `src/app/lists/page.jsx` |
| Create | `src/app/lists/[source]/page.jsx` |
| Modify | `src/components/Nav.jsx` |
| Modify | `cowork/bestseller-prompt.md` |

---

## Task 1: Update scoring.js — new thresholds + computeTiebreaker

**Files:**
- Modify: `src/utils/scoring.js`
- Modify: `__tests__/utils/scoring.test.js`

- [ ] **Step 1: Update the failing tests first**

Replace the contents of `__tests__/utils/scoring.test.js`:

```js
import { scoreBook, scoreBadge, computeTiebreaker } from '@/utils/scoring';

describe('scoreBook', () => {
  it('returns the number of sources', () => {
    expect(scoreBook(['nyt', 'guardian', 'goodreads'])).toBe(3);
    expect(scoreBook(['nyt', 'goodreads'])).toBe(2);
    expect(scoreBook(['nyt'])).toBe(1);
  });
});

describe('scoreBadge', () => {
  it('returns 🔥 Top Pick for scores 5–7', () => {
    expect(scoreBadge(7)).toEqual({ emoji: '🔥', label: 'Top Pick' });
    expect(scoreBadge(6)).toEqual({ emoji: '🔥', label: 'Top Pick' });
    expect(scoreBadge(5)).toEqual({ emoji: '🔥', label: 'Top Pick' });
  });
  it('returns ⬆️ Trending for scores 3–4', () => {
    expect(scoreBadge(4)).toEqual({ emoji: '⬆️', label: 'Trending' });
    expect(scoreBadge(3)).toEqual({ emoji: '⬆️', label: 'Trending' });
  });
  it('returns 👀 Worth Watching for scores 1–2', () => {
    expect(scoreBadge(2)).toEqual({ emoji: '👀', label: 'Worth Watching' });
    expect(scoreBadge(1)).toEqual({ emoji: '👀', label: 'Worth Watching' });
  });
});

describe('computeTiebreaker', () => {
  it('averages position_score and longevity_score', () => {
    const book = {
      sources_positions: [{ source: 'nyt', position: 1 }],
      weeks_on_list: 1,
    };
    // position_score = 11 - 1 = 10, longevity_score = min(1,10) = 1
    // tiebreaker = (10 + 1) / 2 = 5.5
    expect(computeTiebreaker(book)).toBe(5.5);
  });

  it('averages position across multiple sources', () => {
    const book = {
      sources_positions: [
        { source: 'nyt', position: 1 },
        { source: 'amazon', position: 3 },
      ],
      weeks_on_list: 10,
    };
    // avg_position = (1+3)/2 = 2, position_score = 11-2 = 9
    // longevity_score = min(10,10) = 10
    // tiebreaker = (9 + 10) / 2 = 9.5
    expect(computeTiebreaker(book)).toBe(9.5);
  });

  it('caps weeks_on_list at 10', () => {
    const book = {
      sources_positions: [{ source: 'nyt', position: 5 }],
      weeks_on_list: 52,
    };
    // position_score = 11-5 = 6, longevity_score = min(52,10) = 10
    // tiebreaker = (6 + 10) / 2 = 8
    expect(computeTiebreaker(book)).toBe(8);
  });
});
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npm test -- --testPathPattern=scoring
```

Expected: `scoreBadge` tests fail (thresholds wrong), `computeTiebreaker` fails (not defined).

- [ ] **Step 3: Update scoring.js**

```js
export function scoreBook(sources) {
  return sources.length;
}

export function scoreBadge(score) {
  if (score >= 5) return { emoji: '🔥', label: 'Top Pick' };
  if (score >= 3) return { emoji: '⬆️', label: 'Trending' };
  return { emoji: '👀', label: 'Worth Watching' };
}

export function computeTiebreaker(book) {
  const positions = book.sources_positions.map((sp) => sp.position);
  const avgPosition = positions.reduce((a, b) => a + b, 0) / positions.length;
  const positionScore = 11 - avgPosition;
  const longevityScore = Math.min(book.weeks_on_list, 10);
  return (positionScore + longevityScore) / 2;
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm test -- --testPathPattern=scoring
```

Expected: all 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/scoring.js __tests__/utils/scoring.test.js
git commit -m "feat: update scoreBadge thresholds and add computeTiebreaker"
```

---

## Task 2: Create 7 source JSON files

**Files:** Create `src/data/sources/*.json`

- [ ] **Step 1: Create `src/data/sources/nyt.json`**

```json
{
  "source": "nyt",
  "label": "NYT Best Sellers",
  "url": "https://www.nytimes.com/books/best-sellers/",
  "updated": "2026-03-25",
  "books": [
    { "position": 1, "title": "Project Hail Mary", "author": "Andy Weir", "cover_url": "https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Project+Hail+Mary+Andy+Weir&tag=jacketlist-20" },
    { "position": 2, "title": "Dear Debbie", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/id/15163694-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Dear+Debbie+Freida+McFadden&tag=jacketlist-20" },
    { "position": 3, "title": "Judge Stone", "author": "Viola Davis and James Patterson", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Judge+Stone+Viola+Davis+James+Patterson&tag=jacketlist-20" },
    { "position": 4, "title": "Theo of Golden", "author": "Allen Levi", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Theo+of+Golden+Allen+Levi&tag=jacketlist-20" },
    { "position": 5, "title": "The Wings That Bind", "author": "Briar Boleyn", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=The+Wings+That+Bind+Briar+Boleyn&tag=jacketlist-20" },
    { "position": 6, "title": "The Correspondent", "author": "Virginia Evans", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=The+Correspondent+Virginia+Evans&tag=jacketlist-20" },
    { "position": 7, "title": "Mistakes Were Made", "author": "Lucy Score", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Mistakes+Were+Made+Lucy+Score&tag=jacketlist-20" },
    { "position": 8, "title": "Want to Know a Secret?", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/id/15125133-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Want+to+Know+a+Secret+Freida+McFadden&tag=jacketlist-20" },
    { "position": 9, "title": "Heated Rivalry", "author": "Rachel Reid", "cover_url": "https://covers.openlibrary.org/b/id/15152812-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Heated+Rivalry+Rachel+Reid&tag=jacketlist-20" },
    { "position": 10, "title": "Dungeon Crawler Carl", "author": "Matt Dinniman", "cover_url": "https://covers.openlibrary.org/b/id/15143022-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Dungeon+Crawler+Carl+Matt+Dinniman&tag=jacketlist-20" }
  ]
}
```

- [ ] **Step 2: Create `src/data/sources/guardian.json`**

```json
{
  "source": "guardian",
  "label": "The Guardian Best Sellers",
  "url": "https://www.theguardian.com/books/bestbooks",
  "updated": "2026-03-25",
  "books": [
    { "position": 1, "title": "Is a River Alive?", "author": "Robert Macfarlane", "cover_url": "https://covers.openlibrary.org/b/id/14846855-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Is+a+River+Alive+Robert+Macfarlane&tag=jacketlist-20" },
    { "position": 2, "title": "We Do Not Part", "author": "Han Kang", "cover_url": "https://covers.openlibrary.org/b/id/14835467-M.jpg", "amazon_url": "https://www.amazon.com/s?k=We+Do+Not+Part+Han+Kang&tag=jacketlist-20" },
    { "position": 3, "title": "Vanishing World", "author": "Sayaka Murata", "cover_url": "https://covers.openlibrary.org/b/isbn/9781783788224-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Vanishing+World+Sayaka+Murata&tag=jacketlist-20" },
    { "position": 4, "title": "The Death of Us", "author": "Abigail Dean", "cover_url": "https://covers.openlibrary.org/b/isbn/9780008453657-M.jpg", "amazon_url": "https://www.amazon.com/s?k=The+Death+of+Us+Abigail+Dean&tag=jacketlist-20" },
    { "position": 5, "title": "Creation Lake", "author": "Rachel Kushner", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Creation+Lake+Rachel+Kushner&tag=jacketlist-20" },
    { "position": 6, "title": "James", "author": "Percival Everett", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=James+Percival+Everett&tag=jacketlist-20" },
    { "position": 7, "title": "The Women", "author": "Kristin Hannah", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=The+Women+Kristin+Hannah&tag=jacketlist-20" },
    { "position": 8, "title": "All Fours", "author": "Miranda July", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=All+Fours+Miranda+July&tag=jacketlist-20" },
    { "position": 9, "title": "Orbital", "author": "Samantha Harvey", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Orbital+Samantha+Harvey&tag=jacketlist-20" },
    { "position": 10, "title": "On Tyranny", "author": "Timothy Snyder", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=On+Tyranny+Timothy+Snyder&tag=jacketlist-20" }
  ]
}
```

- [ ] **Step 3: Create `src/data/sources/goodreads.json`**

```json
{
  "source": "goodreads",
  "label": "Goodreads Most Read",
  "url": "https://www.goodreads.com/book/most_read",
  "updated": "2026-03-25",
  "books": [
    { "position": 1, "title": "Project Hail Mary", "author": "Andy Weir", "cover_url": "https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Project+Hail+Mary+Andy+Weir&tag=jacketlist-20" },
    { "position": 2, "title": "Dear Debbie", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/id/15163694-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Dear+Debbie+Freida+McFadden&tag=jacketlist-20" },
    { "position": 3, "title": "Fourth Wing", "author": "Rebecca Yarros", "cover_url": "https://covers.openlibrary.org/b/isbn/9781649374042-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Fourth+Wing+Rebecca+Yarros&tag=jacketlist-20" },
    { "position": 4, "title": "A Court of Thorns and Roses", "author": "Sarah J. Maas", "cover_url": "https://covers.openlibrary.org/b/isbn/9781619635180-M.jpg", "amazon_url": "https://www.amazon.com/s?k=A+Court+of+Thorns+and+Roses+Sarah+Maas&tag=jacketlist-20" },
    { "position": 5, "title": "The Housemaid", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/isbn/9781538742570-M.jpg", "amazon_url": "https://www.amazon.com/s?k=The+Housemaid+Freida+McFadden&tag=jacketlist-20" },
    { "position": 6, "title": "Tomorrow, and Tomorrow, and Tomorrow", "author": "Gabrielle Zevin", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Tomorrow+and+Tomorrow+Gabrielle+Zevin&tag=jacketlist-20" },
    { "position": 7, "title": "It Ends with Us", "author": "Colleen Hoover", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=It+Ends+with+Us+Colleen+Hoover&tag=jacketlist-20" },
    { "position": 8, "title": "Lessons in Chemistry", "author": "Bonnie Garmus", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Lessons+in+Chemistry+Bonnie+Garmus&tag=jacketlist-20" },
    { "position": 9, "title": "Atomic Habits", "author": "James Clear", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Atomic+Habits+James+Clear&tag=jacketlist-20" },
    { "position": 10, "title": "The Midnight Library", "author": "Matt Haig", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=The+Midnight+Library+Matt+Haig&tag=jacketlist-20" }
  ]
}
```

- [ ] **Step 4: Create `src/data/sources/amazon.json`**

```json
{
  "source": "amazon",
  "label": "Amazon Best Sellers",
  "url": "https://www.amazon.com/charts/mostread/books",
  "updated": "2026-03-25",
  "books": [
    { "position": 1, "title": "Project Hail Mary", "author": "Andy Weir", "cover_url": "https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Project+Hail+Mary+Andy+Weir&tag=jacketlist-20" },
    { "position": 2, "title": "Fourth Wing", "author": "Rebecca Yarros", "cover_url": "https://covers.openlibrary.org/b/isbn/9781649374042-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Fourth+Wing+Rebecca+Yarros&tag=jacketlist-20" },
    { "position": 3, "title": "Dear Debbie", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/id/15163694-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Dear+Debbie+Freida+McFadden&tag=jacketlist-20" },
    { "position": 4, "title": "The Housemaid", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/isbn/9781538742570-M.jpg", "amazon_url": "https://www.amazon.com/s?k=The+Housemaid+Freida+McFadden&tag=jacketlist-20" },
    { "position": 5, "title": "Want to Know a Secret?", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/id/15125133-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Want+to+Know+a+Secret+Freida+McFadden&tag=jacketlist-20" },
    { "position": 6, "title": "Dungeon Crawler Carl", "author": "Matt Dinniman", "cover_url": "https://covers.openlibrary.org/b/id/15143022-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Dungeon+Crawler+Carl+Matt+Dinniman&tag=jacketlist-20" },
    { "position": 7, "title": "Mistakes Were Made", "author": "Lucy Score", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Mistakes+Were+Made+Lucy+Score&tag=jacketlist-20" },
    { "position": 8, "title": "Heated Rivalry", "author": "Rachel Reid", "cover_url": "https://covers.openlibrary.org/b/id/15152812-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Heated+Rivalry+Rachel+Reid&tag=jacketlist-20" },
    { "position": 9, "title": "A Court of Thorns and Roses", "author": "Sarah J. Maas", "cover_url": "https://covers.openlibrary.org/b/isbn/9781619635180-M.jpg", "amazon_url": "https://www.amazon.com/s?k=A+Court+of+Thorns+and+Roses+Sarah+Maas&tag=jacketlist-20" },
    { "position": 10, "title": "It Ends with Us", "author": "Colleen Hoover", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=It+Ends+with+Us+Colleen+Hoover&tag=jacketlist-20" }
  ]
}
```

- [ ] **Step 5: Create `src/data/sources/usatoday.json`**

```json
{
  "source": "usatoday",
  "label": "USA Today Best-Selling Books",
  "url": "https://www.usatoday.com/life/books/best-selling/",
  "updated": "2026-03-25",
  "books": [
    { "position": 1, "title": "Project Hail Mary", "author": "Andy Weir", "cover_url": "https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Project+Hail+Mary+Andy+Weir&tag=jacketlist-20" },
    { "position": 2, "title": "Fourth Wing", "author": "Rebecca Yarros", "cover_url": "https://covers.openlibrary.org/b/isbn/9781649374042-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Fourth+Wing+Rebecca+Yarros&tag=jacketlist-20" },
    { "position": 3, "title": "Dear Debbie", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/id/15163694-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Dear+Debbie+Freida+McFadden&tag=jacketlist-20" },
    { "position": 4, "title": "The Housemaid", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/isbn/9781538742570-M.jpg", "amazon_url": "https://www.amazon.com/s?k=The+Housemaid+Freida+McFadden&tag=jacketlist-20" },
    { "position": 5, "title": "Dungeon Crawler Carl", "author": "Matt Dinniman", "cover_url": "https://covers.openlibrary.org/b/id/15143022-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Dungeon+Crawler+Carl+Matt+Dinniman&tag=jacketlist-20" },
    { "position": 6, "title": "A Court of Thorns and Roses", "author": "Sarah J. Maas", "cover_url": "https://covers.openlibrary.org/b/isbn/9781619635180-M.jpg", "amazon_url": "https://www.amazon.com/s?k=A+Court+of+Thorns+and+Roses+Sarah+Maas&tag=jacketlist-20" },
    { "position": 7, "title": "Heated Rivalry", "author": "Rachel Reid", "cover_url": "https://covers.openlibrary.org/b/id/15152812-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Heated+Rivalry+Rachel+Reid&tag=jacketlist-20" },
    { "position": 8, "title": "The Women", "author": "Kristin Hannah", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=The+Women+Kristin+Hannah&tag=jacketlist-20" },
    { "position": 9, "title": "Mistakes Were Made", "author": "Lucy Score", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Mistakes+Were+Made+Lucy+Score&tag=jacketlist-20" },
    { "position": 10, "title": "Atomic Habits", "author": "James Clear", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Atomic+Habits+James+Clear&tag=jacketlist-20" }
  ]
}
```

- [ ] **Step 6: Create `src/data/sources/publishersweekly.json`**

```json
{
  "source": "publishersweekly",
  "label": "Publishers Weekly Best Sellers",
  "url": "https://www.publishersweekly.com/pw/nielsen/bestsellers.html",
  "updated": "2026-03-25",
  "books": [
    { "position": 1, "title": "We Do Not Part", "author": "Han Kang", "cover_url": "https://covers.openlibrary.org/b/id/14835467-M.jpg", "amazon_url": "https://www.amazon.com/s?k=We+Do+Not+Part+Han+Kang&tag=jacketlist-20" },
    { "position": 2, "title": "Is a River Alive?", "author": "Robert Macfarlane", "cover_url": "https://covers.openlibrary.org/b/id/14846855-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Is+a+River+Alive+Robert+Macfarlane&tag=jacketlist-20" },
    { "position": 3, "title": "Vanishing World", "author": "Sayaka Murata", "cover_url": "https://covers.openlibrary.org/b/isbn/9781783788224-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Vanishing+World+Sayaka+Murata&tag=jacketlist-20" },
    { "position": 4, "title": "The Death of Us", "author": "Abigail Dean", "cover_url": "https://covers.openlibrary.org/b/isbn/9780008453657-M.jpg", "amazon_url": "https://www.amazon.com/s?k=The+Death+of+Us+Abigail+Dean&tag=jacketlist-20" },
    { "position": 5, "title": "James", "author": "Percival Everett", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=James+Percival+Everett&tag=jacketlist-20" },
    { "position": 6, "title": "Creation Lake", "author": "Rachel Kushner", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Creation+Lake+Rachel+Kushner&tag=jacketlist-20" },
    { "position": 7, "title": "Project Hail Mary", "author": "Andy Weir", "cover_url": "https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Project+Hail+Mary+Andy+Weir&tag=jacketlist-20" },
    { "position": 8, "title": "The Women", "author": "Kristin Hannah", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=The+Women+Kristin+Hannah&tag=jacketlist-20" },
    { "position": 9, "title": "Tomorrow, and Tomorrow, and Tomorrow", "author": "Gabrielle Zevin", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Tomorrow+and+Tomorrow+Gabrielle+Zevin&tag=jacketlist-20" },
    { "position": 10, "title": "Orbital", "author": "Samantha Harvey", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Orbital+Samantha+Harvey&tag=jacketlist-20" }
  ]
}
```

- [ ] **Step 7: Create `src/data/sources/audible.json`**

```json
{
  "source": "audible",
  "label": "Audible Best Sellers",
  "url": "https://www.audible.com/adblbestsellers",
  "updated": "2026-03-25",
  "books": [
    { "position": 1, "title": "Project Hail Mary", "author": "Andy Weir", "cover_url": "https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Project+Hail+Mary+Andy+Weir&tag=jacketlist-20" },
    { "position": 2, "title": "Dungeon Crawler Carl", "author": "Matt Dinniman", "cover_url": "https://covers.openlibrary.org/b/id/15143022-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Dungeon+Crawler+Carl+Matt+Dinniman&tag=jacketlist-20" },
    { "position": 3, "title": "Fourth Wing", "author": "Rebecca Yarros", "cover_url": "https://covers.openlibrary.org/b/isbn/9781649374042-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Fourth+Wing+Rebecca+Yarros&tag=jacketlist-20" },
    { "position": 4, "title": "A Court of Thorns and Roses", "author": "Sarah J. Maas", "cover_url": "https://covers.openlibrary.org/b/isbn/9781619635180-M.jpg", "amazon_url": "https://www.amazon.com/s?k=A+Court+of+Thorns+and+Roses+Sarah+Maas&tag=jacketlist-20" },
    { "position": 5, "title": "The Housemaid", "author": "Freida McFadden", "cover_url": "https://covers.openlibrary.org/b/isbn/9781538742570-M.jpg", "amazon_url": "https://www.amazon.com/s?k=The+Housemaid+Freida+McFadden&tag=jacketlist-20" },
    { "position": 6, "title": "Atomic Habits", "author": "James Clear", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Atomic+Habits+James+Clear&tag=jacketlist-20" },
    { "position": 7, "title": "The Midnight Library", "author": "Matt Haig", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=The+Midnight+Library+Matt+Haig&tag=jacketlist-20" },
    { "position": 8, "title": "Tomorrow, and Tomorrow, and Tomorrow", "author": "Gabrielle Zevin", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Tomorrow+and+Tomorrow+Gabrielle+Zevin&tag=jacketlist-20" },
    { "position": 9, "title": "Heated Rivalry", "author": "Rachel Reid", "cover_url": "https://covers.openlibrary.org/b/id/15152812-M.jpg", "amazon_url": "https://www.amazon.com/s?k=Heated+Rivalry+Rachel+Reid&tag=jacketlist-20" },
    { "position": 10, "title": "Lessons in Chemistry", "author": "Bonnie Garmus", "cover_url": "", "amazon_url": "https://www.amazon.com/s?k=Lessons+in+Chemistry+Bonnie+Garmus&tag=jacketlist-20" }
  ]
}
```

- [ ] **Step 8: Commit**

```bash
git add src/data/sources/
git commit -m "feat: add 7 source JSON seed files"
```

---

## Task 3: Update bestsellers.json

**Files:**
- Modify: `src/data/bestsellers.json`

This task rebuilds `bestsellers.json` with the top 25 merged books, new `sources_positions` field, updated scores, and new books from the 4 new sources. Books beyond 25 by score+tiebreaker are dropped.

**Scoring used to order the list:**
- Score = count of sources the book appears on (1–7)
- Tiebreaker = `(position_score + longevity_score) / 2` where `position_score = 11 - avg_position`, `longevity_score = min(weeks_on_list, 10)`

- [ ] **Step 1: Replace `src/data/bestsellers.json` with the merged top-25 list**

```json
{
  "updated": "2026-03-25",
  "books": [
    {
      "id": "project-hail-mary",
      "title": "Project Hail Mary",
      "author": "Andy Weir",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg",
      "description": "Ryland Grace awakes from a long sleep alone and far from home, and the fate of humanity rests on his shoulders; the basis of the movie.",
      "sources": ["nyt", "goodreads", "amazon", "usatoday", "publishersweekly", "audible"],
      "sources_positions": [
        { "source": "nyt", "position": 1 },
        { "source": "goodreads", "position": 1 },
        { "source": "amazon", "position": 1 },
        { "source": "usatoday", "position": 1 },
        { "source": "publishersweekly", "position": 7 },
        { "source": "audible", "position": 1 }
      ],
      "score": 6,
      "rank": 1,
      "new_this_week": false,
      "weeks_on_list": 40,
      "amazon_url": "https://www.amazon.com/s?k=Project+Hail+Mary+Andy+Weir&tag=jacketlist-20"
    },
    {
      "id": "fourth-wing",
      "title": "Fourth Wing",
      "author": "Rebecca Yarros",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9781649374042-M.jpg",
      "description": "Violet Sorrengail is ordered into the dangerous dragon rider quadrant of Basgiath War College — where the riders she bonds with can make her unstoppable, or get her killed.",
      "sources": ["goodreads", "amazon", "usatoday", "audible"],
      "sources_positions": [
        { "source": "goodreads", "position": 3 },
        { "source": "amazon", "position": 2 },
        { "source": "usatoday", "position": 2 },
        { "source": "audible", "position": 3 }
      ],
      "score": 4,
      "rank": 2,
      "new_this_week": false,
      "weeks_on_list": 22,
      "series_id": "fourth-wing",
      "series_book_number": 1,
      "amazon_url": "https://www.amazon.com/s?k=Fourth+Wing+Rebecca+Yarros&tag=jacketlist-20"
    },
    {
      "id": "the-housemaid",
      "title": "The Housemaid",
      "author": "Freida McFadden",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9781538742570-M.jpg",
      "description": "A desperate woman takes a job as a housemaid for a wealthy family, only to discover that the picture-perfect household hides something very dark.",
      "sources": ["goodreads", "amazon", "usatoday", "audible"],
      "sources_positions": [
        { "source": "goodreads", "position": 5 },
        { "source": "amazon", "position": 4 },
        { "source": "usatoday", "position": 4 },
        { "source": "audible", "position": 5 }
      ],
      "score": 4,
      "rank": 3,
      "new_this_week": false,
      "weeks_on_list": 14,
      "amazon_url": "https://www.amazon.com/s?k=The+Housemaid+Freida+McFadden&tag=jacketlist-20"
    },
    {
      "id": "dear-debbie",
      "title": "Dear Debbie",
      "author": "Freida McFadden",
      "cover_url": "https://covers.openlibrary.org/b/id/15163694-M.jpg",
      "description": "An advice columnist who is having trouble at work and home decides to get back at people she thinks deserve it.",
      "sources": ["nyt", "goodreads", "amazon", "usatoday"],
      "sources_positions": [
        { "source": "nyt", "position": 2 },
        { "source": "goodreads", "position": 2 },
        { "source": "amazon", "position": 3 },
        { "source": "usatoday", "position": 3 }
      ],
      "score": 4,
      "rank": 4,
      "new_this_week": false,
      "weeks_on_list": 7,
      "amazon_url": "https://www.amazon.com/s?k=Dear+Debbie+Freida+McFadden&tag=jacketlist-20"
    },
    {
      "id": "dungeon-crawler-carl",
      "title": "Dungeon Crawler Carl",
      "author": "Matt Dinniman",
      "cover_url": "https://covers.openlibrary.org/b/id/15143022-M.jpg",
      "description": "A Coast Guard vet named Carl and his ex-girlfriend's cat, Princess Donut, are trapped in a fantasy dungeon.",
      "sources": ["nyt", "amazon", "usatoday", "audible"],
      "sources_positions": [
        { "source": "nyt", "position": 10 },
        { "source": "amazon", "position": 6 },
        { "source": "usatoday", "position": 5 },
        { "source": "audible", "position": 2 }
      ],
      "score": 4,
      "rank": 5,
      "new_this_week": false,
      "weeks_on_list": 10,
      "amazon_url": "https://www.amazon.com/s?k=Dungeon+Crawler+Carl+Matt+Dinniman&tag=jacketlist-20"
    },
    {
      "id": "a-court-of-thorns-and-roses",
      "title": "A Court of Thorns and Roses",
      "author": "Sarah J. Maas",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9781619635180-M.jpg",
      "description": "A mortal huntress is taken to a magical land after killing a wolf in the woods — and discovers a world of faeries, ancient curses, and dangerous desire.",
      "sources": ["goodreads", "amazon", "audible"],
      "sources_positions": [
        { "source": "goodreads", "position": 4 },
        { "source": "amazon", "position": 9 },
        { "source": "audible", "position": 4 }
      ],
      "score": 3,
      "rank": 6,
      "new_this_week": false,
      "weeks_on_list": 31,
      "amazon_url": "https://www.amazon.com/s?k=A+Court+of+Thorns+and+Roses+Sarah+Maas&tag=jacketlist-20"
    },
    {
      "id": "the-women",
      "title": "The Women",
      "author": "Kristin Hannah",
      "cover_url": "",
      "description": "A young woman enlists as an Army nurse during the Vietnam War and returns home to a country that doesn't acknowledge her sacrifice.",
      "sources": ["guardian", "usatoday", "publishersweekly"],
      "sources_positions": [
        { "source": "guardian", "position": 7 },
        { "source": "usatoday", "position": 8 },
        { "source": "publishersweekly", "position": 8 }
      ],
      "score": 3,
      "rank": 7,
      "new_this_week": false,
      "weeks_on_list": 20,
      "amazon_url": "https://www.amazon.com/s?k=The+Women+Kristin+Hannah&tag=jacketlist-20"
    },
    {
      "id": "tomorrow-and-tomorrow-and-tomorrow",
      "title": "Tomorrow, and Tomorrow, and Tomorrow",
      "author": "Gabrielle Zevin",
      "cover_url": "",
      "description": "Two friends collaborate on video games over three decades, navigating creativity, love, loss, and the nature of play.",
      "sources": ["goodreads", "publishersweekly", "audible"],
      "sources_positions": [
        { "source": "goodreads", "position": 6 },
        { "source": "publishersweekly", "position": 9 },
        { "source": "audible", "position": 8 }
      ],
      "score": 3,
      "rank": 8,
      "new_this_week": false,
      "weeks_on_list": 30,
      "amazon_url": "https://www.amazon.com/s?k=Tomorrow+and+Tomorrow+Gabrielle+Zevin&tag=jacketlist-20"
    },
    {
      "id": "heated-rivalry",
      "title": "Heated Rivalry",
      "author": "Rachel Reid",
      "cover_url": "https://covers.openlibrary.org/b/id/15152812-M.jpg",
      "description": "Rival captains of two hockey teams try to keep their relationship out of the spotlight; the basis of the TV series.",
      "sources": ["nyt", "amazon", "usatoday"],
      "sources_positions": [
        { "source": "nyt", "position": 9 },
        { "source": "amazon", "position": 8 },
        { "source": "usatoday", "position": 7 }
      ],
      "score": 3,
      "rank": 9,
      "new_this_week": false,
      "weeks_on_list": 14,
      "amazon_url": "https://www.amazon.com/s?k=Heated+Rivalry+Rachel+Reid&tag=jacketlist-20"
    },
    {
      "id": "atomic-habits",
      "title": "Atomic Habits",
      "author": "James Clear",
      "cover_url": "",
      "description": "A practical guide to building good habits and breaking bad ones, showing how tiny changes can lead to remarkable results over time.",
      "sources": ["goodreads", "usatoday", "audible"],
      "sources_positions": [
        { "source": "goodreads", "position": 9 },
        { "source": "usatoday", "position": 10 },
        { "source": "audible", "position": 6 }
      ],
      "score": 3,
      "rank": 10,
      "new_this_week": false,
      "weeks_on_list": 52,
      "amazon_url": "https://www.amazon.com/s?k=Atomic+Habits+James+Clear&tag=jacketlist-20"
    },
    {
      "id": "mistakes-were-made",
      "title": "Mistakes Were Made",
      "author": "Lucy Score",
      "cover_url": "",
      "description": "A commitment-phobic literary agent stuck in a small town has a landlord who is hoping to settle down.",
      "sources": ["nyt", "amazon", "usatoday"],
      "sources_positions": [
        { "source": "nyt", "position": 7 },
        { "source": "amazon", "position": 7 },
        { "source": "usatoday", "position": 9 }
      ],
      "score": 3,
      "rank": 11,
      "new_this_week": true,
      "weeks_on_list": 1,
      "amazon_url": "https://www.amazon.com/s?k=Mistakes+Were+Made+Lucy+Score&tag=jacketlist-20"
    },
    {
      "id": "james",
      "title": "James",
      "author": "Percival Everett",
      "cover_url": "",
      "description": "A reimagining of Huckleberry Finn told from the perspective of Jim, the enslaved man who travels alongside Huck down the Mississippi River.",
      "sources": ["guardian", "publishersweekly"],
      "sources_positions": [
        { "source": "guardian", "position": 6 },
        { "source": "publishersweekly", "position": 5 }
      ],
      "score": 2,
      "rank": 12,
      "new_this_week": false,
      "weeks_on_list": 10,
      "amazon_url": "https://www.amazon.com/s?k=James+Percival+Everett&tag=jacketlist-20"
    },
    {
      "id": "creation-lake",
      "title": "Creation Lake",
      "author": "Rachel Kushner",
      "cover_url": "",
      "description": "An American spy insinuates herself into a French leftist commune, pursuing a man she has never met but must soon seduce or destroy.",
      "sources": ["guardian", "publishersweekly"],
      "sources_positions": [
        { "source": "guardian", "position": 5 },
        { "source": "publishersweekly", "position": 6 }
      ],
      "score": 2,
      "rank": 13,
      "new_this_week": false,
      "weeks_on_list": 12,
      "amazon_url": "https://www.amazon.com/s?k=Creation+Lake+Rachel+Kushner&tag=jacketlist-20"
    },
    {
      "id": "we-do-not-part",
      "title": "We Do Not Part",
      "author": "Han Kang",
      "cover_url": "https://covers.openlibrary.org/b/id/14835467-M.jpg",
      "description": "Nobel laureate Han Kang's haunting novel follows a writer drawn to Jeju Island, uncovering the buried trauma of a 1948 massacre.",
      "sources": ["guardian", "publishersweekly"],
      "sources_positions": [
        { "source": "guardian", "position": 2 },
        { "source": "publishersweekly", "position": 1 }
      ],
      "score": 2,
      "rank": 14,
      "new_this_week": false,
      "weeks_on_list": 3,
      "amazon_url": "https://www.amazon.com/s?k=We+Do+Not+Part+Han+Kang&tag=jacketlist-20"
    },
    {
      "id": "it-ends-with-us",
      "title": "It Ends with Us",
      "author": "Colleen Hoover",
      "cover_url": "",
      "description": "Lily Bloom escapes an abusive childhood only to find herself in a complicated relationship that forces her to make the hardest decision of her life.",
      "sources": ["amazon", "goodreads"],
      "sources_positions": [
        { "source": "amazon", "position": 10 },
        { "source": "goodreads", "position": 7 }
      ],
      "score": 2,
      "rank": 15,
      "new_this_week": false,
      "weeks_on_list": 52,
      "amazon_url": "https://www.amazon.com/s?k=It+Ends+with+Us+Colleen+Hoover&tag=jacketlist-20"
    },
    {
      "id": "the-midnight-library",
      "title": "The Midnight Library",
      "author": "Matt Haig",
      "cover_url": "",
      "description": "Nora Seed discovers a library between life and death, where every book contains an alternative life she could have lived.",
      "sources": ["goodreads", "audible"],
      "sources_positions": [
        { "source": "goodreads", "position": 10 },
        { "source": "audible", "position": 7 }
      ],
      "score": 2,
      "rank": 16,
      "new_this_week": false,
      "weeks_on_list": 52,
      "amazon_url": "https://www.amazon.com/s?k=The+Midnight+Library+Matt+Haig&tag=jacketlist-20"
    },
    {
      "id": "the-death-of-us",
      "title": "The Death of Us",
      "author": "Abigail Dean",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9780008453657-M.jpg",
      "description": "When a teenager goes missing in a small English town, a journalist returns home and unravels a web of long-buried secrets that implicates everyone — including herself.",
      "sources": ["guardian", "publishersweekly"],
      "sources_positions": [
        { "source": "guardian", "position": 4 },
        { "source": "publishersweekly", "position": 4 }
      ],
      "score": 2,
      "rank": 17,
      "new_this_week": false,
      "weeks_on_list": 5,
      "amazon_url": "https://www.amazon.com/s?k=The+Death+of+Us+Abigail+Dean&tag=jacketlist-20"
    },
    {
      "id": "lessons-in-chemistry",
      "title": "Lessons in Chemistry",
      "author": "Bonnie Garmus",
      "cover_url": "",
      "description": "A female chemist in the 1960s becomes a cooking show host, using science to inspire millions of women to empower themselves.",
      "sources": ["goodreads", "audible"],
      "sources_positions": [
        { "source": "goodreads", "position": 8 },
        { "source": "audible", "position": 10 }
      ],
      "score": 2,
      "rank": 18,
      "new_this_week": false,
      "weeks_on_list": 52,
      "amazon_url": "https://www.amazon.com/s?k=Lessons+in+Chemistry+Bonnie+Garmus&tag=jacketlist-20"
    },
    {
      "id": "is-a-river-alive",
      "title": "Is a River Alive?",
      "author": "Robert Macfarlane",
      "cover_url": "https://covers.openlibrary.org/b/id/14846855-M.jpg",
      "description": "Award-winning nature writer Macfarlane travels three great rivers asking what it would mean to grant rivers legal rights.",
      "sources": ["guardian", "publishersweekly"],
      "sources_positions": [
        { "source": "guardian", "position": 1 },
        { "source": "publishersweekly", "position": 2 }
      ],
      "score": 2,
      "rank": 19,
      "new_this_week": true,
      "weeks_on_list": 1,
      "amazon_url": "https://www.amazon.com/s?k=Is+a+River+Alive+Robert+Macfarlane&tag=jacketlist-20"
    },
    {
      "id": "orbital",
      "title": "Orbital",
      "author": "Samantha Harvey",
      "cover_url": "",
      "description": "Six astronauts orbit the Earth sixteen times a day, tending equipment and reading one another's secrets during a mission that spans just 24 hours.",
      "sources": ["guardian", "publishersweekly"],
      "sources_positions": [
        { "source": "guardian", "position": 9 },
        { "source": "publishersweekly", "position": 10 }
      ],
      "score": 2,
      "rank": 20,
      "new_this_week": false,
      "weeks_on_list": 8,
      "amazon_url": "https://www.amazon.com/s?k=Orbital+Samantha+Harvey&tag=jacketlist-20"
    },
    {
      "id": "vanishing-world",
      "title": "Vanishing World",
      "author": "Sayaka Murata",
      "cover_url": "https://covers.openlibrary.org/b/isbn/9781783788224-M.jpg",
      "description": "From the author of Convenience Store Woman, a quietly unsettling novel about a young woman in a near-future Japan where human reproduction has been industrialised.",
      "sources": ["guardian", "publishersweekly"],
      "sources_positions": [
        { "source": "guardian", "position": 3 },
        { "source": "publishersweekly", "position": 3 }
      ],
      "score": 2,
      "rank": 21,
      "new_this_week": true,
      "weeks_on_list": 1,
      "amazon_url": "https://www.amazon.com/s?k=Vanishing+World+Sayaka+Murata&tag=jacketlist-20"
    },
    {
      "id": "want-to-know-a-secret",
      "title": "Want to Know a Secret?",
      "author": "Freida McFadden",
      "cover_url": "https://covers.openlibrary.org/b/id/15125133-M.jpg",
      "description": "An influencer known for her baking secrets tries to keep her offline secrets hidden.",
      "sources": ["nyt", "amazon"],
      "sources_positions": [
        { "source": "nyt", "position": 8 },
        { "source": "amazon", "position": 5 }
      ],
      "score": 2,
      "rank": 22,
      "new_this_week": false,
      "weeks_on_list": 2,
      "amazon_url": "https://www.amazon.com/s?k=Want+to+Know+a+Secret+Freida+McFadden&tag=jacketlist-20"
    },
    {
      "id": "theo-of-golden",
      "title": "Theo of Golden",
      "author": "Allen Levi",
      "cover_url": "",
      "description": "A man travels to a small Southern town, where he purchases pencil drawings of local residents and exchanges them for stories.",
      "sources": ["nyt"],
      "sources_positions": [
        { "source": "nyt", "position": 4 }
      ],
      "score": 1,
      "rank": 23,
      "new_this_week": false,
      "weeks_on_list": 15,
      "amazon_url": "https://www.amazon.com/s?k=Theo+of+Golden+Allen+Levi&tag=jacketlist-20"
    },
    {
      "id": "the-correspondent",
      "title": "The Correspondent",
      "author": "Virginia Evans",
      "cover_url": "",
      "description": "Letters from someone she used to know push Sybil Van Antwerp toward revisiting her past and finding a way to forgive.",
      "sources": ["nyt"],
      "sources_positions": [
        { "source": "nyt", "position": 6 }
      ],
      "score": 1,
      "rank": 24,
      "new_this_week": false,
      "weeks_on_list": 18,
      "amazon_url": "https://www.amazon.com/s?k=The+Correspondent+Virginia+Evans&tag=jacketlist-20"
    },
    {
      "id": "judge-stone",
      "title": "Judge Stone",
      "author": "Viola Davis and James Patterson",
      "cover_url": "",
      "description": "Judge Mary Stone oversees an ethically complex case in her courtroom in Union Springs, Alabama.",
      "sources": ["nyt"],
      "sources_positions": [
        { "source": "nyt", "position": 3 }
      ],
      "score": 1,
      "rank": 25,
      "new_this_week": true,
      "weeks_on_list": 1,
      "amazon_url": "https://www.amazon.com/s?k=Judge+Stone+Viola+Davis+James+Patterson&tag=jacketlist-20"
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/bestsellers.json
git commit -m "feat: rebuild bestsellers.json with 7 sources, sources_positions, top 25"
```

---

## Task 4: Update page.jsx — tiebreaker sort, split top 10 / tail

**Files:**
- Modify: `src/app/page.jsx`

- [ ] **Step 1: Update page.jsx**

```jsx
import bestsellersData from '@/data/bestsellers.json';
import seriesData from '@/data/series.json';
import adsData from '@/data/ads.json';
import HomeContent from './HomeContent';
import FooterAdZone from '@/components/FooterAdZone';
import { computeTiebreaker } from '@/utils/scoring';

export default function HomePage() {
  const seriesMap = Object.fromEntries(
    seriesData.series.map((s) => [s.id, s.id])
  );

  const books = [...bestsellersData.books].sort(
    (a, b) =>
      b.score - a.score ||
      computeTiebreaker(b) - computeTiebreaker(a)
  );

  const topBooks = books.slice(0, 10);
  const alsoTrending = books.slice(10, 25);

  return (
    <>
      <HomeContent
        books={topBooks}
        alsoTrending={alsoTrending}
        series={seriesData.series}
        seriesMap={seriesMap}
        updatedDate={bestsellersData.updated}
      />
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
```

- [ ] **Step 2: Verify build compiles**

```bash
npm run build
```

Expected: build succeeds, no errors about `computeTiebreaker` or missing props.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.jsx
git commit -m "feat: sort by tiebreaker, split top 10 and also-trending tail"
```

---

## Task 5: Update HomeContent.jsx — render alsoTrending list

**Files:**
- Modify: `src/app/HomeContent.jsx`

- [ ] **Step 1: Update HomeContent.jsx**

Add `alsoTrending` to the prop signature and render it below the BookCard grid. The section appears only when `alsoTrending` has entries and query is empty (the search hides the tail when filtering).

Replace the full file content:

```jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import SeriesCard from '@/components/SeriesCard';
import { scoreBadge } from '@/utils/scoring';

function matchesQuery(query, ...fields) {
  const q = query.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

export default function HomeContent({ books, alsoTrending = [], series, seriesMap, updatedDate }) {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} seriesMap={seriesMap} />
              ))}
            </div>
          )}

          {/* Also trending — hidden when search is active */}
          {!query && alsoTrending.length > 0 && (
            <div className="mt-12">
              <h3 className="font-headline text-lg font-medium text-on-surface mb-4">
                Also trending this week
              </h3>
              <ol className="space-y-2">
                {alsoTrending.map((book) => {
                  const badge = scoreBadge(book.score);
                  return (
                    <li key={book.id} className="flex items-center gap-3 text-sm font-body">
                      <span className="w-6 text-right text-on-surface-variant font-label shrink-0">
                        {book.rank}.
                      </span>
                      <span className="font-medium text-on-surface">{book.title}</span>
                      <span className="text-on-surface-variant">—</span>
                      <span className="text-on-surface-variant">{book.author}</span>
                      <span className="shrink-0">{badge.emoji}</span>
                      <a
                        href={book.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto shrink-0 text-secondary font-label hover:underline"
                      >
                        Buy →
                      </a>
                    </li>
                  );
                })}
              </ol>
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

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: builds cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/app/HomeContent.jsx
git commit -m "feat: add also-trending ranked list below top 10"
```

---

## Task 6: Update Nav — add Lists link

**Files:**
- Modify: `src/components/Nav.jsx`

- [ ] **Step 1: Update Nav.jsx**

```jsx
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
        <div className="flex items-center gap-6">
          <Link href="/lists" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
            Lists
          </Link>
          <Link href="/series" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
            Series
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat: add Lists nav link"
```

---

## Task 7: Create /lists hub page

**Files:**
- Create: `src/app/lists/page.jsx`

- [ ] **Step 1: Create `src/app/lists/page.jsx`**

```jsx
import Link from 'next/link';
import FooterAdZone from '@/components/FooterAdZone';
import adsData from '@/data/ads.json';

const SOURCES = [
  { slug: 'nyt', label: 'NYT Best Sellers', description: 'The New York Times Combined Print & E-Book Fiction and Nonfiction lists.' },
  { slug: 'guardian', label: 'The Guardian Best Sellers', description: 'Weekly fiction and non-fiction bestsellers from The Guardian.' },
  { slug: 'goodreads', label: 'Goodreads Most Read', description: 'The most-read books on Goodreads this week across all genres.' },
  { slug: 'amazon', label: 'Amazon Best Sellers', description: 'The most-sold books on Amazon updated weekly.' },
  { slug: 'usatoday', label: 'USA Today Best-Selling Books', description: 'A single cross-format list of the 150 top-selling books in the US.' },
  { slug: 'publishersweekly', label: 'Publishers Weekly Best Sellers', description: 'Fiction and non-fiction bestsellers from Publishers Weekly.' },
  { slug: 'audible', label: 'Audible Best Sellers', description: 'The most-downloaded audiobooks on Audible this week.' },
];

export default function ListsPage() {
  return (
    <>
      <main className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface mb-4">
            Bestseller Lists
          </h1>
          <p className="text-on-surface-variant font-body mb-12 max-w-2xl">
            JacketList tracks seven major bestseller lists each week and merges them into a single ranked view. Browse any individual list below — all links are Amazon affiliate links.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOURCES.map((source) => (
              <Link
                key={source.slug}
                href={`/lists/${source.slug}`}
                className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-3 hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300"
              >
                <h2 className="font-headline text-lg font-medium text-on-surface">
                  {source.label}
                </h2>
                <p className="text-sm text-on-surface-variant font-body flex-1">
                  {source.description}
                </p>
                <span className="text-sm text-secondary font-label">
                  See list →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/lists/page.jsx
git commit -m "feat: add /lists hub page"
```

---

## Task 8: Create /lists/[source] per-source page

**Files:**
- Create: `src/app/lists/[source]/page.jsx`

- [ ] **Step 1: Create `src/app/lists/[source]/page.jsx`**

```jsx
import Link from 'next/link';
import BookCard from '@/components/BookCard';
import FooterAdZone from '@/components/FooterAdZone';
import adsData from '@/data/ads.json';
import nyt from '@/data/sources/nyt.json';
import guardian from '@/data/sources/guardian.json';
import goodreads from '@/data/sources/goodreads.json';
import amazon from '@/data/sources/amazon.json';
import usatoday from '@/data/sources/usatoday.json';
import publishersweekly from '@/data/sources/publishersweekly.json';
import audible from '@/data/sources/audible.json';

const ALL_SOURCES = [nyt, guardian, goodreads, amazon, usatoday, publishersweekly, audible];

export function generateStaticParams() {
  return ALL_SOURCES.map((s) => ({ source: s.source }));
}

export default function SourceListPage({ params }) {
  const sourceData = ALL_SOURCES.find((s) => s.source === params.source);

  if (!sourceData) return null;

  // Shape source books to match the BookCard book prop shape.
  // Source books have no score/sources/weeks_on_list — omit those badges.
  const books = sourceData.books.map((b) => ({
    id: `${sourceData.source}-${b.position}`,
    title: b.title,
    author: b.author,
    cover_url: b.cover_url,
    description: '',
    sources: [sourceData.source],
    score: null,
    rank: b.position,
    weeks_on_list: 0,
    amazon_url: b.amazon_url,
  }));

  return (
    <>
      <main className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-on-surface-variant font-label mb-2">
            As seen on
          </p>
          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface mb-2">
            {sourceData.label}
          </h1>
          <p className="text-sm text-on-surface-variant font-label mb-12">
            Updated {sourceData.updated}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} seriesMap={{}} showScore={false} />
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="text-sm text-secondary font-label hover:underline"
            >
              ← See our full merged Top 10
            </Link>
          </div>
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
```

- [ ] **Step 2: Update BookCard to support `showScore` prop**

BookCard currently always renders the score badge. Add an optional `showScore` prop (default `true`) so source list pages can suppress it.

In `src/components/BookCard.jsx`, change the prop signature and badge rendering:

```jsx
export default function BookCard({ book, seriesMap = {}, showScore = true }) {
```

And wrap the score badge span:

```jsx
{/* Score badge */}
{showScore && book.score !== null && (
  <span className="text-xs font-label font-medium text-secondary">
    {badge.emoji} {badge.label}
  </span>
)}
```

The full updated `src/components/BookCard.jsx`:

```jsx
'use client';
// src/components/BookCard.jsx
import { useState } from 'react';
import Link from 'next/link';
import SourceBadge from './SourceBadge';
import { scoreBadge } from '@/utils/scoring';

export default function BookCard({ book, seriesMap = {}, showScore = true }) {
  const badge = book.score !== null ? scoreBadge(book.score) : null;
  const hasValidSeries = book.series_id && seriesMap[book.series_id];
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
      {/* Cover */}
      <div className="w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
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
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Score badge */}
        {showScore && badge && (
          <span className="text-xs font-label font-medium text-secondary">
            {badge.emoji} {badge.label}
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

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: 7 static routes generated under `/lists/[source]`, no errors.

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: all tests pass (BookCard tests may need a minor update — see step 5).

- [ ] **Step 5: Fix BookCard test if needed**

If `__tests__/components/BookCard.test.jsx` fails because it expects the score badge to always render, update the test to pass a valid `score` value and confirm the badge still appears by default. Open the test file and verify `book` fixtures include `score: 1` or higher.

- [ ] **Step 6: Commit**

```bash
git add src/app/lists/ src/components/BookCard.jsx
git commit -m "feat: add /lists/[source] static pages, add showScore prop to BookCard"
```

---

## Task 9: Update CoWork bestseller prompt

**Files:**
- Modify: `cowork/bestseller-prompt.md`

- [ ] **Step 1: Replace `cowork/bestseller-prompt.md`**

```markdown
# JacketList — Weekly Bestseller Prompt

Use this prompt with Claude CoWork every Monday to refresh `src/data/sources/*.json` and `src/data/bestsellers.json`.

---

## PROMPT

You are a book data researcher for JacketList, a book discovery website. Your job is to identify the current week's bestselling books across seven sources and output structured JSON files.

### Task

Research the current bestseller lists from all seven sources:

1. **NYT Best Sellers** — Combined Print & E-Book Fiction + Nonfiction
2. **The Guardian Best Sellers** — current week fiction + non-fiction
3. **Goodreads Most Read** — most-read books this week across all genres
4. **Amazon Best Sellers** — most-sold books in Books (updated weekly)
5. **USA Today Best-Selling Books** — cross-format top 150
6. **Publishers Weekly Best Sellers** — fiction + non-fiction combined
7. **Audible Best Sellers** — most-downloaded audiobooks this week

For each source, identify the top 10 books in ranked order.

### Step 1 — Output 7 source files

For each source, output a JSON object matching this schema exactly:

```json
{
  "source": "<slug>",
  "label": "<display name>",
  "url": "<canonical list URL>",
  "updated": "YYYY-MM-DD",
  "books": [
    {
      "position": 1,
      "title": "Exact Title",
      "author": "Full Name",
      "cover_url": "<open library cover URL or empty string>",
      "amazon_url": "https://www.amazon.com/s?k={URL_ENCODED_TITLE}+{URL_ENCODED_AUTHOR_LASTNAME}&tag=jacketlist-20"
    }
  ]
}
```

Source slugs: `nyt`, `guardian`, `goodreads`, `amazon`, `usatoday`, `publishersweekly`, `audible`

**Cover URL:** Search Open Library: `https://openlibrary.org/search.json?q={title}+{author}&limit=1&fields=cover_i` — use `cover_i` to build `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`. If no `cover_i`, set `cover_url` to `""`. Do NOT guess ISBNs.

Write each result to `src/data/sources/{slug}.json`.

### Step 2 — Merge into bestsellers.json

Cross-reference all 7 source files. For each unique book (match by normalised title + author):

1. `sources` — array of slugs where the book appears
2. `score` — `sources.length` (1–7)
3. `sources_positions` — array of `{ "source": "<slug>", "position": <int> }` for each source the book appears on
4. `rank` — final position in merged list (1 = highest), sorted by score desc then tiebreaker desc

**Tiebreaker formula:**
```
avg_position    = average of position values in sources_positions
position_score  = 11 - avg_position          (range 1–10)
longevity_score = min(weeks_on_list, 10)     (range 1–10)
tiebreaker      = (position_score + longevity_score) / 2
```

Include up to **25 books** in `bestsellers.json`, sorted by score desc, tiebreaker desc.

### Score badges

| Score | Badge | Label |
|-------|-------|-------|
| 5–7 | 🔥 | Top Pick |
| 3–4 | ⬆️ | Trending |
| 1–2 | 👀 | Worth Watching |

### For each book in bestsellers.json, provide

1. `id` — URL-safe slug (e.g. `"the-great-alone"`)
2. `title` — exact title
3. `author` — full name
4. `cover_url` — from Open Library search (see above)
5. `description` — 1–2 sentences, engaging, spoiler-free
6. `sources` — array of source slugs
7. `sources_positions` — array of `{ source, position }` objects
8. `score` — integer 1–7
9. `rank` — integer 1–25
10. `new_this_week` — `true` if this is the book's first week on any list
11. `weeks_on_list` — integer (carry forward from previous week's data; set to 1 if new)
12. `series_id` — slug matching `series.json` if applicable, else `null`
13. `series_book_number` — integer if applicable, else `null`
14. `amazon_url` — `https://www.amazon.com/s?k={URL_ENCODED_TITLE}+{URL_ENCODED_AUTHOR_LASTNAME}&tag=jacketlist-20`

### Output format

Output **only** valid JSON objects — no commentary, no markdown fences, no explanation. Output all 8 files in sequence (7 source files + 1 merged file), each preceded by a single comment line:

```
// src/data/sources/nyt.json
{ ... }

// src/data/sources/guardian.json
{ ... }

... (repeat for all 7 sources)

// src/data/bestsellers.json
{ ... }
```

Set `updated` to today's date in ISO format on all files.

---

## After receiving output

1. **Verify** — spot-check the top 5 entries in `bestsellers.json` against the actual source lists
2. **Check series links** — if `series_id` is set, confirm it matches an entry in `series.json`
3. **Replace files** — overwrite each source file and `bestsellers.json` with the new content
4. **Rebuild** — run `npm run build` to confirm the static export generates correctly
```

- [ ] **Step 2: Commit**

```bash
git add cowork/bestseller-prompt.md
git commit -m "docs: update CoWork prompt for 7 sources and new bestsellers.json schema"
```

---

## Task 10: Final build verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: clean build. Verify output includes:
- `/lists` — hub page
- `/lists/nyt`, `/lists/guardian`, `/lists/goodreads`, `/lists/amazon`, `/lists/usatoday`, `/lists/publishersweekly`, `/lists/audible` — 7 source pages

- [ ] **Step 3: Start dev server and manually verify**

```bash
npm run dev
```

Check:
- Homepage shows exactly 10 BookCards
- "Also trending this week" list appears below with books 11–25
- Searching hides the "Also trending" section
- Nav shows "Lists" and "Series" links
- `/lists` shows 7 source cards
- `/lists/nyt` shows 10 BookCards without score badges
- "See our full merged Top 10 →" link works

- [ ] **Step 4: Commit any fixes, then final commit**

```bash
git add -A
git commit -m "feat: expanded sources complete — 7 sources, /lists pages, top 10 + tail"
```
```

---

## Self-Review

**Spec coverage check:**
- ✅ 7 sources (Task 2)
- ✅ Per-source JSON files with schema (Task 2)
- ✅ `sources_positions` field in bestsellers.json (Task 3)
- ✅ Updated scoring thresholds 5–7/3–4/1–2 (Task 1)
- ✅ `computeTiebreaker` with position + longevity (Task 1)
- ✅ Homepage Top 10 (Task 4)
- ✅ Books 11–25 as compact list with rank, title, author, emoji, buy link (Task 5)
- ✅ `/lists` hub page (Task 7)
- ✅ `/lists/[source]` per-source page with attribution + back link (Task 8)
- ✅ Nav "Lists" link (Task 6)
- ✅ CoWork prompt updated (Task 9)
- ✅ Edge case: `showScore=false` for source pages so raw lists have no score badge (Task 8)
- ✅ BookCard `description` wrapped in conditional so empty strings don't render blank space (Task 8)

**Type consistency check:** `computeTiebreaker` defined in Task 1, imported in Task 4 (`page.jsx`) — both use `book.sources_positions` and `book.weeks_on_list`. Consistent.

**No placeholders detected.**
