import type { JSX, ReactNode, Ref } from 'react';
import { useRef } from 'react';
import {
  appShell,
  type AppShellContentPadding,
  type AppShellMobileBreakpoint,
  appShellMobileBreakpointQueries,
  type AppShellVariantProps,
} from '@var-ui/core';
import { useHeadroom, type UseHeadroomOptions } from '../hooks/useHeadroom';
import { useMediaQuery } from '../hooks';
import { MobileNavProvider } from './MobileNav';
import { mergeProps } from 'typestyles';

/** `id` of the `<main>` landmark — target of the skip-to-content link. */
export const APP_SHELL_MAIN_ID = 'var-ui-app-shell-main';

export type AppShellLayout = 'default' | 'alt';

export type AppShellProps = {
  /** Rendered inside the `<main>` landmark. */
  children?: ReactNode;
  /** Rendered in the top bar zone, e.g. a `TopNav`. */
  topNav?: ReactNode;
  /** Rendered in the persistent side column above `mobileBreakpoint`; hidden below it. */
  sideNav?: ReactNode;
  /**
   * A `MobileNav` drawer. Stays mounted at every width — its own `isOpen` (or the
   * shared `MobileNavProvider`) controls visibility. Consumers place a
   * `MobileNav.Toggle` in `topNav`'s `endContent` themselves; `AppShell` doesn't
   * inject one.
   */
  mobileNav?: ReactNode;
  /** Full-width banner above the top nav / content frame. */
  banner?: ReactNode;
  /** Optional right rail (e.g. an `Outline`). Hidden below `mobileBreakpoint`. */
  aside?: ReactNode;
  /**
   * When `true`, renders only the main landmark — no chrome slots, skip link, or
   * mobile provider wrapper. Useful for auth and onboarding pages.
   */
  disabled?: boolean;
  /**
   * `default` — header spans full width above the side column.
   * `alt` — side column spans full viewport height; header sits above main only.
   */
  layout?: AppShellLayout;
  /** Fully hides the side column on desktop (distinct from `SideNav` icon-only collapse). */
  sideNavCollapsed?: boolean;
  /** Fully hides the aside column. */
  asideCollapsed?: boolean;
  /**
   * Scroll-driven header hide — sets `headerHidden` from `useHeadroom`.
   * Observes the shell `<main>` scroll container.
   */
  headroom?: boolean | UseHeadroomOptions;
  /** Hides the top nav (pairs with `headroom` or manual scroll logic). */
  headerHidden?: boolean;
  /**
   * When `true` (default), a hidden header still reserves grid space.
   * When `false`, the top row collapses so main expands into the header band.
   */
  headerOffset?: boolean;
  /** @default 'fill' */
  height?: NonNullable<AppShellVariantProps['height']>;
  /** @default 'elevated' */
  variant?: NonNullable<AppShellVariantProps['variant']>;
  /** Main content padding — design-token space step. @default 0 */
  contentPadding?: AppShellContentPadding;
  /** Viewport width below which `sideNav` hides and `data-mobile` is set on the root. `'none'` never goes mobile. @default 'md' */
  mobileBreakpoint?: AppShellMobileBreakpoint;
  className?: string;
  /** Ref to the root element: the `<div>` shell, or the `<main>` landmark when `disabled`. */
  ref?: Ref<HTMLElement>;
};

function toContentPaddingVariant(
  padding: AppShellContentPadding | undefined,
): `${AppShellContentPadding}` {
  return `${padding ?? 0}` as `${AppShellContentPadding}`;
}

/**
 * Application chrome: optional banner, top nav, side nav, main content, and
 * aside rail in a CSS grid layout, plus a skip-to-content link and the mobile
 * breakpoint that hides the persistent side nav and aside.
 */
export function AppShell({
  children,
  topNav,
  sideNav,
  mobileNav,
  banner,
  aside,
  disabled = false,
  layout = 'default',
  sideNavCollapsed = false,
  asideCollapsed = false,
  headroom,
  headerHidden,
  headerOffset = true,
  height = 'fill',
  variant = 'elevated',
  contentPadding,
  mobileBreakpoint = 'md',
  className,
  ref,
}: AppShellProps): JSX.Element {
  const mainRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery(appShellMobileBreakpointQueries[mobileBreakpoint]);

  const headroomOptions = headroom === true ? {} : headroom === false ? undefined : headroom;
  const headroomEnabled = headroomOptions != null;
  const { pinned } = useHeadroom({
    ...headroomOptions,
    target: mainRef,
  });

  const s = appShell({
    height,
    variant,
    contentPadding: toContentPaddingVariant(contentPadding),
  });

  const effectiveHeaderHidden = headerHidden ?? (headroomEnabled ? !pinned : false);

  if (disabled) {
    return (
      <main
        id={APP_SHELL_MAIN_ID}
        {...mergeProps(s.main, className)}
        ref={(node) => {
          mainRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
      >
        {children}
      </main>
    );
  }

  return (
    <MobileNavProvider>
      <div
        {...mergeProps(s.root, className)}
        data-mobile={isMobile ? '' : undefined}
        data-aside={aside ? '' : undefined}
        data-has-top-nav={topNav ? '' : undefined}
        data-has-side-nav={sideNav ? '' : undefined}
        data-layout={layout === 'alt' ? 'alt' : undefined}
        data-side-nav-collapsed={sideNavCollapsed ? '' : undefined}
        data-aside-collapsed={asideCollapsed ? '' : undefined}
        data-header-hidden={effectiveHeaderHidden ? '' : undefined}
        data-header-offset={headerOffset ? '' : undefined}
        ref={ref as Ref<HTMLDivElement>}
      >
        <a href={`#${APP_SHELL_MAIN_ID}`} {...mergeProps(s.skipLink)}>
          Skip to content
        </a>
        {banner ? <div {...mergeProps(s.banner)}>{banner}</div> : null}
        <div {...mergeProps(s.frame)}>
          {topNav ? <header {...mergeProps(s.topNav)}>{topNav}</header> : null}
          {sideNav ? <div {...mergeProps(s.sideNav)}>{sideNav}</div> : null}
          <main id={APP_SHELL_MAIN_ID} {...mergeProps(s.main)} ref={mainRef}>
            {children}
          </main>
          {aside ? <aside {...mergeProps(s.aside)}>{aside}</aside> : null}
        </div>
        {mobileNav}
      </div>
    </MobileNavProvider>
  );
}
