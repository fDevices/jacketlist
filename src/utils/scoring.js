export function scoreBook(sources) {
  return sources.length;
}

export function scoreBadge(score) {
  if (score >= 5) return { emoji: '🔥', label: 'Top Pick' };
  if (score >= 3) return { emoji: '⬆️', label: 'Trending' };
  return { emoji: '👀', label: 'Worth Watching' };
}

export function computeTiebreaker(book) {
  if (!book.sources_positions || book.sources_positions.length === 0) return 0;
  const positions = book.sources_positions.map((sp) => sp.position);
  const avgPosition = positions.reduce((a, b) => a + b, 0) / positions.length;
  const positionScore = 11 - avgPosition;
  const longevityScore = Math.min(book.weeks_on_list, 10);
  return (positionScore + longevityScore) / 2;
}
