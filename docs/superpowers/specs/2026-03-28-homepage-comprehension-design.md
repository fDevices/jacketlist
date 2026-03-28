# Homepage Comprehension — Design Spec

**Date:** 2026-03-28
**Scope:** BookCard score clarity + threshold-based editorial labels

---

## Problem

The homepage shows ranking evidence (source badge chips, emoji score badge) but requires the user to count or interpret it. A book on 7/7 sources looks only marginally different from one on 3/7. The editorial rigor is present but not stated. This hurts trust and differentiation.

---

## Goal

Make the scoring proposition legible at a glance, and give each book a distinct editorial identity without adding new data sources or changing the data schema.

---

## Changes

### 1. Score badge — explicit source count

**File:** `src/components/BookCard.jsx`

Append `· {book.score}/7 lists` to the existing score badge line.

**Before:**
```
🔥 Top Pick
```

**After:**
```
🔥 Top Pick · 7/7 lists
```

`book.score` is already present on every book object (integer 1–7). No data changes required.

Only rendered when `showScore={true}` (unchanged guard). Per-source list pages (`showScore={false}`) are unaffected.

---

### 2. Editorial label chips

**File:** `src/utils/scoring.js` — add `editorialLabels(book)` export

**File:** `src/components/BookCard.jsx` — import and render

#### Label definitions (threshold-based)

| Label | Condition | Data field(s) |
|---|---|---|
| `New This Week` | `book.new_this_week === true` | `new_this_week` |
| `Top Consensus` | `book.score >= 6` | `score` |
| `Long Running` | `book.weeks_on_list >= 8` | `weeks_on_list` |
| `Rising Fast` | `!new_this_week && weeks_on_list >= 2 && weeks_on_list <= 4 && score >= 5` | `new_this_week`, `weeks_on_list`, `score` |

A book can earn multiple labels (e.g. a book in week 3 with score 6 gets both `Top Consensus` and `Rising Fast`).

#### Placement in BookCard

Chips render between the source badges and the weeks-on-list line:

1. Score badge (`🔥 Top Pick · 7/7 lists`)
2. Title + author
3. Source badges
4. **Editorial label chips** ← new
5. Weeks on list
6. Series badge
7. Description
8. Buy on Amazon

#### Styling

`bg-primary-container text-on-primary-container` rounded-full pills (`px-2 py-0.5 text-xs font-label`). Visually distinct from source badges (`surface-container-high`) and score badge (`text-secondary`).

Only rendered when `showScore={true}`. Per-source list pages stay clean.

---

## Files changed

| File | Change |
|---|---|
| `src/utils/scoring.js` | Add `editorialLabels(book)` export |
| `src/components/BookCard.jsx` | Append score count to badge; import + render label chips |

No data schema changes. No new dependencies.

---

## Out of scope

- Email capture / repeat-visit loop (requires third-party embed)
- Series template enrichment (next sprint — requires schema + UI changes)
- "Also trending" compact list changes

---

## Status: SHIPPED 2026-03-28

Commits on `main`:
- `9709d8e` — feat: add editorialLabels utility to scoring.js
- `c50b5a5` — feat: add source count and editorial label chips to BookCard
- `9aeb826` — fix: apply score null guard consistently to editorialLabels call

---

## Next phases

### Phase 2 — Series template enrichment

**Goal:** Every series page delivers the same interpretive depth as the Hunger Games page. Currently quality varies — Dune and Percy Jackson are minimal lists; Hunger Games adds reading advice.

**Schema changes to `series.json`** (all fields optional, backwards-compatible):
```json
{
  "best_starting_point": "The Eye of the World",
  "who_its_for": "Readers who want an immersive, character-driven epic with deep world-building.",
  "skip_or_optional": "New Spring (prequel) can be saved until after Book 10.",
  "read_next": ["stormlight-archive", "mistborn"]
}
```

**UI changes to `SeriesPage`:** New "How to read this series" block above the reading order tabs, rendering `best_starting_point`, `who_its_for`, `skip_or_optional`, and `read_next` links when present.

**CoWork update:** `cowork/series-prompt.md` needs new field instructions so future series additions populate the enrichment fields.

---

### Phase 3 — Repeat-visit loop

**Goal:** Give visitors a reason to return, and ideally a mechanism to capture them.

**Option A — Editorial framing (zero cost, do first):**
Add a one-line callout near the updated-date stamp on the homepage:
> "Updated every Monday. Bookmark us."
Pure content change, no infrastructure.

**Option B — Email capture (do after traffic justifies it):**
Embed a Mailchimp or ConvertKit form widget in the footer or below the bestsellers section. Compatible with static export (client-side `<script>` tag). Requires signing up for an email service and creating a list.

**Recommended sequence:** Ship Option A immediately (it's one line), plan Option B once the site has meaningful weekly traffic.
