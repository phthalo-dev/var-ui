import { createRef, type ReactNode } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectionProvider } from '../DirectionProvider';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { SideNav, type SideNavCollapseHandle } from './SideNav';

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('SideNav', () => {
  it('renders a nav landmark labeled "Side navigation" by default, and a custom label when set', () => {
    const { rerender } = wrap(<SideNav>content</SideNav>);
    expect(screen.getByRole('navigation', { name: 'Side navigation' })).toBeTruthy();

    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <SideNav label="Primary">content</SideNav>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy();
  });

  it('collapses via the default collapse button, setting data-collapsed and flipping the button label', async () => {
    wrap(
      <SideNav collapsible>
        <SideNav.Item label="Dashboard" href="/" />
      </SideNav>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.hasAttribute('data-collapsed')).toBe(false);
    expect(screen.getByText('Dashboard')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));

    expect(nav.getAttribute('data-collapsed')).toBe('');
    expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeTruthy();
  });

  it('does not render a collapse button, and never sets data-collapsed, when collapsible is unset', () => {
    wrap(<SideNav>content</SideNav>);
    expect(screen.queryByRole('button', { name: 'Collapse navigation' })).toBeNull();
    expect(screen.getByRole('navigation').hasAttribute('data-collapsed')).toBe(false);
  });

  it('expands/collapses a nested item independently of the outer nav', async () => {
    wrap(
      <SideNav>
        <SideNav.Item label="Projects" collapsible>
          <SideNav.Item label="Alpha" href="/projects/alpha" />
        </SideNav.Item>
      </SideNav>,
    );
    expect(screen.getByText('Alpha')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Collapse Projects' }));
    expect(screen.queryByText('Alpha')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Expand Projects' }));
    expect(screen.getByText('Alpha')).toBeTruthy();
  });

  it('uses ScrollArea with vertical fade for the scrollable section list', () => {
    const { container } = wrap(
      <SideNav>
        <SideNav.Item label="Dashboard" href="/" />
      </SideNav>,
    );

    const scrollArea = container.querySelector('.var-ui-scroll-area');
    expect(scrollArea).toBeTruthy();
    expect(scrollArea?.getAttribute('data-fade')).toBe('vertical');
    expect(scrollArea?.querySelector('.var-ui-scroll-area__viewport')).toBeTruthy();
  });

  it('renders a resize handle only when resizable, and hides it once the nav collapses', async () => {
    const { rerender } = wrap(<SideNav resizable>content</SideNav>);
    expect(screen.getByRole('separator')).toBeTruthy();

    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <SideNav>content</SideNav>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.queryByRole('separator')).toBeNull();

    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <SideNav resizable collapsible>
            content
          </SideNav>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.getByRole('separator')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('marks a selected item with data-selected and aria-current="page"', () => {
    wrap(
      <SideNav>
        <SideNav.Item label="Dashboard" href="/" selected />
        <SideNav.Item label="Settings" href="/settings" />
      </SideNav>,
    );
    const selected = screen.getByRole('link', { name: 'Dashboard' });
    expect(selected.getAttribute('aria-current')).toBe('page');
    expect(selected.hasAttribute('data-selected')).toBe(true);

    const unselected = screen.getByRole('link', { name: 'Settings' });
    expect(unselected.hasAttribute('aria-current')).toBe(false);
    expect(unselected.hasAttribute('data-selected')).toBe(false);
  });

  it('drives collapse imperatively via handleRef', () => {
    const handleRef = createRef<SideNavCollapseHandle>();
    wrap(
      <SideNav collapsible handleRef={handleRef}>
        content
      </SideNav>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.hasAttribute('data-collapsed')).toBe(false);

    act(() => handleRef.current?.toggle());
    expect(nav.getAttribute('data-collapsed')).toBe('');

    act(() => handleRef.current?.expand());
    expect(nav.hasAttribute('data-collapsed')).toBe(false);

    act(() => handleRef.current?.collapse());
    expect(nav.getAttribute('data-collapsed')).toBe('');
  });

  it('supports a fully controlled collapse state via the collapsible config', async () => {
    let collapsedState = false;
    const onCollapsedChange = (next: boolean) => {
      collapsedState = next;
    };
    const { rerender } = wrap(
      <SideNav collapsible={{ collapsed: collapsedState, onCollapsedChange }}>content</SideNav>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));
    expect(collapsedState).toBe(true);
    // Controlled: the DOM does not flip until the caller re-renders with the new value.
    expect(screen.getByRole('navigation').hasAttribute('data-collapsed')).toBe(false);

    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <SideNav collapsible={{ collapsed: true, onCollapsedChange }}>content</SideNav>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.getByRole('navigation').getAttribute('data-collapsed')).toBe('');
  });

  it('mirrors the collapse chevron when direction is rtl', () => {
    wrap(
      <DirectionProvider direction="rtl">
        <SideNav collapsible>
          <span>item</span>
        </SideNav>
      </DirectionProvider>,
    );
    const collapse = screen.getByRole('button', { name: 'Collapse navigation' });
    expect(collapse.querySelector('[data-mirror]')).toBeTruthy();
  });

  it('mirrors the nested expand chevron when direction is rtl', async () => {
    wrap(
      <DirectionProvider direction="rtl">
        <SideNav>
          <SideNav.Item label="Projects" collapsible>
            <SideNav.Item label="Alpha" href="/projects/alpha" />
          </SideNav.Item>
        </SideNav>
      </DirectionProvider>,
    );
    // Starts expanded (chevronDown) — only horizontal chevrons opt into mirror.
    const collapse = screen.getByRole('button', { name: 'Collapse Projects' });
    expect(collapse.querySelector('[data-mirror]')).toBeNull();
    await userEvent.click(collapse);
    const expand = screen.getByRole('button', { name: 'Expand Projects' });
    expect(expand.querySelector('[data-mirror]')).toBeTruthy();
  });
});
