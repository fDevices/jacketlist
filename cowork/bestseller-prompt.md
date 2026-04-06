# JacketList — Weekly Bestseller Update

Run this workflow every Monday with Claude Code. When fully automated sources are available for all 7 lists, this can be converted to a CoWork prompt.

---

## Step 1 — Gather manual sources (you do this)

Two sources require manual lookup before starting:

**Ark Bokhandel**
Visit [ark.no/toppselgere/engelsk](https://www.ark.no/toppselgere/engelsk) and note or screenshot the top 10 English titles.

**Amazon Best Sellers**
Visit [amazon.com/charts/mostread/books](https://www.amazon.com/charts/mostread/books) and note the top 10 titles.

---

## Step 2 — Start a Claude Code session

Open Claude Code and say something like:

> "Time for the weekly bestseller update. Here are this week's manual sources:
>
> **Ark top 10:**
> 1. [title] — [author]
> ...
>
> **Amazon top 10:**
> 1. [title] — [author]
> ...
>
> Please fetch the rest and update all the files."

Claude Code will:
- Call the NYT API for fiction + nonfiction (key is in `.env.local`)
- Browse Guardian, Goodreads, Publishers Weekly, and Audible for their current lists
- Update all 7 `src/data/sources/*.json` files
- Merge into `src/data/bestsellers.json` (top 25, scored and ranked)
- Flag anything that looks wrong before writing

---

## Reference — Source details

| Source | Slug | How it's fetched |
|--------|------|-----------------|
| NYT Best Sellers | `nyt` | API (key in `.env.local`) |
| The Guardian | `guardian` | Web browse |
| Goodreads Most Read | `goodreads` | Web browse |
| Amazon Best Sellers | `amazon` | Manual (you paste it) |
| Ark Bokhandel | `ark` | Manual (you paste it) |
| Publishers Weekly | `publishersweekly` | Web browse |
| Audible Best Sellers | `audible` | Web browse |

---

## Reference — JSON schemas

### Source file (`src/data/sources/{slug}.json`)
```json
{
  "source": "slug",
  "label": "Display Name",
  "url": "https://...",
  "updated": "YYYY-MM-DD",
  "books": [
    {
      "position": 1,
      "title": "Exact Title",
      "author": "Full Name",
      "cover_url": "https://covers.openlibrary.org/b/id/{cover_i}-M.jpg",
      "amazon_url": "https://www.amazon.com/s?k=Title+Author&tag=jacketlist-20"
    }
  ]
}
```

### Merged file (`src/data/bestsellers.json`)
```json
{
  "updated": "YYYY-MM-DD",
  "books": [
    {
      "id": "url-safe-slug",
      "title": "Exact Title",
      "author": "Full Name",
      "cover_url": "...",
      "description": "1–2 sentence hook.",
      "sources": ["nyt", "goodreads"],
      "sources_positions": [
        { "source": "nyt", "position": 1 },
        { "source": "goodreads", "position": 3 }
      ],
      "score": 2,
      "rank": 1,
      "new_this_week": false,
      "weeks_on_list": 4,
      "series_id": null,
      "series_book_number": null,
      "amazon_url": "https://www.amazon.com/s?k=Title+Author&tag=jacketlist-20"
    }
  ]
}
```

---

## Reference — Scoring rules

**Score** = number of sources the book appears on (1–7)

| Score | Badge | Label |
|-------|-------|-------|
| 5–7 | 🔥 | Top Pick |
| 3–4 | ⬆️ | Trending |
| 1–2 | 👀 | Worth Watching |

**Tiebreaker** (used when scores are equal):
```
avg_position    = average of all positions across sources
position_score  = 11 - avg_position
longevity_score = min(weeks_on_list, 10)
tiebreaker      = (position_score + longevity_score) / 2
```

Sort: score desc → tiebreaker desc. Top 25 books included.

---

## After the update

1. Spot-check top 5 in `bestsellers.json` against the actual lists
2. Confirm any `series_id` values match entries in `series.json`
3. Run `npm run build` to verify the static export is clean
4. Push on Tuesday (or whenever ready)

---

## Converting to CoWork (future)

This workflow is ready to become a fully automated CoWork prompt once reliable API or scraping access exists for Amazon and Ark. The schemas, scoring logic, and source list above are all CoWork-ready — just wrap in the CoWork prompt format and add fetch instructions for the two remaining manual sources.
