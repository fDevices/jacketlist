#!/usr/bin/env node
/**
 * Merges all updated source files into src/data/bestsellers.json
 *
 * - Only includes sources updated within the last 7 days
 * - Carries forward weeks_on_list, description, series info, cover_url from
 *   the previous bestsellers.json
 * - Scores by number of sources, tiebreaker by position + longevity
 * - Outputs top 25 books sorted by score desc, tiebreaker desc
 *
 * Usage: node scripts/merge-bestsellers.js [--dry-run]
 */

const { writeFileSync, readFileSync } = require('fs');
const { resolve } = require('path');

const DATA_DIR = resolve(__dirname, '../src/data');
const SOURCES = ['nyt', 'goodreads', 'audible', 'publishersweekly', 'amazon', 'guardian', 'usatoday'];
const STALE_DAYS = 7;
const DRY_RUN = process.argv.includes('--dry-run');

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/['']/g, '')          // remove apostrophes before stripping
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Normalise for matching across sources (title + author last name)
function matchKey(title, author) {
  const t = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const lastName = author.split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g, '');
  return `${t}__${lastName}`;
}

function isRecent(dateStr) {
  const updated = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - STALE_DAYS);
  return updated >= cutoff;
}

function computeTiebreaker(sourcesPositions, weeksOnList) {
  if (!sourcesPositions.length) return 0;
  const positions = sourcesPositions.map(sp => sp.position);
  const avg = positions.reduce((a, b) => a + b, 0) / positions.length;
  const positionScore = 11 - avg;
  const longevityScore = Math.min(weeksOnList, 10);
  return (positionScore + longevityScore) / 2;
}

// Cover priority: local /images/ path > nyt > goodreads > audible > anything else > ""
function bestCover(candidates) {
  const local = candidates.find(c => c?.startsWith('/images/'));
  if (local) return local;
  const nyt = candidates.find(c => c?.includes('nyt.com'));
  if (nyt) return nyt;
  const gr = candidates.find(c => c?.includes('gr-assets') || c?.includes('goodreads'));
  if (gr) return gr;
  return candidates.find(c => c) || '';
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const today = new Date().toISOString().split('T')[0];

  // Load previous bestsellers for carry-forward data
  const prev = readJson(`${DATA_DIR}/bestsellers.json`);
  const prevMap = {};
  for (const book of prev.books) {
    prevMap[matchKey(book.title, book.author)] = book;
  }

  // Load source files — skip stale ones
  const activeSources = [];
  for (const slug of SOURCES) {
    const path = `${DATA_DIR}/sources/${slug}.json`;
    let source;
    try {
      source = readJson(path);
    } catch {
      continue;
    }
    if (!isRecent(source.updated)) {
      console.log(`⚠️  Skipping ${slug} (last updated ${source.updated} — stale)`);
      continue;
    }
    activeSources.push(source);
    console.log(`✓  Using ${slug} (updated ${source.updated}, ${source.books.length} books)`);
  }

  if (activeSources.length === 0) {
    throw new Error('No recent source files found — run fetch scripts first');
  }

  // Build merged book map
  const bookMap = {}; // matchKey -> merged entry

  for (const source of activeSources) {
    for (const book of source.books) {
      const key = matchKey(book.title, book.author);

      if (!bookMap[key]) {
        bookMap[key] = {
          title: book.title,
          author: book.author,
          sources: [],
          sources_positions: [],
          covers: [],
        };
      }

      bookMap[key].sources.push(source.source);
      bookMap[key].sources_positions.push({ source: source.source, position: book.position });
      if (book.cover_url) bookMap[key].covers.push(book.cover_url);
    }
  }

  // Build final list with scores + carry-forward data
  const books = [];

  for (const [key, merged] of Object.entries(bookMap)) {
    const prev = prevMap[key];
    const score = merged.sources.length;
    const weeksOnList = prev ? prev.weeks_on_list + 1 : 1;
    const tiebreaker = computeTiebreaker(merged.sources_positions, weeksOnList);

    // Cover: prefer carried-forward (especially local /images/), then source covers
    const coverCandidates = [
      prev?.cover_url,
      ...merged.covers,
    ];

    books.push({
      id: prev?.id || slugify(merged.title),
      title: merged.title,
      author: merged.author,
      cover_url: bestCover(coverCandidates),
      description: prev?.description || '',
      sources: merged.sources,
      sources_positions: merged.sources_positions,
      score,
      tiebreaker,         // temporary, removed before writing
      rank: 0,            // assigned after sort
      new_this_week: !prev,
      weeks_on_list: weeksOnList,
      series_id: prev?.series_id || null,
      series_book_number: prev?.series_book_number || null,
      amazon_url: merged.covers.length
        ? `https://www.amazon.com/s?k=${encodeURIComponent(merged.title + ' ' + merged.author.split(' ').pop())}&tag=jacketlist-20`
        : (prev?.amazon_url || `https://www.amazon.com/s?k=${encodeURIComponent(merged.title)}&tag=jacketlist-20`),
    });
  }

  // Sort: score desc, tiebreaker desc
  books.sort((a, b) =>
    b.score !== a.score
      ? b.score - a.score
      : b.tiebreaker - a.tiebreaker
  );

  // Take top 25, assign ranks, clean up temp field
  const top25 = books.slice(0, 25).map((book, i) => {
    const { tiebreaker, ...rest } = book;
    return { ...rest, rank: i + 1 };
  });

  const output = { updated: today, books: top25 };

  // Summary
  console.log(`\n📊 Merged ${Object.keys(bookMap).length} unique books from ${activeSources.length} sources`);
  console.log(`\nTop 10:`);
  top25.slice(0, 10).forEach(b => {
    const badge = b.score >= 5 ? '🔥' : b.score >= 3 ? '⬆️' : '👀';
    const flag = b.new_this_week ? ' 🆕' : '';
    console.log(`  ${b.rank}. ${badge} [${b.score}] ${b.title} — ${b.author}${flag}`);
  });

  if (DRY_RUN) {
    console.log('\n[dry-run] Not writing file.');
    return;
  }

  const outPath = `${DATA_DIR}/bestsellers.json`;
  writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');
  console.log(`\n✓ Wrote ${top25.length} books to src/data/bestsellers.json`);
}

try {
  main();
} catch (err) {
  console.error('Failed:', err.message);
  process.exit(1);
}
