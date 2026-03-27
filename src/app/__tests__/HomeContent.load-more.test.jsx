// src/app/__tests__/HomeContent.load-more.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import HomeContent from '../HomeContent';

// Mock child components that have heavy deps
jest.mock('next/link', () => ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>);
jest.mock('@/components/SearchBar', () => ({ value, onChange }) => (
  <input data-testid="search" value={value} onChange={(e) => onChange(e.target.value)} />
));
jest.mock('@/components/BookCard', () => ({ book }) => <div data-testid="book-card">{book.title}</div>);
jest.mock('@/components/SeriesCard', () => ({ series }) => <div data-testid="series-card">{series.title}</div>);
jest.mock('@/utils/scoring', () => ({
  scoreBadge: () => ({ emoji: '👀', label: 'Worth Watching' }),
}));

function makeSeries(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `series-${i}`,
    title: `Series ${i}`,
    author: `Author ${i}`,
    genres: ['Fantasy'],
    total_books: 3,
    description: '',
    orders: { chronological: [], authors_recommended: [] },
  }));
}

const baseProps = {
  books: [],
  alsoTrending: [],
  seriesMap: {},
  updatedDate: '2026-03-27',
};

describe('Popular Series load-more', () => {
  it('shows 12 cards and a Load more button when there are 13 series', () => {
    render(<HomeContent {...baseProps} series={makeSeries(13)} />);
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);
    expect(screen.getByRole('button', { name: /load more series/i })).toBeInTheDocument();
  });

  it('hides Load more button when series count is exactly 12', () => {
    render(<HomeContent {...baseProps} series={makeSeries(12)} />);
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);
    expect(screen.queryByRole('button', { name: /load more series/i })).not.toBeInTheDocument();
  });

  it('reveals 12 more cards on each click', () => {
    render(<HomeContent {...baseProps} series={makeSeries(25)} />);
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);

    fireEvent.click(screen.getByRole('button', { name: /load more series/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(24);

    fireEvent.click(screen.getByRole('button', { name: /load more series/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(25);
    expect(screen.queryByRole('button', { name: /load more series/i })).not.toBeInTheDocument();
  });

  it('resets to 12 cards when genre filter changes', () => {
    const series = makeSeries(25);
    render(<HomeContent {...baseProps} series={series} />);

    fireEvent.click(screen.getByRole('button', { name: /load more series/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(24);

    // Click "All" genre chip to trigger a reset
    fireEvent.click(screen.getByRole('button', { name: /^all$/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);
  });

  it('resets to 12 cards when search query changes', () => {
    render(<HomeContent {...baseProps} series={makeSeries(25)} />);

    fireEvent.click(screen.getByRole('button', { name: /load more series/i }));
    expect(screen.getAllByTestId('series-card')).toHaveLength(24);

    // The series SearchBar is the second search input on the page
    const inputs = screen.getAllByTestId('search');
    fireEvent.change(inputs[1], { target: { value: 'Series' } });
    expect(screen.getAllByTestId('series-card')).toHaveLength(12);
  });
});
