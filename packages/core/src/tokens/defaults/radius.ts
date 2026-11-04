import { generateLinearScale } from 'typestyles/token-scale';
import { tokens } from '../declare';
import type { DesignTokens } from '../types';

const RADIUS_STEPS = [1, 2, 3, 4] as const;
const RADIUS_NAMES = ['sm', 'md', 'lg', 'xl'] as const;
const radiusScale = generateLinearScale({
  base: 2,
  multiplier: 1.25,
  steps: [...RADIUS_STEPS],
});

function zipRem<T extends string>(
  names: readonly T[],
  values: number[],
): Record<T, `${number}rem`> {
  return Object.fromEntries(
    names.map((name, index) => [name, `${(values[index] ?? 0) / 16}rem`]),
  ) as Record<T, `${number}rem`>;
}

export const radius = {
  none: '0',
  ...zipRem(RADIUS_NAMES, radiusScale),
  full: '624rem',
  navItem: tokens.radius.md.var,
} satisfies DesignTokens['radius'];
