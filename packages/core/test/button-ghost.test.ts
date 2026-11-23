import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { button } from '../src/components/button';
import { neutralHoverChip } from '../src/shared/semanticTone';

describe('button ghost hover', () => {
  it('uses the nav chip only for neutral ghost, as a compound variant', () => {
    void button({ tone: 'neutral', appearance: 'ghost' });
    const css = getRegisteredCss();
    expect(css).not.toContain('ghosthover');
    // Compound rule: neutral AND ghost, hover fill is the warm chip.
    const compound = css
      .split('}')
      .find(
        (rule) =>
          /data-tone="neutral"/.test(rule) &&
          /data-appearance="ghost"/.test(rule) &&
          rule.includes(neutralHoverChip),
      );
    expect(compound).toBeDefined();
    expect(compound).toContain(':hover');
  });
});
