import { describe, expect, it } from 'vite-plus/test';
import { appShellMobileBreakpointQueries } from '../src/components/breakpoints';
import { breakpoint, media, toExclusiveMaxQuery } from '../src/runtime';

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

  it('rewrites only max features', () => {
    expect(toExclusiveMaxQuery('@media (min-width: 1px) and (max-width: 2rem)')).toBe(
      '@media (min-width: 1px) and (width < 2rem)',
    );
  });
});
