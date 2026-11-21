import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { grid, gridColumnsVars } from '../../src/components/grid';
import { recipeVars } from '../../src/components/styleVars';

const stops = recipeVars(grid).columns;

describe('grid columns', () => {
  it('seven gives fixed 7-up tracks', () => {
    grid({ columns: 'seven' });
    const css = getRegisteredCss();
    expect(css).toContain('repeat(7, minmax(0, 1fr))');
  });

  it('gridColumnsVars sets one track variable per stop in the map', () => {
    expect(gridColumnsVars({ base: 2, md: 4, lg: 7 })).toEqual({
      [stops.base.name]: 'repeat(2, minmax(0, 1fr))',
      [stops.md.name]: 'repeat(4, minmax(0, 1fr))',
      [stops.lg.name]: 'repeat(7, minmax(0, 1fr))',
    });
    expect(gridColumnsVars({})).toBeUndefined();
    expect(() => gridColumnsVars({ md: 0 })).toThrow(/positive integer/);
  });

  it('the fixed variant is static CSS: each breakpoint falls back to the nearest smaller stop (#196)', () => {
    grid({ columns: 'fixed' });
    const css = getRegisteredCss();
    const [base, sm, md] = [stops.base.name, stops.sm.name, stops.md.name];
    // Mobile-first: below sm only base applies, else the auto-fill template.
    expect(css).toMatch(new RegExp(`grid-template-columns: var\\(${base}, repeat\\(auto-fill`));
    // At md: md, then sm, then base, then auto.
    expect(css).toContain(`var(${md}, var(${sm}, var(${base}, repeat(auto-fill`);
    expect(css).toContain('@media (min-width: 48rem)');
    // `inheritOverride`: no stop is declared on the grid, so an unset one stays unset.
    for (const name of [base, sm, md]) expect(css).not.toContain(`${name}: none`);
  });
});
