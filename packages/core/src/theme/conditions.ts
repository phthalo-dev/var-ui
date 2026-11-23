import {
  conditional,
  type ConditionalOverride,
  type ThemeCondition,
  toMediaAtRuleKey,
  type VariantOptionStyle,
} from 'typestyles';
import { typestyles } from '../runtime';
import { COLOR_MODE_ATTRIBUTE } from './constants';

const tsWhen = typestyles.tokens.when;

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const forcedColorsQuery = '(forced-colors: active)';
const moreContrastQuery = '(prefers-contrast: more)';

/** Attribute selectors for an explicit color-mode pin — the one source for both condition APIs below. */
const pinnedDark = `[${COLOR_MODE_ATTRIBUTE}="dark"]`;
const pinnedLight = `[${COLOR_MODE_ATTRIBUTE}="light"]`;

const attrPinned = (value: 'dark' | 'light') =>
  tsWhen.or(
    tsWhen.attr(COLOR_MODE_ATTRIBUTE, value, { scope: 'ancestor' }),
    tsWhen.attr(COLOR_MODE_ATTRIBUTE, value, { scope: 'self' }),
  );

/**
 * `ThemeCondition` presets for theme-root and `override()` conditions, anchored on the
 * document root. Recipe slots use {@link atDarkMode}, which also honors nested pins.
 */
const themeWhen = {
  /** Explicit `data-color-mode="dark"` or system dark when the root is not pinned to light. */
  colorModeResolvedDark: tsWhen.or(
    attrPinned('dark'),
    tsWhen.and(
      tsWhen.not(tsWhen.attr(COLOR_MODE_ATTRIBUTE, 'light', { scope: 'ancestor' })),
      tsWhen.prefersDark,
    ),
  ),
  colorModeExplicitLight: attrPinned('light'),
  reducedMotion: tsWhen.media(reducedMotionQuery),
  forcedColors: tsWhen.media(forcedColorsQuery),
  moreContrast: tsWhen.media(moreContrastQuery),
} as const;

/**
 * Reduced-motion styles for keyframe animations — spread into a style object.
 * Durations and `transition` tokens already collapse under reduced motion, so recipes that only
 * use tokens need nothing; use this to stop `animation: …` loops (spinner, skeleton, pulse).
 * Only one `atReducedMotion` per style object (a second spread replaces the first).
 *
 * It cannot override a property an animation is driving: animated values beat normal
 * declarations in the cascade, so `atReducedMotion({ transform: 'none' })` leaves a sliding
 * `@keyframes` sliding. Swap the animation instead, to `animation: 'none'` or to a fade-only twin
 * from {@link reducedMotionKeyframes}:
 *
 * ```ts
 * const stops = { from: { opacity: 0, translate: '0 0.5rem' }, to: { opacity: 1, translate: '0' } };
 * const enter = keyframes.create('bar-enter', stops);
 * const enterFade = keyframes.create('bar-enter-fade', reducedMotionKeyframes(stops));
 * // in a recipe:
 * { animationName: enter, ...atReducedMotion({ animationName: enterFade }) }
 * ```
 */
export function atReducedMotion(style: VariantOptionStyle) {
  return typestyles.atRuleBlock(toMediaAtRuleKey(reducedMotionQuery), style);
}

/** Properties that move, resize or turn an element: dropped by {@link reducedMotionKeyframes}. */
const MOTION_PROPERTIES = new Set([
  'transform',
  'translate',
  'rotate',
  'scale',
  'offsetPath',
  'offsetDistance',
  'offsetRotate',
  'offset-path',
  'offset-distance',
  'offset-rotate',
]);

/**
 * The reduced-motion twin of a set of keyframe stops: the same stops without `transform`,
 * `translate`, `rotate`, `scale` or motion-path properties. Opacity, color and the rest stay, so
 * an enter animation becomes a plain fade. Pair it with {@link atReducedMotion} (see there).
 */
export function reducedMotionKeyframes<S extends Record<string, Record<string, unknown>>>(
  stops: S,
): { [K in keyof S]: Partial<S[K]> } {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [stop, declarations] of Object.entries(stops)) {
    out[stop] = Object.fromEntries(
      Object.entries(declarations).filter(([property]) => !MOTION_PROPERTIES.has(property)),
    );
  }
  return out as { [K in keyof S]: Partial<S[K]> };
}

/**
 * Windows High Contrast / `forced-colors: active` styles — spread into a style object.
 * The browser replaces author colors with system colors (`CanvasText`, `Highlight`, …) and drops
 * `box-shadow` and background images, so state or boundaries drawn only that way need an
 * explicit `border`/`outline` here. Only one per style object.
 */
export function atForcedColors(style: VariantOptionStyle) {
  return typestyles.atRuleBlock(toMediaAtRuleKey(forcedColorsQuery), style);
}

/** `prefers-contrast: more` styles — spread into a style object. Only one per style object. */
export function atMoreContrast(style: VariantOptionStyle) {
  return typestyles.atRuleBlock(toMediaAtRuleKey(moreContrastQuery), style);
}

/**
 * Dark styles for a component slot. An explicit `data-color-mode` on the component
 * or an ancestor wins over the OS preference, including a light pin inside an OS-dark page.
 */
export function atDarkMode(style: VariantOptionStyle) {
  // Two keys, not one `A &, &B` list: TypeStyles appends nested `& child` selectors only to
  // the last item of a list parent, so the first item matched the host itself
  // (phthalo-dev/typestyles#335).
  return {
    [`${pinnedDark} &`]: style,
    [`&${pinnedDark}`]: style,
    '@media (prefers-color-scheme: dark)': {
      [`&:not(${pinnedLight}):not(${pinnedLight} *)`]: style,
    },
  };
}

/** Build a `conditions` entry for `override()` — prefer `{ light, dark }` on color properties when possible. */
export const when = {
  dark: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.colorModeResolvedDark, style, id),
  light: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.colorModeExplicitLight, style, id),
  reducedMotion: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.reducedMotion, style, id),
  forcedColors: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.forcedColors, style, id),
  moreContrast: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.moreContrast, style, id),
  match: (condition: ThemeCondition, style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(condition, style, id),
};
