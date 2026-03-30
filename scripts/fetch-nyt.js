#!/usr/bin/env node
/**
 * Fetches NYT Combined Print & E-Book Fiction + Nonfiction bestseller lists
 * and writes to src/data/sources/nyt.json
 *
 * Usage:
 *   NYT_API_KEY=your_key node scripts/fetch-nyt.js
 *   -- or --
 *   node scripts/fetch-nyt.js your_key
 */

const { writeFileSync, existsSync, readFileSync } = require('fs');
const { resolve } = require('path');

// Load .env.local if present
const envPath = resolve(__dirname, '../.env.local');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  });
}

const API_KEY = process.env.NYT_API_KEY || process.argv[2];
const AMAZON_TAG = 'jacketlist-20';

if (!API_KEY) {
  console.error('Error: NYT_API_KEY not set.\nUsage: NYT_API_KEY=your_key node scripts/fetch-nyt.js');
  process.exit(1);
}

const NYT_LISTS = [
  'combined-print-and-e-book-fiction',
  'combined-print-and-e-book-nonfiction',
];

async function fetchList(listName) {
  const url = `https://api.nytimes.com/svc/books/v3/lists/current/${listName}.json?api-key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`NYT API error ${res.status} for "${listName}": ${await res.text()}`);
  }
  const data = await res.json();
  return data.results;
}

function buildAmazonUrl(title, author) {
  const lastName = author.split(' ').pop();
  const q = encodeURIComponent(`${title} ${lastName}`);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG}`;
}

function formatBook(nytBook, position) {
  return {
    position,
    title: nytBook.title,
    author: nytBook.author,
    cover_url: nytBook.book_image || '',
    amazon_url: buildAmazonUrl(nytBook.title, nytBook.author),
  };
}

async function main() {
  console.log('Fetching NYT bestseller lists...');

  const [fiction, nonfiction] = await Promise.all(NYT_LISTS.map(fetchList));

  const fictionTop5 = fiction.books.slice(0, 5);
  const nonfictionTop5 = nonfiction.books.slice(0, 5);

  // Interleave: fiction #1, nonfiction #1, fiction #2, nonfiction #2 ...
  const merged = [];
  for (let i = 0; i < 5; i++) {
    merged.push(formatBook(fictionTop5[i], merged.length + 1));
    merged.push(formatBook(nonfictionTop5[i], merged.length + 1));
  }

  const today = new Date().toISOString().split('T')[0];

  const output = {
    source: 'nyt',
    label: 'NYT Best Sellers',
    url: 'https://www.nytimes.com/books/best-sellers/',
    updated: today,
    books: merged,
  };

  const outPath = resolve(__dirname, '../src/data/sources/nyt.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');

  console.log(`✓ Wrote ${merged.length} books to src/data/sources/nyt.json`);
  console.log(`  Fiction list date:    ${fiction.bestsellers_date}`);
  console.log(`  Nonfiction list date: ${nonfiction.bestsellers_date}`);
  console.log('\nTop 5 fiction:');
  fictionTop5.forEach((b, i) => console.log(`  ${i + 1}. ${b.title} — ${b.author}`));
  console.log('\nTop 5 nonfiction:');
  nonfictionTop5.forEach((b, i) => console.log(`  ${i + 1}. ${b.title} — ${b.author}`));
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
