import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { RadioGroup } from './RadioGroup';

const options = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

describe('RadioGroup', () => {
  it('applies className to the root element', () => {
    render(<RadioGroup label="Pick" options={options} className="custom" />);
    expect(screen.getByRole('radiogroup', { name: 'Pick' }).className).toContain('custom');
  });
});
