import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../../src/styles';
import { commandPalette } from '../../src/components/commandPalette';
import { dialog } from '../../src/components/dialog';
import { drawer } from '../../src/components/drawer';
import { layoutPanel } from '../../src/components/layout';
import { mobileNav } from '../../src/components/mobileNav';
import { nativeEnterExit, nativeSlideFrom } from '../../src/shared/overlayMotion';

/** Lines of generated CSS containing every needle. */
const rules = (css: string, ...needles: string[]) =>
  css.split('\n').filter((line) => needles.every((n) => line.includes(n)));

describe('TypeStyles can express native top-layer enter/exit', () => {
  it('emits the closed class, the [open] state and a nested @starting-style block', () => {
    dialog();
    const css = getRegisteredCss();
    const popup = '.var-ui-dialog__popup';

    // closed look + discrete transitions so the element stays in the top layer while it exits
    const [base] = rules(css, `${popup} {`, 'allow-discrete');
    expect(base).toContain('opacity: 0');
    expect(base).toMatch(
      /transition: [^;]*overlay [^;]*allow-discrete[^;]*display [^;]*allow-discrete/,
    );
    expect(base).toMatch(/transition: [^;]*--var-ui-property-backdrop-alpha/);

    // open state
    expect(rules(css, `${popup}[open] {`, 'opacity: 1', 'transform: none')).toHaveLength(1);
    // @starting-style wraps the same selector (valid CSS: a rule-level @starting-style)
    const starting = rules(css, '@starting-style', `${popup}[open]`);
    expect(starting).toHaveLength(1);
    expect(starting[0]).toContain('opacity: 0');
    expect(starting[0]).toContain('transform: scale(0.98)');
    // the starting-style rule is emitted after the open rule so it wins at equal specificity
    expect(css.indexOf(`${popup}[open] {`)).toBeLessThan(css.indexOf(starting[0]));
  });

  it('supports :popover-open for popovers', () => {
    const style = nativeEnterExit({ open: ':popover-open', scale: true }) as Record<
      string,
      unknown
    >;
    expect(style['&:popover-open']).toMatchObject({
      opacity: 1,
      '@starting-style': { opacity: 0 },
    });
  });

  it('declares the backdrop alpha as an inherited registered number and reads it in ::backdrop', () => {
    dialog();
    const css = getRegisteredCss();
    expect(css).toMatch(
      /@property --var-ui-property-backdrop-alpha \{[^}]*<number>[^}]*inherits: true/,
    );
    const [backdrop] = rules(css, '.var-ui-dialog__popup::backdrop');
    expect(backdrop).toContain('color-mix(in srgb');
    expect(backdrop).toContain('var(--var-ui-property-backdrop-alpha)');
    // pseudo-elements cannot hold @starting-style
    expect(rules(css, '@starting-style', '::backdrop')).toHaveLength(0);
    expect(
      rules(css, '.var-ui-dialog__popup[open] {', '--var-ui-property-backdrop-alpha: 1'),
    ).toHaveLength(1);
    expect(rules(css, '@starting-style', '--var-ui-property-backdrop-alpha: 0')).not.toHaveLength(
      0,
    );
  });

  it('slide placements translate off-screen, flip for RTL and start from the closed position', () => {
    drawer();
    const css = getRegisteredCss();
    const sel = '.var-ui-drawer__popup[data-placement="start"]';
    expect(rules(css, `${sel} {`, 'translate: -100% 0')).toHaveLength(1);
    expect(rules(css, `[dir="rtl"] ${sel} {`, 'translate: 100% 0')).toHaveLength(1);
    expect(rules(css, `${sel}[open] {`, 'translate: none')).toHaveLength(1);
    expect(rules(css, '@starting-style', `${sel}[open]`, 'translate: -100% 0')).toHaveLength(1);
    expect(
      rules(css, '.var-ui-drawer__popup[data-placement="bottom"] {', 'translate: 0 100%'),
    ).toHaveLength(1);
    // bottom does not flip in RTL
    expect(rules(css, '[dir="rtl"] .var-ui-drawer__popup[data-placement="bottom"]')).toHaveLength(
      0,
    );
    expect(nativeSlideFrom('end')).toMatchObject({ translate: '100% 0' });
  });
});

describe('native dialog-family recipes', () => {
  it('use the dialog element as popup with no z-index, data-*-style hooks or ::backdrop @starting-style', () => {
    dialog();
    drawer();
    mobileNav();
    layoutPanel();
    commandPalette();
    const css = getRegisteredCss();
    for (const cls of [
      '.var-ui-dialog__popup',
      '.var-ui-drawer__popup',
      '.var-ui-mobile-nav__popup',
      '.var-ui-layout-panel__popup',
      '.var-ui-command-palette',
    ]) {
      const own = rules(css, `${cls}`);
      expect(own.length, cls).toBeGreaterThan(0);
      expect(own.join('\n'), cls).not.toContain('z-index');
      expect(own.join('\n'), cls).not.toContain('data-starting-style');
      expect(rules(css, cls, '[open]', 'opacity: 1'), cls).not.toHaveLength(0);
      expect(rules(css, cls, '::backdrop'), cls).not.toHaveLength(0);
    }
    expect(css).not.toContain('var-ui-dialog__overlay');
    expect(css).not.toContain('var-ui-dialog__modal');
    expect(css).not.toContain('var-ui-drawer__panel');
    expect(css).not.toContain('var-ui-mobile-nav__overlay');
  });

  it('moves dialog padding to the content element so the dialog box is all content', () => {
    dialog();
    const css = getRegisteredCss();
    expect(rules(css, '.var-ui-dialog__popup {', 'padding: 0')).toHaveLength(1);
    expect(rules(css, '.var-ui-dialog__popup {', 'overscroll-behavior: contain')).toHaveLength(1);
    expect(rules(css, '.var-ui-dialog__content {', 'padding:')).toHaveLength(1);
  });

  it('collapses motion through duration tokens (no literal times) under reduced motion', () => {
    dialog();
    const [base] = rules(getRegisteredCss(), '.var-ui-dialog__popup {', 'allow-discrete');
    expect(base).toContain('var(--var-ui-duration-slow)');
    expect(base).not.toMatch(/\d(ms|s)\b/);
  });
});

describe('global scroll lock', () => {
  it('locks scroll while a modal dialog is open and reserves the scrollbar gutter', () => {
    const css = getRegisteredCss();
    expect(rules(css, 'html:has(dialog:modal) {', 'overflow: hidden')).toHaveLength(1);
    expect(rules(css, 'html {', 'scrollbar-gutter: stable')).toHaveLength(1);
  });
});
