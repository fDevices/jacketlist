# JacketList — Weekly Bestseller Prompt

Use this prompt with Claude CoWork every Monday to refresh `src/data/bestsellers.json`.

---

## PROMPT

You are a book data researcher for JacketList, a book discovery website. Your job is to identify the current week's bestselling books across three sources and output structured JSON.

### Task

Research the current bestseller lists from:
1. **NYT Best Sellers** (Combined Print & E-Book Fiction + Nonfiction)
2. **The Guardian Best Sellers** (current week)
3. **Goodreads Choice Awards / trending** (current top-rated books being actively read this week)

Cross-reference all three lists. For each book found, note which sources it appears on.

### Scoring

- Appears on all 3 sources → `score: 3` (🔥 Top Pick)
- Appears on 2 sources → `score: 2` (⬆️ Trending)
- Appears on 1 source → `score: 1` (👀 Worth Watching)

Output the top **20 books**, sorted by score descending, then by overall prominence.

### For each book, provide

1. `id` — URL-safe slug (e.g. `"the-great-alone"`)
2. `title` — exact title
3. `author` — full name
4. `cover_url` — Open Library URL using ISBN: `https://covers.openlibrary.org/b/isbn/{ISBN}-M.jpg` — use the book's ISBN-13 if known, otherwise leave as empty string `""`
5. `description` — 1–2 sentences. Engaging, spoiler-free.
6. `sources` — array of source strings: `"nyt"`, `"guardian"`, `"goodreads"`
7. `score` — integer 1–3 (count of sources)
8. `rank` — integer position in final list (1 = highest)
9. `new_this_week` — `true` if this is the first week on the list, `false` if it appeared last week
10. `weeks_on_list` — integer, 1 if new this week
11. `series_id` — slug matching an entry in `series.json` if applicable, otherwise `null`
12. `series_book_number` — integer position in the series if applicable, otherwise `null`
13. `amazon_url` — `https://www.amazon.com/s?k={URL_ENCODED_TITLE}+{URL_ENCODED_AUTHOR_LASTNAME}&tag=jacketlist-20`

### Output format

Output **only** a valid JSON object — no commentary, no markdown fences, no explanation.

```json
{
  "updated": "YYYY-MM-DD",
  "books": [ ... ]
}
```

Set `updated` to today's date in ISO format.

---

## After receiving output

1. **Verify** — spot-check the top 5 entries against the actual NYT or Guardian list
2. **Check series links** — if `series_id` is set, confirm it matches an entry in `series.json`
3. **Replace** — overwrite the contents of `src/data/bestsellers.json` with the new object
4. **Rebuild** — run `npm run build` to confirm the static export generates correctly
