import type { DesignTokens } from '../types';

/** Breakpoint widths — also wired into TypeStyles `breakpoints` in `runtime.ts`. */
export const breakpoint = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  /** Wide desktop (1440px): room for content beside a centered column. */
  xxl: '90rem',
} satisfies DesignTokens['breakpoint'];

export const designBreakpoints = breakpoint;

/**
 * The same widths as explicit mobile-first media conditions, for TypeStyles `breakpoints`. The
 * tokens stay bare lengths (they are widths, not queries); TypeStyles warns when it has to guess
 * the feature of a bare value.
 */
export const designBreakpointConditions = Object.fromEntries(
  Object.entries(breakpoint).map(([name, width]) => [name, `(min-width: ${width})`]),
) as { readonly [K in keyof typeof breakpoint]: `(min-width: ${(typeof breakpoint)[K]})` };
