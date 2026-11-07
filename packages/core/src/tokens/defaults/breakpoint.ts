import type { DesignTokens } from '../types';

/** Breakpoint widths — also wired into TypeStyles `breakpoints` in `runtime.ts`. */
export const breakpoint = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} satisfies DesignTokens['breakpoint'];

export const designBreakpoints = breakpoint;
