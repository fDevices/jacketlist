import { render, screen, fireEvent } from '@testing-library/react';
import AdaptationsContent from '@/app/adaptations/AdaptationsContent';

const adaptations = [
  {
    id: 'gone-girl',
    book_title: 'Gone Girl',
    author: 'Gillian Flynn',
    adaptation_title: 'Gone Girl (2014)',
    type: 'movie',
    genres: ['Thriller', 'Mystery'],
    hook: 'A great thriller.',
    cover_url: '',
    amazon_url: 'https://www.amazon.com/s?k=Gone+Girl&tag=jacketlist-20',
    series_id: null,
  },
  {
    id: 'the-witcher',
    book_title: 'The Witcher',
    author: 'Andrzej Sapkowski',
    adaptation_title: 'The Witcher (Netflix)',
    type: 'tv',
    genres: ['Fantasy'],
    hook: 'A rich world.',
    cover_url: '',
    amazon_url: 'https://www.amazon.com/s?k=Witcher&tag=jacketlist-20',
    series_id: 'the-witcher',
  },
  {
    id: 'game-of-thrones',
    book_title: 'A Song of Ice and Fire',
    author: 'George R.R. Martin',
    adaptation_title: 'Game of Thrones (HBO)',
    type: 'tv',
    genres: ['Fantasy'],
    hook: 'The show ended.',
    cover_url: '',
    amazon_url: 'https://www.amazon.com/s?k=ASOIAF&tag=jacketlist-20',
    series_id: 'a-song-of-ice-and-fire',
  },
];

describe('AdaptationsContent', () => {
  it('renders all adaptations by default', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    expect(screen.getAllByText('Gone Girl')).toHaveLength(2); // title + cover fallback
    expect(screen.getAllByText('The Witcher')).toHaveLength(2);
    expect(screen.getAllByText('A Song of Ice and Fire')).toHaveLength(2);
  });

  it('filters to movies only when Movie pill is clicked', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'Movie' }));
    expect(screen.getAllByText('Gone Girl')).toHaveLength(2); // title + cover fallback
    expect(screen.queryByText('The Witcher')).not.toBeInTheDocument();
  });

  it('filters to TV only when TV Series pill is clicked', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'TV Series' }));
    expect(screen.queryByText('Gone Girl')).not.toBeInTheDocument();
    expect(screen.getAllByText('The Witcher')).toHaveLength(2);
  });

  it('filters by genre pill', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fantasy' }));
    expect(screen.queryByText('Gone Girl')).not.toBeInTheDocument();
    expect(screen.getAllByText('The Witcher')).toHaveLength(2);
    expect(screen.getAllByText('A Song of Ice and Fire')).toHaveLength(2);
  });

  it('ANDs type and genre filters', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'TV Series' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fantasy' }));
    expect(screen.queryByText('Gone Girl')).not.toBeInTheDocument();
    expect(screen.getAllByText('The Witcher')).toHaveLength(2);
    expect(screen.getAllByText('A Song of Ice and Fire')).toHaveLength(2);
  });

  it('shows empty state when no results match', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'Movie' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fantasy' }));
    expect(screen.getByText('No results for these filters.')).toBeInTheDocument();
  });

  it('resets to all when All type pill is clicked', () => {
    render(<AdaptationsContent allAdaptations={adaptations} />);
    fireEvent.click(screen.getByRole('button', { name: 'Movie' }));
    fireEvent.click(screen.getByRole('button', { name: /^All$/ }));
    expect(screen.getAllByText('Gone Girl')).toHaveLength(2);
    expect(screen.getAllByText('The Witcher')).toHaveLength(2);
  });
});
