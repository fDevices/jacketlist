#!/usr/bin/env node
/**
 * Scrapes Goodreads Most Read This Week (US) and writes to
 * src/data/sources/goodreads.json
 *
 * Usage: node scripts/fetch-goodreads.js
 */

const { writeFileSync } = require('fs');
const { resolve } = require('path');

const AMAZON_TAG = 'jacketlist-20';
const URL = 'https://www.goodreads.com/book/most_read?category=all&country=US&duration=w';

function buildAmazonUrl(title, author) {
  const lastName = author.split(' ').pop();
  const q = encodeURIComponent(`${title} ${lastName}`);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG}`;
}

function upgradeCoverSize(url) {
  // Goodreads thumbnails are _SY75_ or _SX50_ — upgrade to _SY300_ for card display
  return url.replace(/_S[XY]\d+_/, '_SY300_');
}

function parseBooks(html) {
  const books = [];

  // Extract all titles
  const titleRe = /itemprop='name' role='heading' aria-level='4'>([^<]+)<\/span>/g;
  const titles = [];
  let m;
  while ((m = titleRe.exec(html)) !== null) {
    titles.push(m[1].trim());
  }

  // Extract all author names (first per book — inside authorName__container)
  // Each block: <div class='authorName__container'>...<span itemprop="name">Name</span>
  const authorRe = /class='authorName__container'[\s\S]*?itemprop="name">([^<]+)<\/span>/g;
  const authors = [];
  while ((m = authorRe.exec(html)) !== null) {
    // Collapse any internal whitespace (Goodreads sometimes has "Allen  Levi")
    authors.push(m[1].replace(/\s+/g, ' ').trim());
  }

  // Extract cover URLs
  const coverRe = /class="bookCover" itemprop="image" src="([^"]+)"/g;
  const covers = [];
  while ((m = coverRe.exec(html)) !== null) {
    covers.push(upgradeCoverSize(m[1]));
  }

  const count = Math.min(10, titles.length, authors.length);
  for (let i = 0; i < count; i++) {
    books.push({
      position: i + 1,
      title: titles[i],
      author: authors[i] || '',
      cover_url: covers[i] || '',
      amazon_url: buildAmazonUrl(titles[i], authors[i] || ''),
    });
  }

  return books;
}

async function main() {
  console.log('Fetching Goodreads Most Read This Week (US)...');

  const res = await fetch(URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!res.ok) {
    throw new Error(`Goodreads fetch failed: ${res.status}`);
  }

  const html = await res.text();
  const books = parseBooks(html);

  if (books.length < 5) {
    throw new Error(`Only parsed ${books.length} books — page structure may have changed`);
  }

  const today = new Date().toISOString().split('T')[0];

  const output = {
    source: 'goodreads',
    label: 'Goodreads Most Read',
    url: 'https://www.goodreads.com/book/most_read',
    updated: today,
    books,
  };

  const outPath = resolve(__dirname, '../src/data/sources/goodreads.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');

  console.log(`✓ Wrote ${books.length} books to src/data/sources/goodreads.json`);
  books.forEach(b => console.log(`  ${b.position}. ${b.title} — ${b.author}`));
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
