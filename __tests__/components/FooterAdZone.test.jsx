import { render, screen } from '@testing-library/react';
import FooterAdZone from '@/components/FooterAdZone';

const ads = [
  { id: 'ad-001', type: 'direct', title: 'Active Ad', description: 'Desc', cta_text: 'Go', url: '#', active: true },
  { id: 'ad-002', type: 'direct', title: 'Inactive Ad', description: 'Desc', cta_text: 'Go', url: '#', active: false },
];

describe('FooterAdZone', () => {
  it('renders the section heading', () => {
    render(<FooterAdZone ads={ads} />);
    expect(screen.getByText('You might also enjoy')).toBeInTheDocument();
  });

  it('renders only active ads', () => {
    render(<FooterAdZone ads={ads} />);
    expect(screen.getByText('Active Ad')).toBeInTheDocument();
    expect(screen.queryByText('Inactive Ad')).not.toBeInTheDocument();
  });
});
