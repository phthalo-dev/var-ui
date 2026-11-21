import { describe, expect, it, vi } from 'vite-plus/test';
import { appShellMobileBreakpointQueries } from '../src/components/breakpoints';
import { breakpoint, media } from '../src/runtime';
import { designBreakpointConditions } from '../src/tokens/defaults/breakpoint';

describe('appShellMobileBreakpointQueries', () => {
  it('derives exclusive "below" matchMedia conditions from TypeStyles breakpoints', () => {
    expect(appShellMobileBreakpointQueries).toEqual({
      sm: '(width < 40rem)',
      md: '(width < 48rem)',
      lg: '(width < 64rem)',
      none: 'not all',
    });
  });
});

describe('breakpoint()', () => {
  it('partitions the viewport: max excludes the boundary that min includes', () => {
    expect(breakpoint('md', 'min')).toBe('@media (min-width: 48rem)');
    expect(breakpoint('md', 'max')).toBe('@media (width < 48rem)');
    expect(breakpoint('md', 'maxHeight')).toBe('@media (height < 48rem)');
  });

  it('applies to media() blocks too', () => {
    expect(media('lg', 'max', { color: 'red' })).toEqual({
      '@media (width < 64rem)': { color: 'red' },
    });
    expect(media('lg', { color: 'red' })).toEqual({
      '@media (min-width: 64rem)': { color: 'red' },
    });
  });
});

describe('registered breakpoints (#245)', () => {
  it('are explicit (min-width: …) conditions built from the breakpoint tokens', () => {
    expect(designBreakpointConditions).toEqual({
      sm: '(min-width: 40rem)',
      md: '(min-width: 48rem)',
      lg: '(min-width: 64rem)',
      xl: '(min-width: 80rem)',
      xxl: '(min-width: 90rem)',
    });
    expect(breakpoint('md')).toBe('@media (min-width: 48rem)');
    expect(breakpoint('md', 'minHeight')).toBe('@media (min-height: 48rem)');
  });

  it('creating the TypeStyles instance logs no warnings', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.resetModules();
    await import('../src/runtime');
    const breakpointWarnings = warn.mock.calls.filter(([msg]) =>
      String(msg).includes('Breakpoint'),
    );
    warn.mockRestore();
    expect(breakpointWarnings).toEqual([]);
  });
});
