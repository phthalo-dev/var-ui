import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description, and action', () => {
    render(
      <EmptyState
        title="No results"
        description="Try a different filter."
        action={<button>Clear filters</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'No results' })).toBeTruthy();
    expect(screen.getByText('Try a different filter.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeTruthy();
  });

  it('omits the icon well when no icon is given', () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector('.var-ui-empty-state__icon')).toBeNull();
  });
});
