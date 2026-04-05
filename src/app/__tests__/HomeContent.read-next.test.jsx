import { render, screen, fireEvent } from '@testing-library/react';
import HomeContent from '../HomeContent';

jest.mock('next/link', () => ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>);
jest.mock('@/components/SearchBar', () => ({ value, onChange }) => (
  <input data-testid="search" value={value} onChange={(e) => onChange(e.target.value)} />
));
jest.mock('@/components/BookCard', () => ({ book }) => <div data-testid="book-card">{book.title}</div>);
jest.mock('@/components/SeriesCard', () => ({ series }) => <div data-testid="series-card">{series.title}</div>);
jest.mock('@/utils/scoring', () => ({
  scoreBadge: () => ({ emoji: '👀', label: 'Worth Watching' }),
}));

const baseProps = {
  books: [],
  alsoTrending: [],
  series: [],
  seriesMap: {},
  updatedDate: '2026-04-05',
  readNext: [],
};

const readNextBooks = [
  { id: 'rn-1', title: 'Read Next 1', author: 'Author 1', score: 4, added_date: '2026-04-01', sources: [], genres: [], cover_url: '', description: '', amazon_url: '', series_id: null },
  { id: 'rn-2', title: 'Read Next 2', author: 'Author 2', score: 3, added_date: '2026-03-01', sources: [], genres: [], cover_url: '', description: '', amazon_url: '', series_id: null },
];

describe('HomeContent — Read Next teaser', () => {
  it('renders the Read Next section heading', () => {
    render(<HomeContent {...baseProps} readNext={readNextBooks} />);
    expect(screen.getByRole('heading', { name: /read next/i })).toBeInTheDocument();
  });

  it('renders a BookCard for each readNext book', () => {
    render(<HomeContent {...baseProps} readNext={readNextBooks} />);
    const cards = screen.getAllByTestId('book-card');
    expect(cards.length).toBeGreaterThanOrEqual(readNextBooks.length);
  });

  it('renders a "See all recommendations" link to /read-next', () => {
    render(<HomeContent {...baseProps} readNext={readNextBooks} />);
    const link = screen.getByRole('link', { name: /see all recommendations/i });
    expect(link).toHaveAttribute('href', '/read-next');
  });

  it('hides the Read Next section when search query is active', () => {
    render(<HomeContent {...baseProps} readNext={readNextBooks} />);
    fireEvent.change(screen.getByTestId('search'), { target: { value: 'something' } });
    expect(screen.queryByRole('heading', { name: /read next/i })).not.toBeInTheDocument();
  });

  it('renders nothing for Read Next section when readNext is empty', () => {
    render(<HomeContent {...baseProps} readNext={[]} />);
    expect(screen.queryByRole('heading', { name: /^read next$/i })).not.toBeInTheDocument();
  });
});
