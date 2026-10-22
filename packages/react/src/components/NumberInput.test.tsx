import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('renders the label and description', () => {
    render(<NumberInput label="Quantity" description="In units" />);
    expect(screen.getByText('Quantity')).toBeTruthy();
    expect(screen.getByText('In units')).toBeTruthy();
  });

  it('passes its size down to the input', () => {
    render(<NumberInput label="Quantity" size="lg" />);
    expect(screen.getByRole('textbox').getAttribute('data-size')).toBe('lg');
  });

  it('uses the recipe default size when none is given', () => {
    render(<NumberInput label="Quantity" />);
    expect(screen.getByRole('textbox').getAttribute('data-size')).toBe('md');
  });
});
