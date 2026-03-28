import { render, screen } from '@testing-library/react';
import SeriesCard from '@/components/SeriesCard';

const recentDate = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  return d.toISOString().slice(0, 10);
})();

const oldDate = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 8);
  return d.toISOString().slice(0, 10);
})();

const baseSeries = {
  id: 'test-series',
  title: 'Test Series',
  author: 'Test Author',
  genres: ['Fantasy'],
  total_books: 3,
};

describe('SeriesCard', () => {
  it('renders title and author', () => {
    render(<SeriesCard series={baseSeries} />);
    expect(screen.getByText('Test Series')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('shows ✨ New chip when latest_book is recent', () => {
    render(
      <SeriesCard
        series={{ ...baseSeries, latest_book: { title: 'New Book', release_date: recentDate } }}
      />
    );
    expect(screen.getByText('✨ New')).toBeInTheDocument();
  });

  it('does not show ✨ New chip when latest_book is old', () => {
    render(
      <SeriesCard
        series={{ ...baseSeries, latest_book: { title: 'Old Book', release_date: oldDate } }}
      />
    );
    expect(screen.queryByText('✨ New')).not.toBeInTheDocument();
  });

  it('does not show ✨ New chip when latest_book is absent', () => {
    render(<SeriesCard series={baseSeries} />);
    expect(screen.queryByText('✨ New')).not.toBeInTheDocument();
  });
});
