import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { stubNativePopover } from '../test/nativeOverlayStubs';
import { TopNav } from './TopNav';

stubNativePopover();

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('TopNav', () => {
  it('renders a nav landmark labeled "Top navigation" by default, and a custom label when set', () => {
    const { rerender } = wrap(<TopNav>content</TopNav>);
    expect(screen.getByRole('navigation', { name: 'Top navigation' })).toBeTruthy();

    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <TopNav label="Primary">content</TopNav>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy();
  });

  it('renders startContent children via the `children` alias', () => {
    wrap(
      <TopNav>
        <TopNav.Item label="Home" href="/" />
      </TopNav>,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
  });

  it('marks a selected item with data-selected and aria-current="page"', () => {
    wrap(
      <TopNav>
        <TopNav.Item label="Home" href="/" selected />
        <TopNav.Item label="Docs" href="/docs" />
      </TopNav>,
    );
    const selected = screen.getByRole('link', { name: 'Home' });
    expect(selected.getAttribute('aria-current')).toBe('page');
    expect(selected.hasAttribute('data-selected')).toBe(true);

    const unselected = screen.getByRole('link', { name: 'Docs' });
    expect(unselected.hasAttribute('aria-current')).toBe(false);
    expect(unselected.hasAttribute('data-selected')).toBe(false);
  });

  it('exposes an accessible name from `label` for icon-only items', () => {
    wrap(<TopNav.Item label="Search" iconOnly onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeTruthy();
  });

  it('sets data-layout="grid" on the root only when centerContent is provided', () => {
    const { rerender } = wrap(<TopNav>content</TopNav>);
    expect(screen.getByRole('navigation').getAttribute('data-layout')).toBeNull();

    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <TopNav centerContent={<span>Search</span>}>content</TopNav>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.getByRole('navigation').getAttribute('data-layout')).toBe('grid');
  });

  it('marks heading, start, center, and end zones with data-var-ui-top-nav-*', () => {
    wrap(
      <TopNav
        heading={<span>Brand</span>}
        centerContent={<span>Mid</span>}
        endContent={<span>End</span>}
      >
        <TopNav.Item label="Home" href="/" />
      </TopNav>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.hasAttribute('data-var-ui-top-nav')).toBe(true);
    expect(nav.querySelector('[data-var-ui-top-nav-heading]')).toBeTruthy();
    expect(nav.querySelector('[data-var-ui-top-nav-start]')).toBeTruthy();
    expect(nav.querySelector('[data-var-ui-top-nav-center]')).toBeTruthy();
    expect(nav.querySelector('[data-var-ui-top-nav-end]')).toBeTruthy();
  });

  // TopNav.Menu is built on HoverCard, which opens on hover (after openDelay) or
  // keyboard focus — there is no press-to-open interaction for this part.
  it('opens TopNav.Menu on hover, revealing its rich items', async () => {
    wrap(
      <TopNav>
        <TopNav.Menu
          label="Products"
          items={[
            { id: 'a', title: 'Analytics', description: 'Track usage' },
            { id: 'b', title: 'Billing', href: '/billing' },
          ]}
          openDelay={10}
          closeDelay={10}
        />
      </TopNav>,
    );
    expect(screen.queryByText('Analytics')).toBeNull();

    await userEvent.hover(screen.getByRole('button', { name: 'Products' }));
    await waitFor(() => expect(screen.getByText('Analytics')).toBeTruthy());
    expect(screen.getByText('Track usage')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Billing' })).toBeTruthy();
  });

  it('shows TopNav.MegaMenu.FeaturedCard content once the mega menu opens', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <TopNav>
        <TopNav.MegaMenu
          label="Solutions"
          items={[{ id: 'x', title: 'For startups', href: '/startups' }]}
          featured={
            <TopNav.MegaMenu.FeaturedCard
              title="New: Enterprise"
              description="Scale with confidence"
            />
          }
          onOpenChange={onOpenChange}
          openDelay={10}
          closeDelay={10}
        />
      </TopNav>,
    );
    const trigger = screen.getByRole('button', { name: 'Solutions' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('New: Enterprise')).toBeNull();

    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByText('New: Enterprise')).toBeTruthy());
    expect(screen.getByText('Scale with confidence')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'For startups' })).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: expect.any(String) }),
    );

    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByText('New: Enterprise')).toBeNull());
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('closes the mega menu on Escape and refocuses the trigger', async () => {
    wrap(
      <TopNav>
        <TopNav.MegaMenu
          label="Solutions"
          items={[{ id: 'x', title: 'For startups', href: '/startups' }]}
          // `userEvent.click` also fires hover + focus, which schedule open. Short
          // delays can open before `onClick` and then toggle the menu closed.
          openDelay={10000}
          closeDelay={10000}
        />
      </TopNav>,
    );
    const trigger = screen.getByRole('button', { name: 'Solutions' });
    await userEvent.click(trigger);
    expect(screen.getByRole('link', { name: 'For startups' })).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('link', { name: 'For startups' })).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('toggles TopNav.MegaMenu open/closed on press, independent of hover delays', async () => {
    wrap(
      <TopNav>
        <TopNav.MegaMenu
          label="Solutions"
          items={[{ id: 'x', title: 'For startups', href: '/startups' }]}
          openDelay={10000}
          closeDelay={10000}
        />
      </TopNav>,
    );
    const trigger = screen.getByRole('button', { name: 'Solutions' });
    await userEvent.click(trigger);
    expect(screen.getByRole('link', { name: 'For startups' })).toBeTruthy();

    await userEvent.click(trigger);
    expect(screen.queryByRole('link', { name: 'For startups' })).toBeNull();
  });
});
