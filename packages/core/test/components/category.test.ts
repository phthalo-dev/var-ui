import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { badge } from '../../src/components/badge';
import { statusDot } from '../../src/components/statusDot';

describe('category axis (#144)', () => {
  it('paints Badge and StatusDot with the categorical hue, and is off by default', () => {
    const b = badge({ category: '3' });
    statusDot({ category: '3' });
    expect(JSON.stringify(b)).toContain('"data-category":"3"');
    expect(JSON.stringify(badge({}))).not.toContain('data-category":"3');
    const css = getRegisteredCss();
    expect(css).toContain('var(--var-ui-color-categorical-3)');
  });
});
