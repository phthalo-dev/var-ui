import { getRegisteredCss } from 'typestyles';
import { describe, expect, it } from 'vite-plus/test';
import { codeBlock } from '../src/components/codeBlock';

/** CSS block for `[data-…]` selectors on the code-block recipe. */
function rule(matcher: string): string {
  const css = getRegisteredCss();
  return (
    css.split('}').find((block) => block.includes('code-block') && block.includes(matcher)) ?? ''
  );
}

describe('codeBlock diff and maxHeight', () => {
  it('added lines paint from the code addition tokens', () => {
    codeBlock({ variant: 'diff' });
    const css = rule('data-line-tone="added"');
    expect(css).toMatch(/background-color:\s*var\(--var-ui-color-code-additionBackground/);
    expect(css).toMatch(/color:\s*var\(--var-ui-color-code-addition/);
  });

  it('deleted lines paint from the code deletion tokens', () => {
    codeBlock({ variant: 'diff' });
    const css = rule('data-line-tone="deleted"');
    expect(css).toMatch(/background-color:\s*var\(--var-ui-color-code-deletionBackground/);
    expect(css).toMatch(/color:\s*var\(--var-ui-color-code-deletion/);
  });

  it('hunk headers take the section syntax color', () => {
    codeBlock({ variant: 'diff' });
    expect(rule('data-line-tone="hunk"')).toMatch(/color:\s*var\(--var-ui-color-code-section/);
  });

  it('the body honours the maxHeight variable', () => {
    codeBlock({ variant: 'default' });
    expect(rule('code-block__body')).toMatch(/max-height:\s*var\(--var-ui-code-block-maxheight/);
  });
});
