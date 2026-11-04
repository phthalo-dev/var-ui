import { generateGeometricScale } from 'typestyles/token-scale';
import type { DesignTokens } from '../types';

const FONT_SIZE_STEPS = [-2, -1, 0, 1, 2, 3, 4] as const;
const FONT_SIZE_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
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

export const fontSize = zipRem(FONT_SIZE_NAMES, fontSizeScale) satisfies DesignTokens['fontSize'];
