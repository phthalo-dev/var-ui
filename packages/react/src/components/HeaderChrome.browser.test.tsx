import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { raf, settled } from '../test/browser';
import { SegmentedControl } from './SegmentedControl';
import { SideNavItem, SideNavSection } from './SideNav';
import { TopNav, TopNavItem } from './TopNav';

/**
 * App-header chrome regressions found on the docs site: nav items rendered outside a `SideNav`
 * (mobile drawers), segmented-control shape/focus, and top-nav item metrics.
 */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemProvider applyToDocument>
      <IconProvider icons={{}}>{children}</IconProvider>
    </DesignSystemProvider>
  );
}

const transparent = (color: string) => color === 'rgba(0, 0, 0, 0)' || color === 'transparent';

describe('SideNav parts outside a SideNav root', () => {
  test('section items keep visible colours (e.g. inside a MobileNav)', async () => {
    const { getByText } = render(
      <Shell>
        <SideNavSection title="Pages">
          <SideNavItem label="Docs" href="#docs" selected />
          <SideNavItem label="Components" href="#components" />
        </SideNavSection>
      </Shell>,
    );
    await raf();
    const rest = getByText('Components').closest('a')!;
    const selected = getByText('Docs').closest('a')!;
    expect(transparent(getComputedStyle(rest).color)).toBe(false);
    expect(transparent(getComputedStyle(selected).color)).toBe(false);
    expect(transparent(getComputedStyle(selected).backgroundColor)).toBe(false);
  });
});

describe('SegmentedControl header metrics', () => {
  const options = [
    { value: 'react', label: 'R', 'aria-label': 'React' },
    { value: 'astro', label: 'A', 'aria-label': 'Astro' },
    { value: 'html', label: 'H', 'aria-label': 'HTML' },
  ];

  test('layout="icon" segments are square and the track matches the control height', async () => {
    const { getByRole } = render(
      <Shell>
        <SegmentedControl aria-label="Framework" layout="icon" options={options} />
      </Shell>,
    );
    await raf();
    const group = getByRole('radiogroup');
    const segment = group.firstElementChild as HTMLElement;
    const rect = segment.getBoundingClientRect();
    expect(Math.abs(rect.width - rect.height)).toBeLessThan(0.5);
    expect(group.getBoundingClientRect().height).toBe(32);
  });

  test('the segment (focus ring) radius equals the indicator radius', async () => {
    const { getByRole } = render(
      <Shell>
        <SegmentedControl aria-label="Framework" layout="icon" options={options} />
      </Shell>,
    );
    await raf();
    const group = getByRole('radiogroup');
    const segment = group.firstElementChild as HTMLElement;
    const indicatorRadius = getComputedStyle(group, '::after').borderTopLeftRadius;
    expect(getComputedStyle(segment).borderTopLeftRadius).toBe(indicatorRadius);
    // Not a pill: the nested radius is smaller than the track's.
    expect(parseFloat(indicatorRadius)).toBeLessThan(
      parseFloat(getComputedStyle(group).borderTopLeftRadius),
    );
  });

  test('is one tab stop: Tab lands on the checked segment', async () => {
    const { getByRole } = render(
      <Shell>
        <button type="button">before</button>
        <SegmentedControl
          aria-label="Framework"
          layout="icon"
          options={options}
          defaultValue="astro"
        />
      </Shell>,
    );
    getByRole('button', { name: 'before' }).focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(getByRole('radio', { name: 'Astro' }));
    await userEvent.tab();
    expect(getByRole('radiogroup').contains(document.activeElement)).toBe(false);
  });
});

describe('TopNav item metrics', () => {
  test('items match the 32px control height and selecting one does not shift its width', async () => {
    const { getByText, rerender } = render(
      <Shell>
        <TopNav>
          <TopNavItem label="Components" href="#c" />
        </TopNav>
      </Shell>,
    );
    await raf();
    const item = () => getByText('Components').closest('a')!;
    const before = item().getBoundingClientRect();
    expect(before.height).toBe(32);

    rerender(
      <Shell>
        <TopNav>
          <TopNavItem label="Components" href="#c" selected />
        </TopNav>
      </Shell>,
    );
    await raf();
    expect(getComputedStyle(item()).fontWeight).toBe('600');
    expect(item().getBoundingClientRect().width).toBe(before.width);
  });
});

describe('TopNav sliding selected pill', () => {
  function Bar({ selected }: { selected: string }) {
    return (
      <Shell>
        <TopNav>
          {['Docs', 'Components', 'Theming'].map((label) => (
            <TopNavItem
              key={label}
              label={label}
              href={`#${label}`}
              selected={selected === label}
            />
          ))}
        </TopNav>
      </Shell>
    );
  }

  const pill = (start: HTMLElement) => {
    const zone = start.getBoundingClientRect();
    const cs = getComputedStyle(start, '::before');
    const x = new DOMMatrixReadOnly(cs.transform).m41;
    return { left: zone.left + x, width: parseFloat(cs.width), opacity: cs.opacity };
  };

  test('one pill sits under the selected item and the item paints no fill of its own', async () => {
    const { getByText } = render(<Bar selected="Components" />);
    await raf();
    await raf();
    const item = getByText('Components').closest('a')!;
    const start = item.closest('[data-var-ui-top-nav-start]') as HTMLElement;
    expect(start.hasAttribute('data-indicator')).toBe(true);
    const p = pill(start);
    const r = item.getBoundingClientRect();
    expect(Math.abs(p.left - r.left)).toBeLessThan(0.5);
    expect(Math.abs(p.width - r.width)).toBeLessThan(0.5);
    expect(p.opacity).toBe('1');
    await settled(item);
    expect(transparent(getComputedStyle(item).backgroundColor)).toBe(true);
    expect(transparent(getComputedStyle(start, '::before').backgroundColor)).toBe(false);
  });

  test('moving the selection slides the pill (transition) to the new item', async () => {
    const { getByText, rerender } = render(<Bar selected="Docs" />);
    await raf();
    await raf();
    const start = getByText('Docs').closest('[data-var-ui-top-nav-start]') as HTMLElement;
    expect(start.hasAttribute('data-indicator-ready')).toBe(true);
    expect(getComputedStyle(start, '::before').transitionProperty).toContain('transform');

    rerender(<Bar selected="Theming" />);
    await raf();
    const target = getByText('Theming').closest('a')!.getBoundingClientRect();
    await settled(start);
    const p = pill(start);
    expect(Math.abs(p.left - target.left)).toBeLessThan(0.5);
    expect(Math.abs(p.width - target.width)).toBeLessThan(0.5);
  });

  test('hides when nothing is selected', async () => {
    const { getByText } = render(<Bar selected="" />);
    await raf();
    const start = getByText('Docs').closest('[data-var-ui-top-nav-start]') as HTMLElement;
    expect(getComputedStyle(start, '::before').opacity).toBe('0');
    expect(start.hasAttribute('data-indicator')).toBe(false);
  });
});
