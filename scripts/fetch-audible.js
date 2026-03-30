#!/usr/bin/env node
/**
 * Scrapes Audible Bestsellers chart (top 10) and writes to
 * src/data/sources/audible.json
 *
 * Usage: node scripts/fetch-audible.js
 */

const { writeFileSync } = require('fs');
const { resolve } = require('path');
const { execSync } = require('child_process');

const AMAZON_TAG = 'jacketlist-20';
const URL = 'https://www.audible.com/charts/best';

function buildAmazonUrl(title, author) {
  const lastName = author.split(' ').pop();
  const q = encodeURIComponent(`${title} ${lastName}`);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG}`;
}

function parseBooks(html) {
  // Titles: from cover image alt text — format is "Title  By  cover art"
  // This preserves apostrophes and special characters the URL slug loses
  const titleRe = /alt="([^"]+?) +By +[^"]*cover art"/g;
  const titles = [];
  let m;
  while ((m = titleRe.exec(html)) !== null) {
    titles.push(m[1].trim().replace(/ Audiobook$/i, ''));
  }

  // Authors: inside authorLabel spans
  const authorRe = /authorLabel"[^>]*>[\s\S]*?bc-color-link"[^>]*>([^<]+)<\/a>/g;
  const authors = [];
  while ((m = authorRe.exec(html)) !== null) {
    authors.push(m[1].trim());
  }

  // Covers: bc-image-inset-border src attributes
  const coverRe = /bc-image-inset-border js-only-element" src="([^"]+)"/g;
  const covers = [];
  while ((m = coverRe.exec(html)) !== null) {
    covers.push(m[1]);
  }

  const count = Math.min(10, titles.length, authors.length);
  const books = [];
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

function main() {
  console.log('Fetching Audible Bestsellers...');

  // Use curl — Node.js fetch gets a stripped page, curl gets the full server-rendered HTML
  let html;
  try {
    html = execSync(
      `curl -s -L "${URL}" -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: en-US,en;q=0.9"`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
  } catch (err) {
    throw new Error(`curl failed: ${err.message}`);
  }

  if (!html || html.length < 10000) {
    throw new Error(`Audible response too short (${html?.length} bytes) — possible block`);
  }
  const books = parseBooks(html);

  if (books.length < 5) {
    throw new Error(`Only parsed ${books.length} books — page structure may have changed`);
  }

  const today = new Date().toISOString().split('T')[0];

  const output = {
    source: 'audible',
    label: 'Audible Best Sellers',
    url: 'https://www.audible.com/charts/best',
    updated: today,
    books,
  };

  const outPath = resolve(__dirname, '../src/data/sources/audible.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');

  console.log(`✓ Wrote ${books.length} books to src/data/sources/audible.json`);
  books.forEach(b => console.log(`  ${b.position}. ${b.title} — ${b.author}`));
}

try {
  main();
} catch (err) {
  console.error('Failed:', err.message);
  process.exit(1);
}
