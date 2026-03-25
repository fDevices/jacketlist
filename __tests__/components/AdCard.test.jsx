import { render, screen } from '@testing-library/react';
import AdCard from '@/components/AdCard';

describe('AdCard', () => {
  it('renders direct ad with title and CTA', () => {
    const ad = {
      id: 'ad-001',
      type: 'direct',
      title: 'Test Sponsor',
      description: 'A sponsor description.',
      image_url: '/images/test.jpg',
      cta_text: 'Learn more',
      url: 'https://example.com',
      active: true,
    };
    render(<AdCard ad={ad} />);
    expect(screen.getByText('Test Sponsor')).toBeInTheDocument();
    expect(screen.getByText('Sponsored')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render when active is false', () => {
    const ad = { id: 'ad-003', type: 'direct', title: 'Inactive', active: false };
    const { container } = render(<AdCard ad={ad} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders AdSense ins tag for adsense type', () => {
    const ad = { id: 'ad-002', type: 'adsense', slot_id: '0000000000', active: true };
    const { container } = render(<AdCard ad={ad} />);
    expect(screen.getByText('Sponsored')).toBeInTheDocument();
    const ins = container.querySelector('ins.adsbygoogle');
    expect(ins).toBeInTheDocument();
    expect(ins).toHaveAttribute('data-ad-slot', '0000000000');
  });
});
