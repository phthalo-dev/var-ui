import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes progressbar semantics with a label and value', () => {
    render(<ProgressBar label="Uploading" value={40} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
  });

  it('renders indeterminate without aria-valuenow', () => {
    render(<ProgressBar label="Working" indeterminate />);
    const bar = screen.getByRole('progressbar', { name: 'Working' });
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
  });
});
