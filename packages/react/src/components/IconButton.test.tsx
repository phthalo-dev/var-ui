import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { IconProvider } from '../icons';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('warns once in development when it renders without an icon', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const Untyped = IconButton as unknown as (p: Record<string, unknown>) => React.JSX.Element;
    render(
      <IconProvider icons={{}}>
        {/* The pre-0.7 `name="close"` is one way to get here; any missing icon is the bug. */}
        <Untyped name="close" aria-label="Close" />
        <Untyped aria-label="Close again" />
        <IconButton icon="close" aria-label="With icon" />
      </IconProvider>,
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('has no `icon`');
    warn.mockRestore();
  });

  it('xl carries the xl glyph (#228)', () => {
    render(
      <IconProvider icons={{ star: <svg data-testid="glyph" /> }}>
        <IconButton icon="star" aria-label="Play" size="xl" pill />
      </IconProvider>,
    );
    const button = screen.getByRole('button', { name: 'Play' });
    expect(button.getAttribute('data-size')).toBe('xl');
    expect(button.hasAttribute('data-pill')).toBe(true);
    expect(screen.getByTestId('glyph').closest('[data-size]')?.getAttribute('data-size')).toBe(
      'xl',
    );
  });
});
