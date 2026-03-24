export function scoreBook(sources) {
  return sources.length;
}

export function scoreBadge(score) {
  if (score === 3) return { emoji: '🔥', label: 'Top Pick' };
  if (score === 2) return { emoji: '⬆️', label: 'Trending' };
  return { emoji: '👀', label: 'Worth Watching' };
}
