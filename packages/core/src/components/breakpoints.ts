import { breakpoint } from '../runtime';
import { designBreakpoints } from '../tokens/defaults/breakpoint';

/** Breakpoint names used by `AppShell` for `data-mobile` / `matchMedia`. */
export type AppShellMobileBreakpointName = Exclude<keyof typeof designBreakpoints, 'xl'>;

/** `AppShell` `mobileBreakpoint` prop, including `'none'` to disable mobile layout. */
export type AppShellMobileBreakpoint = AppShellMobileBreakpointName | 'none';

const toMatchMediaQuery = (mediaKey: `@media ${string}`) => mediaKey.slice('@media '.length);

/** `matchMedia` conditions for `AppShell` mobile layout, derived from TypeStyles breakpoints. */
export const appShellMobileBreakpointQueries = {
  sm: toMatchMediaQuery(breakpoint('sm', 'max')),
  md: toMatchMediaQuery(breakpoint('md', 'max')),
  lg: toMatchMediaQuery(breakpoint('lg', 'max')),
  none: 'not all',
} as const satisfies Record<AppShellMobileBreakpoint, string>;

/** Breakpoint names used by `LayoutPanel.responsive.below` for `matchMedia`. */
export type LayoutBreakpoint = 'sm' | 'md' | 'lg';

/** `matchMedia` conditions for `LayoutPanel` responsive `overlay`/`hidden` modes. */
export const layoutBreakpointQueries = {
  sm: appShellMobileBreakpointQueries.sm,
  md: appShellMobileBreakpointQueries.md,
  lg: appShellMobileBreakpointQueries.lg,
} as const satisfies Record<LayoutBreakpoint, string>;
