# JacketList — Series Research Prompt (Batch Mode)

Use this prompt with Claude CoWork to research and add new series to `src/data/series.json`.

---

## How to use

1. Fill in the **INPUT** section below
2. Run this prompt in CoWork
3. Review the output JSON
4. Paste approved entries into `src/data/series.json`

---

## INPUT

```
GENRE: Fantasy
BATCH_SIZE: 5
EXCLUDE_ALREADY_IN_DB: The Wheel of Time, The Stormlight Archive, Mistborn, The Kingkiller Chronicle, A Song of Ice and Fire, The First Law, The Witcher, His Dark Materials, Dune, Foundation, The Expanse, Red Rising, Old Man's War, Jack Reacher, Harry Hole, Alex Cross, Mitch Rapp, Jason Bourne, Hercule Poirot, Miss Marple, Chief Inspector Gamache, The Thursday Murder Club, Flavia de Luce, Harry Potter, The Hunger Games, Percy Jackson and the Olympians, Divergent, The Mortal Instruments, Outlander, A Court of Thorns and Roses, Throne of Glass, The Inheritance Cycle, The Lord of the Rings, Crescent City, The Housemaid, Knockemout, Jake Brigance, Joe Pickett, Part of Your World, Dungeon Crawler Carl, The Blacktongue Thief, It Ends with Us, Six of Crows, An Ember in the Ashes, The Gentlemen Bastards, Realm of the Elderlings, The Malazan Book of the Fallen, The Chronicles of Narnia, The Dark Tower
BESTSELLER_AUTHORS: Virginia Evans, Viola Davis and James Patterson, Andy Weir, Allen Levi, Freida McFadden, Alice Feeney, Colleen Hoover, Tayari Jones, Briar Boleyn, Lucy Score, Matt Dinniman, Christopher Buehlman, Lily King, Alison Espach, Taylor Jenkins Reid, SenLinYu, John Grisham, Mel Robbins, Abby Jimenez, Belle Burden, C.J. Box, Liz Tomforde, Rachel Reid
FOCUS: Popular series with 500k+ Goodreads ratings
```

*(Update before each run. See `cowork/series-list.md` for the full list of series already in the DB — copy all titles into `EXCLUDE_ALREADY_IN_DB`. Copy `BESTSELLER_AUTHORS` from the author names currently in `bestsellers.json` — these get first priority.)*

---

## PROMPT

You are a book data researcher for JacketList, a book discovery website. Your job is to research popular book series and output structured JSON data in a precise format.

### Task

Research **{{ BATCH_SIZE }}** popular book series in the **{{ GENRE }}** genre.

Requirements:
- Each series must have at least 500,000 ratings on Goodreads (for T2 batches) or 100,000 (for T3 niche batches)
- Do NOT include: {{ EXCLUDE_ALREADY_IN_DB }}
- Focus on series where reading order genuinely matters (the "Author's Recommended" order adds real value)
- Prefer series that are complete or actively publishing

**Prioritization rule:** The following authors currently have books on the JacketList bestseller list: **{{ BESTSELLER_AUTHORS }}**. Fill as many slots as possible with series by these authors first (across any genre), then fill remaining slots from {{ GENRE }}. If a bestseller author has no series, or all their series are already in the DB, skip them and fill from {{ GENRE }} instead.

### For each series, provide

1. `id` — URL-safe slug (e.g. `"harry-potter"`, `"mistborn"`)
2. `title` — official series name
3. `author` — full name(s), comma-separated if multiple
4. `genres` — array of 1–3 genre tags (use: Fantasy, Sci-Fi, Thriller, Mystery, Romance, Historical Fiction, Horror, Young Adult, Literary Fiction, Crime)
5. `total_books` — count of main series books (exclude short stories and novellas unless they are essential to the plot)
6. `currently_on_bestseller_list` — set to `false` unless you have strong evidence it is currently charting
7. `description` — 2–3 sentences. Hook the reader. Focus on what makes the series distinctive, not just the plot summary.
8. `orders.chronological` — books in internal story chronology order
9. `orders.authors_recommended` — the order the author recommends for first-time readers (may differ from chronological due to prequels, companion novels, etc.)

For each book in both order lists:
- `position` — integer starting at 1
- `title` — exact book title
- `note` — optional string, only include if there is genuinely useful guidance (e.g. "Prequel — read after Book 3", "Novella — can be skipped on first read")
- `amazon_url` — use this exact format: `https://www.amazon.com/s?k={URL_ENCODED_TITLE}+{URL_ENCODED_AUTHOR_LASTNAME}&tag=jacketlist-20`

### Reading order rules

- If chronological and author's recommended are **identical**, output them both anyway (the site handles deduplication)
- If the author has given explicit guidance on reading order (interviews, website, foreword), follow that
- If no explicit guidance exists, use community consensus from Goodreads or the author's official website
- Include novellas and short story collections **only** if they are plot-essential or the author recommends them in the main reading order

### Output format

Output **only** a valid JSON array — no commentary, no markdown fences, no explanation. The array should contain exactly {{ BATCH_SIZE }} series objects.

```json
[
  {
    "id": "example-series",
    "title": "Example Series",
    "author": "Author Name",
    "genres": ["Fantasy"],
    "total_books": 5,
    "currently_on_bestseller_list": false,
    "description": "A compelling 2–3 sentence hook that makes someone want to read this series.",
    "orders": {
      "chronological": [
        { "position": 1, "title": "Book One", "amazon_url": "https://www.amazon.com/s?k=Book+One+Author&tag=jacketlist-20" },
        { "position": 2, "title": "Book Two", "note": "Optional guidance here", "amazon_url": "https://www.amazon.com/s?k=Book+Two+Author&tag=jacketlist-20" }
      ],
      "authors_recommended": [
        { "position": 1, "title": "Book One", "amazon_url": "https://www.amazon.com/s?k=Book+One+Author&tag=jacketlist-20" },
        { "position": 2, "title": "Book Two", "amazon_url": "https://www.amazon.com/s?k=Book+Two+Author&tag=jacketlist-20" }
      ]
    }
  }
]
```

---

## After receiving output

1. **Verify** — spot-check 2–3 entries against Goodreads or the author's website for reading order accuracy
2. **Merge** — paste approved entries into the `series` array in `src/data/series.json`
3. **Update series list** — add new entries to `cowork/series-list.md` (sorted by author last name)
4. **Rebuild** — run `npm run build` to confirm the static export generates correctly
5. **Next run** — update `BESTSELLER_AUTHORS` by checking the current `bestsellers.json` for any author changes

---

## Genre reference (use these exact strings in the `genres` field)

Fantasy, Sci-Fi, Thriller, Mystery, Romance, Historical Fiction, Horror, Young Adult, Literary Fiction, Crime
