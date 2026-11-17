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
