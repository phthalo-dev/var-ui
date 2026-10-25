import { describe, expect, expectTypeOf, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { textBlock, type TextBlockVariantProps } from '../src/components/typography';
import { TONE_KEYS } from '../src/tokens/schema/color/tone';

describe('textBlock tone', () => {
  it('offers primary, secondary and every semantic tone', () => {
    expectTypeOf<NonNullable<TextBlockVariantProps['tone']>>().toEqualTypeOf<
      'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
    >();
    for (const tone of TONE_KEYS) textBlock({ tone });
    // @ts-expect-error unknown tone
    textBlock({ tone: 'neutral' });
  });

  it.each(TONE_KEYS)("colors %s text with that tone's foreground token", (tone) => {
    textBlock({ tone });
    const css = getRegisteredCss();
    const rule = css
      .split('}')
      .find((block) => block.includes('text-block') && block.includes(`data-tone="${tone}"`));
    expect(rule, `no rule for tone ${tone}`).toBeDefined();
    expect(rule).toMatch(new RegExp(`color:\\s*var\\(--var-ui-color-tone-${tone}-foreground`));
  });
});
