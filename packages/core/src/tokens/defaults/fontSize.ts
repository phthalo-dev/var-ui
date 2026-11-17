import { generateGeometricScale } from 'typestyles/token-scale';
import type { DesignTokens } from '../types';

const FONT_SIZE_STEPS = [-2, -1, 0, 1, 2, 3, 4] as const;
const FONT_SIZE_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const;
const fontSizeScale = generateGeometricScale({
  base: 14,
  ratio: 1.2,
  steps: [...FONT_SIZE_STEPS],
});

function zipRem<T extends string>(
  names: readonly T[],
  values: number[],
): Record<T, `${number}rem`> {
  return Object.fromEntries(
    names.map((name, index) => [name, `${(values[index] ?? 0) / 16}rem`]),
  ) as Record<T, `${number}rem`>;
}

export const fontSize = {
  ...zipRem(FONT_SIZE_NAMES, fontSizeScale),
  // Legibility floor: the geometric scale puts the two smallest steps at ~9.7px and
  // ~11.7px, too small for captions, badges and mono labels. Pin them to 12px / 13px.
  xs: '0.75rem',
  sm: '0.8125rem',
  /**
   * Fluid display sizes for headlines. They grow with the viewport between a
   * mobile floor and a desktop ceiling, so marketing type needs no breakpoints.
   */
  display: {
    sm: 'clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem)',
    md: 'clamp(2.25rem, 1.5rem + 2.6vw, 3.5rem)',
    lg: 'clamp(2.75rem, 1.6rem + 4.4vw, 4.75rem)',
  },
} satisfies DesignTokens['fontSize'];
