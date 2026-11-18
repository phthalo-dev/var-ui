import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { commandPalette } from '../src/components/commandPalette';
import { menu } from '../src/components/menu';
import { mobileNav } from '../src/components/mobileNav';
import { searchInput } from '../src/components/searchInput';
import { segmentedControl } from '../src/components/segmentedControl';
import { sideNav } from '../src/components/sideNav';
import { topNav } from '../src/components/topNav';

describe('app header chrome recipes', () => {
  it('mobileNav close button has a control-sized box and sizes its icon', () => {
    mobileNav();
    const css = getRegisteredCss();
    const rule = css.match(/\.var-ui-mobile-nav__closeButton\s*\{[^}]*\}/)?.[0] ?? '';
    expect(rule).toContain('min-width: var(--var-ui-size-control-md)');
    expect(rule).toContain('min-height: var(--var-ui-size-control-md)');
    expect(css).toMatch(
      /\.var-ui-mobile-nav__closeButton svg\s*\{[^}]*width: var\(--var-ui-size-icon-md\)/,
    );
  });

  it('sideNav re-declares var defaults on sections/items outside a SideNav root', () => {
    sideNav();
    const css = getRegisteredCss();
    expect(css).toMatch(
      /\.var-ui-side-nav__section:not\(\.var-ui-side-nav \*\):not\(\.var-ui-side-nav__section \*\)\s*\{[^}]*--var-ui-side-nav-itemcolor:/,
    );
    expect(css).toMatch(
      /\.var-ui-side-nav__item:not\(\.var-ui-side-nav \*\):not\(\.var-ui-side-nav__section \*\)\s*\{[^}]*--var-ui-side-nav-itemselectedcolor:/,
    );
  });

  it('topNav reserves the selected label width without exposing it to AT', () => {
    topNav();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-top-nav__itemLabel::after');
    expect(css).toMatch(/content:\s*attr\(data-label\) \/ ""/);
    // No drop shadow on the bar.
    expect(css).not.toMatch(/\.var-ui-top-nav\s*\{[^}]*box-shadow/);
  });

  it('segmentedControl icon layout squares segments over toggle-button padding', () => {
    segmentedControl({ size: 'md', layout: 'icon' });
    const css = getRegisteredCss();
    expect(css).toMatch(
      /layout="icon"\] > \*, [^{]*layout="icon"\] > \[class\]\s*\{[^}]*aspect-ratio: 1 \/ 1/,
    );
  });

  it('searchInput collapses the command trigger at the chosen breakpoint only', () => {
    searchInput({ variant: 'command', size: 'md', collapseBelow: 'lg' });
    const css = getRegisteredCss();
    expect(css).toMatch(/@media \(width < 64rem\)[^@]*aspect-ratio: 1 \/ 1/);
    expect(css).toContain('[data-variant="command"]');
  });

  it('topNav: one sliding selected pill on the start zone, quieter dark hover, pressed nudge', () => {
    topNav();
    const css = getRegisteredCss();
    expect(css).toMatch(
      /\.var-ui-top-nav__start::before\s*\{[^}]*width: var\(--var-ui-top-nav-indicatorwidth\)/,
    );
    // Slides only once placed, using duration tokens (zeroed under reduced motion).
    expect(css).toMatch(
      /\.var-ui-top-nav__start\[data-indicator-ready\]::before\s*\{[^}]*transition: transform var\(--var-ui-duration-medium\)/,
    );
    // The item hands its fill to the pill while the pill is placed.
    expect(css).toMatch(
      /\[data-indicator\] \.var-ui-top-nav__item\[data-selected\]\s*\{[^}]*background-color: transparent/,
    );
    expect(css).toMatch(
      /\.var-ui-top-nav__item:active:not\(\[disabled\]\)[^{]*\{[^}]*translateY\(0\.0625rem\)/,
    );
    // Bar hairline: border.default in light mode.
    expect(css).toMatch(/--var-ui-top-nav-border:[^;]*color-border-default/);
  });

  it('searchInput command trigger shares the segmented track chrome; the key cap stays lifted', () => {
    searchInput({ variant: 'command', size: 'md' });
    const css = getRegisteredCss();
    expect(css).toMatch(
      /\[data-variant="command"\]\s*\{[^}]*--var-ui-search-input-background: var\(--var-ui-color-background-subtle\)/,
    );
    expect(css).toMatch(
      /\.var-ui-search-input__shortcut kbd\s*\{[^}]*background-color: var\(--var-ui-color-background-surface\)/,
    );
  });

  it('mobileNav toggle is a square control-sized icon button', () => {
    mobileNav();
    const css = getRegisteredCss();
    const rule = css.match(/\.var-ui-mobile-nav__toggle\s*\{[^}]*\}/)?.[0] ?? '';
    expect(rule).toContain('width: var(--var-ui-size-control-md)');
    expect(rule).toContain('height: var(--var-ui-size-control-md)');
    expect(rule).toContain('padding: 0');
  });

  it('menu: quiet 12px section labels, capped height, row sections', () => {
    menu();
    const css = getRegisteredCss();
    expect(css).toMatch(
      /\.var-ui-menu__sectionHeader\s*\{[^}]*font-size: var\(--var-ui-fontSize-xs\)/,
    );
    expect(css).toMatch(/\.var-ui-menu__popover\s*\{[^}]*max-block-size: min\(32rem/);
    expect(css).toMatch(/\.var-ui-menu__sectionRow\s*\{[^}]*flex-direction: row/);
  });

  it('commandPalette: ~44px rows, 12px muted subtitle, icon tile', () => {
    commandPalette();
    const css = getRegisteredCss();
    expect(css).toMatch(/\.var-ui-command-palette__resultLink\s*\{[^}]*min-height: 2\.75rem/);
    expect(css).toMatch(
      /\.var-ui-command-palette__resultMeta\s*\{[^}]*font-size: var\(--var-ui-fontSize-xs\)/,
    );
    expect(css).toMatch(/\.var-ui-command-palette__resultIcon\s*\{[^}]*width: 1\.75rem/);
  });
});
