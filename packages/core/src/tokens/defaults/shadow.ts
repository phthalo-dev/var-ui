import { tokens } from '../declare';
import type { DesignTokens } from '../types';

/** Mode-aware shadow tint derived from primary text. */
function shadowTint(opacity: number): string {
  return `color-mix(in oklch, ${tokens.color.text.primary.var} ${opacity}%, transparent)`;
}

type ShadowLayer = {
  x: number;
  y: number;
  blur: number;
  tint: number;
};

/**
 * Layered box-shadow stack with a consistent top-left light source.
 * Vertical offset is 2× horizontal; blur matches vertical offset per layer.
 * @see https://www.joshwcomeau.com/css/designing-shadows/
 */
function layeredShadow(layers: readonly ShadowLayer[]): string {
  return layers
    .map(({ x, y, blur, tint }) => `${x}px ${y}px ${blur}px ${shadowTint(tint)}`)
    .join(', ');
}

/** Compound box-shadow tokens — the one shadow scale; use directly as `box-shadow` values. */
export const shadow = {
  xs: layeredShadow([{ x: 0.5, y: 1, blur: 2, tint: 8 }]),
  sm: layeredShadow([
    { x: 0.5, y: 1, blur: 2, tint: 8 },
    { x: 1, y: 2, blur: 4, tint: 8 },
  ]),
  md: layeredShadow([
    { x: 1, y: 2, blur: 2, tint: 8 },
    { x: 2, y: 4, blur: 4, tint: 8 },
    { x: 3, y: 6, blur: 6, tint: 8 },
  ]),
  lg: layeredShadow([
    { x: 1, y: 2, blur: 2, tint: 7 },
    { x: 2, y: 4, blur: 4, tint: 7 },
    { x: 4, y: 8, blur: 8, tint: 7 },
    { x: 8, y: 16, blur: 16, tint: 7 },
  ]),
  xl: layeredShadow([
    { x: 1, y: 2, blur: 2, tint: 6 },
    { x: 2, y: 4, blur: 4, tint: 6 },
    { x: 4, y: 8, blur: 8, tint: 6 },
    { x: 8, y: 16, blur: 16, tint: 6 },
    { x: 16, y: 32, blur: 32, tint: 6 },
  ]),
} satisfies DesignTokens['shadow'];
