import { buildAmazonSearchLink, buildAmazonAsinLink } from '@/utils/amazonLink';

describe('buildAmazonSearchLink', () => {
  it('encodes title and author into a search URL with affiliate tag', () => {
    const url = buildAmazonSearchLink('The Eye of the World', 'Robert Jordan');
    expect(url).toBe(
      'https://www.amazon.com/s?k=The%20Eye%20of%20the%20World%20Robert%20Jordan&tag=jacketlist-20'
    );
  });

  it('works with title only when author is omitted', () => {
    const url = buildAmazonSearchLink('Dune');
    expect(url).toBe('https://www.amazon.com/s?k=Dune&tag=jacketlist-20');
  });
});

describe('buildAmazonAsinLink', () => {
  it('builds a direct ASIN product URL with affiliate tag', () => {
    const url = buildAmazonAsinLink('0765326353');
    expect(url).toBe('https://www.amazon.com/dp/0765326353?tag=jacketlist-20');
  });
});
