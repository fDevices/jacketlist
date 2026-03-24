import { scoreBook, scoreBadge } from '@/utils/scoring';

describe('scoreBook', () => {
  it('returns the number of sources', () => {
    expect(scoreBook(['nyt', 'guardian', 'goodreads'])).toBe(3);
    expect(scoreBook(['nyt', 'goodreads'])).toBe(2);
    expect(scoreBook(['nyt'])).toBe(1);
  });
});

describe('scoreBadge', () => {
  it('returns 🔥 Top Pick for score 3', () => {
    expect(scoreBadge(3)).toEqual({ emoji: '🔥', label: 'Top Pick' });
  });
  it('returns ⬆️ Trending for score 2', () => {
    expect(scoreBadge(2)).toEqual({ emoji: '⬆️', label: 'Trending' });
  });
  it('returns 👀 Worth Watching for score 1', () => {
    expect(scoreBadge(1)).toEqual({ emoji: '👀', label: 'Worth Watching' });
  });
});
