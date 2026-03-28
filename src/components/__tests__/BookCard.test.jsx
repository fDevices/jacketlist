import { render, screen } from '@testing-library/react';
import BookCard from '@/components/BookCard';

jest.mock('next/link', () => ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>);
jest.mock('@/components/SourceBadge', () => ({ source }) => <span data-testid="source-badge">{source}</span>);

const mockScoreBadge = jest.fn(() => ({ emoji: '🔥', label: 'Top Pick' }));
const mockEditorialLabels = jest.fn(() => []);

jest.mock('@/utils/scoring', () => ({
  scoreBadge: (...args) => mockScoreBadge(...args),
  editorialLabels: (...args) => mockEditorialLabels(...args),
}));

function makeBook(overrides = {}) {
  return {
    id: 'test-book',
    title: 'Test Book',
    author: 'Test Author',
    score: 7,
    sources: ['nyt', 'amazon'],
    sources_positions: [],
    weeks_on_list: 1,
    new_this_week: false,
    cover_url: null,
    description: 'A test book.',
    amazon_url: 'https://amazon.com/test',
    series_id: null,
    ...overrides,
  };
}

beforeEach(() => {
  mockScoreBadge.mockReturnValue({ emoji: '🔥', label: 'Top Pick' });
  mockEditorialLabels.mockReturnValue([]);
});

describe('BookCard score badge', () => {
  it('shows emoji, label, and source count', () => {
    render(<BookCard book={makeBook({ score: 7 })} seriesMap={{}} />);
    expect(screen.getByText('🔥 Top Pick · 7/7 lists')).toBeInTheDocument();
  });

  it('shows correct count for score 3', () => {
    mockScoreBadge.mockReturnValue({ emoji: '⬆️', label: 'Trending' });
    render(<BookCard book={makeBook({ score: 3 })} seriesMap={{}} />);
    expect(screen.getByText('⬆️ Trending · 3/7 lists')).toBeInTheDocument();
  });

  it('does not show score badge when showScore is false', () => {
    render(<BookCard book={makeBook({ score: 7 })} seriesMap={{}} showScore={false} />);
    expect(screen.queryByText(/7\/7 lists/)).not.toBeInTheDocument();
  });
});

describe('BookCard editorial labels', () => {
  it('renders editorial chip when editorialLabels returns a label', () => {
    mockEditorialLabels.mockReturnValue(['New This Week']);
    render(<BookCard book={makeBook()} seriesMap={{}} />);
    expect(screen.getByText('New This Week')).toBeInTheDocument();
  });

  it('renders multiple chips when editorialLabels returns multiple labels', () => {
    mockEditorialLabels.mockReturnValue(['Top Consensus', 'Rising Fast']);
    render(<BookCard book={makeBook()} seriesMap={{}} />);
    expect(screen.getByText('Top Consensus')).toBeInTheDocument();
    expect(screen.getByText('Rising Fast')).toBeInTheDocument();
  });

  it('renders no chips when editorialLabels returns empty array', () => {
    mockEditorialLabels.mockReturnValue([]);
    render(<BookCard book={makeBook()} seriesMap={{}} />);
    expect(screen.queryByText('New This Week')).not.toBeInTheDocument();
    expect(screen.queryByText('Top Consensus')).not.toBeInTheDocument();
  });

  it('does not render chips when showScore is false', () => {
    mockEditorialLabels.mockReturnValue(['New This Week']);
    render(<BookCard book={makeBook()} seriesMap={{}} showScore={false} />);
    expect(screen.queryByText('New This Week')).not.toBeInTheDocument();
  });
});
