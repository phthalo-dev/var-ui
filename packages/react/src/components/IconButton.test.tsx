import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { IconProvider } from '../icons';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('warns once when the pre-0.7 `name` glyph prop is used without `icon` (#227)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const Legacy = IconButton as unknown as (p: Record<string, unknown>) => React.JSX.Element;
    render(
      <IconProvider icons={{}}>
        <Legacy name="close" aria-label="Close" />
        <Legacy name="close" aria-label="Close again" />
        <IconButton name="submit" icon="close" aria-label="With icon" />
      </IconProvider>,
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('use icon="close"');
    warn.mockRestore();
  });
});
