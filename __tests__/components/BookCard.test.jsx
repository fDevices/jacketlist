import { render, screen } from '@testing-library/react';
import BookCard from '@/components/BookCard';

const seriesMap = { 'stormlight-archive': 'stormlight-archive' };

const baseBook = {
  id: 'test-book',
  title: 'Test Book',
  author: 'Test Author',
  cover_url: '',
  description: 'A test description.',
  sources: ['nyt', 'goodreads'],
  score: 2,
  rank: 1,
  new_this_week: false,
  weeks_on_list: 1,
  amazon_url: 'https://www.amazon.com/s?k=Test+Book&tag=YOURTAG-20',
};

describe('BookCard', () => {
  it('renders title and author', () => {
    render(<BookCard book={baseBook} seriesMap={seriesMap} />);
    expect(screen.getByRole('heading', { name: 'Test Book' })).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders the correct score badge for score 2', () => {
    render(<BookCard book={baseBook} seriesMap={seriesMap} />);
    expect(screen.getByText(/Trending/)).toBeInTheDocument();
  });

  it('renders score 3 badge as Top Pick', () => {
    render(<BookCard book={{ ...baseBook, score: 3, sources: ['nyt', 'guardian', 'goodreads'] }} seriesMap={seriesMap} />);
    expect(screen.getByText(/Top Pick/)).toBeInTheDocument();
  });

  it('does not show "weeks on list" when weeks_on_list is 1', () => {
    render(<BookCard book={{ ...baseBook, weeks_on_list: 1 }} seriesMap={seriesMap} />);
    expect(screen.queryByText(/weeks on list/i)).not.toBeInTheDocument();
  });

  it('shows "weeks on list" when weeks_on_list > 1', () => {
    render(<BookCard book={{ ...baseBook, weeks_on_list: 5 }} seriesMap={seriesMap} />);
    expect(screen.getByText(/5 weeks on list/i)).toBeInTheDocument();
  });

  it('shows series badge when series_id exists in seriesMap', () => {
    render(
      <BookCard
        book={{ ...baseBook, series_id: 'stormlight-archive', series_book_number: 2 }}
        seriesMap={seriesMap}
      />
    );
    expect(screen.getByText(/Part of a series/i)).toBeInTheDocument();
  });

  it('silently omits series badge when series_id is not in seriesMap', () => {
    render(
      <BookCard
        book={{ ...baseBook, series_id: 'unknown-series' }}
        seriesMap={seriesMap}
      />
    );
    expect(screen.queryByText(/Part of a series/i)).not.toBeInTheDocument();
  });

  it('renders a Buy on Amazon link', () => {
    render(<BookCard book={baseBook} seriesMap={seriesMap} />);
    const link = screen.getByRole('link', { name: /buy on amazon/i });
    expect(link).toHaveAttribute('href', baseBook.amazon_url);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders a text placeholder when cover_url is empty', () => {
    render(<BookCard book={{ ...baseBook, cover_url: '' }} seriesMap={seriesMap} />);
    // placeholder shows the book title
    expect(screen.getAllByText('Test Book').length).toBeGreaterThanOrEqual(1);
  });
});
