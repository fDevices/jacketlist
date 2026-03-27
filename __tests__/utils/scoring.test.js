import { scoreBook, scoreBadge, computeTiebreaker } from '@/utils/scoring';

describe('scoreBook', () => {
  it('returns the number of sources', () => {
    expect(scoreBook(['nyt', 'guardian', 'goodreads'])).toBe(3);
    expect(scoreBook(['nyt', 'goodreads'])).toBe(2);
    expect(scoreBook(['nyt'])).toBe(1);
  });
});

describe('scoreBadge', () => {
  it('returns 🔥 Top Pick for scores 5–7', () => {
    expect(scoreBadge(7)).toEqual({ emoji: '🔥', label: 'Top Pick' });
    expect(scoreBadge(6)).toEqual({ emoji: '🔥', label: 'Top Pick' });
    expect(scoreBadge(5)).toEqual({ emoji: '🔥', label: 'Top Pick' });
  });
  it('returns ⬆️ Trending for scores 3–4', () => {
    expect(scoreBadge(4)).toEqual({ emoji: '⬆️', label: 'Trending' });
    expect(scoreBadge(3)).toEqual({ emoji: '⬆️', label: 'Trending' });
  });
  it('returns 👀 Worth Watching for scores 1–2', () => {
    expect(scoreBadge(2)).toEqual({ emoji: '👀', label: 'Worth Watching' });
    expect(scoreBadge(1)).toEqual({ emoji: '👀', label: 'Worth Watching' });
  });
});

describe('computeTiebreaker', () => {
  it('averages position_score and longevity_score', () => {
    const book = {
      sources_positions: [{ source: 'nyt', position: 1 }],
      weeks_on_list: 1,
    };
    // position_score = 11 - 1 = 10, longevity_score = min(1,10) = 1
    // tiebreaker = (10 + 1) / 2 = 5.5
    expect(computeTiebreaker(book)).toBe(5.5);
  });

  it('averages position across multiple sources', () => {
    const book = {
      sources_positions: [
        { source: 'nyt', position: 1 },
        { source: 'amazon', position: 3 },
      ],
      weeks_on_list: 10,
    };
    // avg_position = (1+3)/2 = 2, position_score = 11-2 = 9
    // longevity_score = min(10,10) = 10
    // tiebreaker = (9 + 10) / 2 = 9.5
    expect(computeTiebreaker(book)).toBe(9.5);
  });

  it('caps weeks_on_list at 10', () => {
    const book = {
      sources_positions: [{ source: 'nyt', position: 5 }],
      weeks_on_list: 52,
    };
    // position_score = 11-5 = 6, longevity_score = min(52,10) = 10
    // tiebreaker = (6 + 10) / 2 = 8
    expect(computeTiebreaker(book)).toBe(8);
  });
});
