import { describe, expect, it } from 'vite-plus/test';
import { formatCssVarName, getShadowSwatches, groupShadowSwatches } from './shadow-tokens';

describe('shadow-tokens', () => {
  it('builds swatches for the shadow scale', () => {
    const swatches = getShadowSwatches();
    expect(swatches).toHaveLength(5);

    const md = swatches.find((swatch) => swatch.token === 'shadow.md');
    expect(md).toMatchObject({
      group: 'box',
      cssVar: 'var(--var-ui-shadow-md)',
    });
    expect(md?.defaultValue).toContain('2px 4px 4px');
  });

  it('groups swatches under box', () => {
    const groups = groupShadowSwatches(getShadowSwatches());
    expect(groups.get('box')).toHaveLength(5);
  });

  it('formats css var names for display', () => {
    expect(formatCssVarName('var(--var-ui-shadow-md)')).toBe('--var-ui-shadow-md');
  });
});
