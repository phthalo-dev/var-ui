import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { textBlock } from '../src/components/typography';

/** CSS block for `data-{axis}` on the text-block recipe (boolean variants drop the value). */
function rule(matcher: string): string {
  const css = getRegisteredCss();
  return (
    css.split('}').find((block) => block.includes('text-block') && block.includes(matcher)) ?? ''
  );
}

describe('textBlock extensions', () => {
  it('xl size maps to the xl font-size token', () => {
    textBlock({ size: 'xl' });
    expect(rule('data-size="xl"')).toMatch(/font-size:\s*var\(--var-ui-fontSize-xl/);
  });

  it('bold weight maps to the bold token', () => {
    textBlock({ weight: 'bold' });
    expect(rule('data-weight="bold"')).toMatch(/font-weight:\s*var\(--var-ui-fontWeight-bold/);
  });

  it('eyebrow uppercases with tracking', () => {
    textBlock({ eyebrow: true });
    const css = rule('data-eyebrow');
    expect(css).toContain('text-transform: uppercase');
    expect(css).toContain('letter-spacing: 0.08em');
  });

  it('pre-wrap keeps whitespace', () => {
    textBlock({ whiteSpace: 'pre-wrap' });
    expect(rule('data-white-space="pre-wrap"')).toContain('white-space: pre-wrap');
  });

  it('the n clamp uses the lineClamp variable', () => {
    textBlock({ lineClamp: 'n' });
    const css = rule('data-line-clamp="n"');
    expect(css).toContain('var(--var-ui-text-block-lineclamp)');
    expect(css).toContain('-webkit-line-clamp');
  });
});
