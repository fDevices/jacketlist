import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders an input field', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onChange with the new value when user types', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'dune' } });
    expect(onChange).toHaveBeenCalledWith('dune');
  });

  it('displays the controlled value', () => {
    render(<SearchBar value="reacher" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('reacher');
  });
});
