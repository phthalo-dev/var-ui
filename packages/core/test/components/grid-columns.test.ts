import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { grid, gridColumnsStyle } from '../../src/components/grid';

describe('grid columns', () => {
  it('seven gives fixed 7-up tracks', () => {
    grid({ columns: 'seven' });
    const css = getRegisteredCss();
    expect(css).toContain('repeat(7, minmax(0, 1fr))');
  });

  it('gridColumnsStyle emits a base rule and media rules per breakpoint', () => {
    const className = gridColumnsStyle({ base: 2, sm: 3, md: 4, lg: 7 });
    expect(className).toBeTruthy();

    const css = getRegisteredCss();
    const rules = css.split('}').filter((rule) => rule.includes(className!));
    expect(rules.length).toBeGreaterThan(0);

    const all = rules.join('}');
    expect(all).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))');
    expect(all).toContain('repeat(3, minmax(0, 1fr))');
    expect(all).toContain('repeat(4, minmax(0, 1fr))');
    expect(all).toContain('repeat(7, minmax(0, 1fr))');
    // Breakpoint media queries come from the theme breakpoints.
    expect(all).toContain('@media');
  });

  it('gridColumnsStyle is deterministic for the same map', () => {
    expect(gridColumnsStyle({ base: 2, lg: 7 })).toBe(gridColumnsStyle({ base: 2, lg: 7 }));
  });

  it('gridColumnsStyle returns undefined for an empty map', () => {
    expect(gridColumnsStyle({})).toBeUndefined();
  });
});
