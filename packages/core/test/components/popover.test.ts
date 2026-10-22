import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../../src/styles';
import { popover } from '../../src/components/popover';

describe('popover', () => {
  it('preserves the public root class name', () => {
    const classes = popover();

    expect(classes.root.className).toBeTruthy();
    expect(classes.root.className).toContain('var-ui-popover');
  });

  it('exposes the public arrow class name', () => {
    const classes = popover();

    expect(classes.arrow.className).toBeTruthy();
    expect(classes.arrow.className).toContain('var-ui-popover__arrow');
  });

  it('paints the arrow with the popover surface token, not inherit', () => {
    popover();
    const css = getRegisteredCss();
    const rootBackground = css.match(
      /\.var-ui-popover[^{]*\{[^}]*background-color:\s*([^;]+);/,
    )?.[1];
    const arrowBackground = css.match(
      /\.var-ui-popover__arrow[^{]*\{[^}]*background-color:\s*([^;]+);/,
    )?.[1];

    expect(rootBackground).toBeTruthy();
    expect(arrowBackground).toBe(rootBackground);
    expect(css).not.toMatch(/\.var-ui-popover__arrow[^{]*\{[^}]*background:\s*inherit/);
    expect(css).toContain('[data-placement="bottom"]');
    expect(css).toContain('translateY(50%)');
  });
});
