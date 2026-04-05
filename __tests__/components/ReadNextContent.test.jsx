import { render, screen, fireEvent } from '@testing-library/react';
import ReadNextContent from '@/app/read-next/ReadNextContent';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-04-15'));
});
afterEach(() => {
  jest.useRealTimers();
});

const books = [
  {
    id: 'book-a',
    title: 'Book A',
    author: 'Author A',
    cover_url: '',
    description: 'Desc A',
    genres: ['Literary Fiction'],
    sources: ['nyt', 'guardian'],
    score: 4,
    added_date: '2026-04-01',
    amazon_url: 'https://www.amazon.com/s?k=Book+A&tag=jacketlist-20',
    series_id: null,
  },
  {
    id: 'book-b',
    title: 'Book B',
    author: 'Author B',
    cover_url: '',
    description: 'Desc B',
    genres: ['Thriller'],
    sources: ['book-riot'],
    score: 2,
    added_date: '2026-03-01',
    amazon_url: 'https://www.amazon.com/s?k=Book+B&tag=jacketlist-20',
    series_id: null,
  },
  {
    id: 'book-c',
    title: 'Book C',
    author: 'Author C',
    cover_url: '',
    description: 'Desc C',
    genres: ['Literary Fiction', 'Thriller'],
    sources: ['nyt'],
    score: 3,
    added_date: '2026-03-15',
    amazon_url: 'https://www.amazon.com/s?k=Book+C&tag=jacketlist-20',
    series_id: null,
  },
];

describe('ReadNextContent', () => {
  it('renders all books by default', () => {
    render(<ReadNextContent allBooks={books} seriesMap={{}} />);
    expect(screen.getAllByText('Book A')).toHaveLength(2); // title + cover fallback
    expect(screen.getAllByText('Book B')).toHaveLength(2);
    expect(screen.getAllByText('Book C')).toHaveLength(2);
  });

  it('filters by genre pill', () => {
    render(<ReadNextContent allBooks={books} seriesMap={{}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Thriller' }));
    expect(screen.queryByText('Book A')).not.toBeInTheDocument();
    expect(screen.getAllByText('Book B')).toHaveLength(2);
    expect(screen.getAllByText('Book C')).toHaveLength(2);
  });

  it('genre filter resets to all when All pill is clicked', () => {
    render(<ReadNextContent allBooks={books} seriesMap={{}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Thriller' }));
    const buttons = screen.getAllByRole('button', { name: /^All$/ });
    fireEvent.click(buttons[0]); // First "All" button
    expect(screen.getAllByText('Book A')).toHaveLength(2);
    expect(screen.getAllByText('Book B')).toHaveLength(2);
    expect(screen.getAllByText('Book C')).toHaveLength(2);
  });

  it('filters to new-this-month books when toggle is active', () => {
    render(<ReadNextContent allBooks={books} seriesMap={{}} />);
    fireEvent.click(screen.getByRole('button', { name: /new this month/i }));
    expect(screen.getAllByText('Book A')).toHaveLength(2);
    expect(screen.queryByText('Book B')).not.toBeInTheDocument();
    expect(screen.queryByText('Book C')).not.toBeInTheDocument();
  });

  it('ANDs genre and new-this-month filters', () => {
    render(<ReadNextContent allBooks={books} seriesMap={{}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Thriller' }));
    fireEvent.click(screen.getByRole('button', { name: /new this month/i }));
    expect(screen.queryByText('Book A')).not.toBeInTheDocument();
    expect(screen.queryByText('Book B')).not.toBeInTheDocument();
    expect(screen.queryByText('Book C')).not.toBeInTheDocument();
    expect(screen.getByText('No results for these filters.')).toBeInTheDocument();
  });

  it('shows empty state when no books match filters', () => {
    render(<ReadNextContent allBooks={books} seriesMap={{}} />);
    fireEvent.click(screen.getByRole('button', { name: /new this month/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Thriller' }));
    expect(screen.getByText('No results for these filters.')).toBeInTheDocument();
  });

  it('genre pills are derived from books and sorted alphabetically', () => {
    render(<ReadNextContent allBooks={books} seriesMap={{}} />);
    const buttons = screen.getAllByRole('button');
    const genreButtons = buttons.filter(b => !b.textContent.match(/all|new this month/i));
    const labels = genreButtons.map(b => b.textContent);
    expect(labels).toEqual([...labels].sort());
  });
});
