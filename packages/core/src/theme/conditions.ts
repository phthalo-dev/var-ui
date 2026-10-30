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
 */
export function atReducedMotion(style: VariantOptionStyle) {
  return typestyles.atRuleBlock(toMediaAtRuleKey(reducedMotionQuery), style);
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
  return {
    [`${pinnedDark} &, &${pinnedDark}`]: style,
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
