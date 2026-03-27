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
