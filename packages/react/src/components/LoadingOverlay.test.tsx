import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { LoadingOverlay } from './LoadingOverlay';

describe('LoadingOverlay', () => {
  it('shows a loading status when visible', () => {
    render(
      <LoadingOverlay visible label="Saving">
        <p>Content</p>
      </LoadingOverlay>,
    );
    expect(screen.getByText('Content')).toBeTruthy();
    expect(screen.getByText('Saving')).toBeTruthy();
  });

  it('hides the overlay when not visible', () => {
    render(
      <LoadingOverlay visible={false}>
        <p>Content</p>
      </LoadingOverlay>,
    );
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('marks the root busy and the content inert only while visible', () => {
    const { container, rerender } = render(
      <LoadingOverlay visible data-testid="root">
        <button type="button">Go</button>
      </LoadingOverlay>,
    );
    const root = container.firstElementChild as HTMLElement;
    const content = root.querySelector('[data-loading-overlay-content]') as HTMLElement;
    expect(root.getAttribute('aria-busy')).toBe('true');
    expect(content.hasAttribute('inert')).toBe(true);
    rerender(
      <LoadingOverlay>
        <button type="button">Go</button>
      </LoadingOverlay>,
    );
    expect(root.hasAttribute('aria-busy')).toBe(false);
    expect(content.hasAttribute('inert')).toBe(false);
  });
});
