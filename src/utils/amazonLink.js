const AMAZON_TAG = 'YOURTAG-20';

export function buildAmazonSearchLink(title, author = '') {
  const query = encodeURIComponent(`${title} ${author}`.trim());
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`;
}

export function buildAmazonAsinLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}
