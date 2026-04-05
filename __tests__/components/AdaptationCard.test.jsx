import { render, screen } from '@testing-library/react';
import AdaptationCard from '@/components/AdaptationCard';

const baseAdaptation = {
  id: 'gone-girl',
  book_title: 'Gone Girl',
  author: 'Gillian Flynn',
  adaptation_title: 'Gone Girl (2014)',
  type: 'movie',
  genres: ['Thriller', 'Mystery'],
  hook: "If the film's unreliable narrators gripped you, the book cuts even deeper.",
  cover_url: '',
  amazon_url: 'https://www.amazon.com/s?k=Gone+Girl&tag=jacketlist-20',
  series_id: null,
};

const tvAdaptation = {
  ...baseAdaptation,
  id: 'the-witcher',
  book_title: 'The Witcher',
  author: 'Andrzej Sapkowski',
  adaptation_title: 'The Witcher (Netflix)',
  type: 'tv',
  genres: ['Fantasy'],
  hook: "The show barely scratches the surface of Sapkowski's richly built world.",
  series_id: 'the-witcher',
};

describe('AdaptationCard', () => {
  it('renders book title and author', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getByRole('heading', { name: 'Gone Girl' })).toBeInTheDocument();
    expect(screen.getByText('Gillian Flynn')).toBeInTheDocument();
  });

  it('renders the adaptation title', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getByText('Gone Girl (2014)')).toBeInTheDocument();
  });

  it('renders the hook text', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getByText(baseAdaptation.hook)).toBeInTheDocument();
  });

  it('shows 🎬 Movie badge for type "movie"', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.getByText('🎬 Movie')).toBeInTheDocument();
  });

  it('shows 📺 TV Series badge for type "tv"', () => {
    render(<AdaptationCard adaptation={tvAdaptation} />);
    expect(screen.getByText('📺 TV Series')).toBeInTheDocument();
  });

  it('shows "📚 Full series →" link when series_id is set', () => {
    render(<AdaptationCard adaptation={tvAdaptation} />);
    const link = screen.getByRole('link', { name: /Full series/i });
    expect(link).toHaveAttribute('href', '/series/the-witcher');
  });

  it('omits series link when series_id is null', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    expect(screen.queryByRole('link', { name: /Full series/i })).not.toBeInTheDocument();
  });

  it('renders a Buy on Amazon link that opens in a new tab', () => {
    render(<AdaptationCard adaptation={baseAdaptation} />);
    const link = screen.getByRole('link', { name: /buy on amazon/i });
    expect(link).toHaveAttribute('href', baseAdaptation.amazon_url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a text placeholder when cover_url is empty', () => {
    render(<AdaptationCard adaptation={{ ...baseAdaptation, cover_url: '' }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Gone Girl', { selector: 'span' })).toBeInTheDocument();
  });
});
