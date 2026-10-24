import { describe, expect, expectTypeOf, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { textBlock, type TextBlockVariantProps } from '../src/components/typography';

describe('textBlock tone', () => {
  it('exposes primary, secondary and danger', () => {
    expectTypeOf<NonNullable<TextBlockVariantProps['tone']>>().toEqualTypeOf<
      'primary' | 'secondary' | 'danger'
    >();
    textBlock({ tone: 'danger' });
    // @ts-expect-error unknown tone
    textBlock({ tone: 'warning' });
  });

  it('colors danger text with the danger foreground token', () => {
    textBlock({ tone: 'danger' });
    const css = getRegisteredCss();
    const rule = /\[data-tone="danger"\][^{]*\{[^}]*\}/.exec(
      css
        .split('}')
        .filter((block) => block.includes('text-block'))
        .join('}\n') + '}',
    );
    expect(rule?.[0]).toMatch(/color:\s*var\(--var-ui-color-tone-danger-foreground/);
  });
});
