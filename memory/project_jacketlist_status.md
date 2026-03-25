---
name: JacketList expanded-sources feature status
description: In-progress feature expanding bestseller sources from 3 to 7, with per-source list pages
type: project
---

Expanding bestseller sources from 3 (NYT, Guardian, Goodreads) to 7 (+ Amazon, USA Today, Publishers Weekly, Audible). Adding /lists hub + /lists/[source] SEO pages. Homepage capped to Top 10 BookCards + compact "Also trending" list for books 11–25.

**Why:** More data sources = richer scoring; per-source pages are SEO gold (high-volume search terms for each list name).

**How to apply:** Implementation is on branch `feature/expanded-sources` in worktree `.worktrees/expanded-sources`. Plan at `docs/superpowers/plans/2026-03-25-expanded-sources.md`. Resume from Task 3.

**Completed tasks (on feature/expanded-sources branch):**
- Task 1: scoring.js updated — new thresholds (5-7/3-4/1-2), computeTiebreaker added
- Task 2: 7 source JSON seed files created in src/data/sources/

**Remaining tasks:**
- Task 3: Update bestsellers.json (add sources_positions, rebuild top 25)
- Task 4: Update page.jsx (tiebreaker sort, split top10/alsoTrending)
- Task 5: Update HomeContent.jsx (alsoTrending prop + compact list)
- Task 6: Update Nav (add Lists link)
- Task 7: Create /lists hub page
- Task 8: Create /lists/[source] page + BookCard showScore prop
- Task 9: Update CoWork prompt
- Task 10: Final build verification
