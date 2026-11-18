import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
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
    expect(css).toMatch(/@media \(max-width: 64rem\)[^@]*aspect-ratio: 1 \/ 1/);
    expect(css).toContain('[data-variant="command"]');
  });
});
