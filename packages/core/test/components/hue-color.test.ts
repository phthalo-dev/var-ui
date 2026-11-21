import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { badge } from '../../src/components/badge';
import { statusDot } from '../../src/components/statusDot';

describe('color axis (#144)', () => {
  it('paints Badge and StatusDot with the named hue, and is off by default', () => {
    expect(JSON.stringify(badge({ color: 'violet' }))).toContain('"data-color":"violet"');
    statusDot({ color: 'sage' });
    expect(JSON.stringify(badge({}))).not.toContain('"data-color":"violet"');
    const css = getRegisteredCss();
    expect(css).toContain('var(--var-ui-color-hue-violet)');
    expect(css).toContain('var(--var-ui-color-hue-sage)');
  });
});
