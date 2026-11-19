import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { scrollFade } from '../../src/components/scrollFade';

describe('scroll fade direction', () => {
  it('flips the mask in RTL, where the inline start is on the right', () => {
    scrollFade();
    const css = getRegisteredCss();
    const rtl = css.split('}').find((rule) => rule.includes('var-ui-scroll-fade:dir(rtl)'));
    expect(rtl).toContain('linear-gradient(to left');
  });
});
