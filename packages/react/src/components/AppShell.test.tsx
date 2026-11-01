import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { AppShell, APP_SHELL_MAIN_ID } from './AppShell';
import { MobileNav, MobileNavToggle } from './MobileNav';

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <>{ui}</>
    </IconProvider>,
  );
}

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === 'not all' ? false : matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

import { stubNativeDialog } from '../test/nativeOverlayStubs';

stubNativeDialog();

describe('AppShell', () => {
  it('renders the main landmark with the skip-link target id', () => {
    stubMatchMedia(false);
    wrap(
      <AppShell>
        <p>Content</p>
      </AppShell>,
    );
    const main = screen.getByRole('main');
    expect(main.id).toBe(APP_SHELL_MAIN_ID);
    expect(screen.getByText('Content')).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('renders a skip-to-content link targeting the main landmark', () => {
    stubMatchMedia(false);
    wrap(<AppShell>Content</AppShell>);
    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(link.getAttribute('href')).toBe(`#${APP_SHELL_MAIN_ID}`);
    vi.unstubAllGlobals();
  });

  it('renders topNav, sideNav, and children in their slots', () => {
    stubMatchMedia(false);
    wrap(
      <AppShell topNav={<span>Top</span>} sideNav={<span>Side</span>}>
        <span>Main</span>
      </AppShell>,
    );
    expect(screen.getByText('Top')).toBeTruthy();
    expect(screen.getByText('Side')).toBeTruthy();
    expect(screen.getByText('Main')).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('does not set data-mobile above the breakpoint', () => {
    stubMatchMedia(false);
    const { container } = wrap(<AppShell sideNav={<span>Side</span>}>Content</AppShell>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute('data-mobile')).toBe(false);
    vi.unstubAllGlobals();
  });

  it('sets data-mobile on the root below the breakpoint', () => {
    stubMatchMedia(true);
    const { container } = wrap(<AppShell sideNav={<span>Side</span>}>Content</AppShell>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-mobile')).toBe('');
    vi.unstubAllGlobals();
  });

  it('never sets data-mobile when mobileBreakpoint is "none"', () => {
    stubMatchMedia(true);
    const { container } = wrap(
      <AppShell mobileBreakpoint="none" sideNav={<span>Side</span>}>
        Content
      </AppShell>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute('data-mobile')).toBe(false);
    vi.unstubAllGlobals();
  });

  it('renders aside content in the aside slot', () => {
    stubMatchMedia(false);
    wrap(
      <AppShell aside={<span>TOC</span>} sideNav={<span>Side</span>}>
        Main
      </AppShell>,
    );
    expect(screen.getByText('TOC')).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('sets data-aside on the root when aside is provided', () => {
    stubMatchMedia(false);
    const { container } = wrap(<AppShell aside={<span>TOC</span>}>Main</AppShell>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-aside')).toBe('');
    vi.unstubAllGlobals();
  });

  it('does not set data-aside when aside is omitted', () => {
    stubMatchMedia(false);
    const { container } = wrap(<AppShell>Main</AppShell>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute('data-aside')).toBe(false);
    vi.unstubAllGlobals();
  });

  it('shares mobile-nav open state so a Toggle inside AppShell opens a MobileNav also inside AppShell', async () => {
    stubMatchMedia(false);
    wrap(
      <AppShell
        topNav={<MobileNavToggle />}
        mobileNav={
          <MobileNav header="Menu">
            <p>Drawer content</p>
          </MobileNav>
        }
      >
        Content
      </AppShell>,
    );
    expect(screen.queryByText('Drawer content')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(screen.getByText('Drawer content')).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('renders only main when disabled', () => {
    stubMatchMedia(false);
    const { container } = wrap(
      <AppShell disabled topNav={<span>Top</span>} sideNav={<span>Side</span>}>
        Content
      </AppShell>,
    );
    expect(screen.getByRole('main').textContent).toBe('Content');
    expect(container.querySelector('header')).toBeNull();
    expect(screen.queryByText('Top')).toBeNull();
    vi.unstubAllGlobals();
  });

  it('sets data-side-nav-collapsed when sideNavCollapsed is true', () => {
    stubMatchMedia(false);
    const { container } = wrap(
      <AppShell sideNav={<span>Side</span>} sideNavCollapsed>
        Content
      </AppShell>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-side-nav-collapsed')).toBe('');
    vi.unstubAllGlobals();
  });

  it('sets data-layout="alt" for alt layout', () => {
    stubMatchMedia(false);
    const { container } = wrap(<AppShell layout="alt">Content</AppShell>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-layout')).toBe('alt');
    vi.unstubAllGlobals();
  });

  it('sets data-height="stretch" on the root when height is stretch', () => {
    stubMatchMedia(false);
    const { container } = wrap(<AppShell height="stretch">Content</AppShell>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-height')).toBe('stretch');
    vi.unstubAllGlobals();
  });
});
