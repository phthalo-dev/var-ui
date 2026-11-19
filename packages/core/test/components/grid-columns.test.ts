import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { grid, gridColumnTracksVar, gridColumnsVars } from '../../src/components/grid';

describe('grid columns', () => {
  it('seven gives fixed 7-up tracks', () => {
    grid({ columns: 'seven' });
    const css = getRegisteredCss();
    expect(css).toContain('repeat(7, minmax(0, 1fr))');
  });

  it('gridColumnsVars sets one track variable per stop in the map', () => {
    expect(gridColumnsVars({ base: 2, md: 4, lg: 7 })).toEqual({
      '--var-ui-grid-columns-base': 'repeat(2, minmax(0, 1fr))',
      '--var-ui-grid-columns-md': 'repeat(4, minmax(0, 1fr))',
      '--var-ui-grid-columns-lg': 'repeat(7, minmax(0, 1fr))',
    });
    expect(gridColumnsVars({})).toBeUndefined();
    expect(() => gridColumnsVars({ md: 0 })).toThrow(/positive integer/);
  });

  it('the fixed variant is static CSS: each breakpoint falls back to the nearest smaller stop (#196)', () => {
    grid({ columns: 'fixed' });
    const css = getRegisteredCss();
    const { base, sm, md } = gridColumnTracksVar;
    // Mobile-first: below sm only base applies, else the auto-fill template.
    expect(css).toMatch(new RegExp(`grid-template-columns: var\\(${base}, repeat\\(auto-fill`));
    // At md: md, then sm, then base, then auto.
    expect(css).toContain(`var(${md}, var(${sm}, var(${base}, repeat(auto-fill`);
    expect(css).toContain('@media (min-width: 48rem)');
  });
});
