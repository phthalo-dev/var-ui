import {
  conditional,
  type ConditionalOverride,
  resolvedDarkWhen,
  type ThemeCondition,
  toMediaAtRuleKey,
  type VariantOptionStyle,
} from 'typestyles';
import { typestyles } from '../runtime';

const tsWhen = typestyles.tokens.when;
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

/** Canonical `ThemeCondition` presets for var-ui color mode and a11y media queries. */
const themeWhen = {
  /** Explicit `data-mode="dark"` or system dark when not pinned to light. */
  colorModeResolvedDark: resolvedDarkWhen('data-mode', 'ancestor'),
  colorModeExplicitDark: tsWhen.attr('data-mode', 'dark', { scope: 'ancestor' }),
  colorModeExplicitLight: tsWhen.attr('data-mode', 'light', { scope: 'ancestor' }),
  colorModeSystemDark: tsWhen.and(
    tsWhen.not(tsWhen.attr('data-mode', 'light', { scope: 'ancestor' })),
    tsWhen.not(tsWhen.attr('data-mode', 'dark', { scope: 'ancestor' })),
    tsWhen.prefersDark,
  ),
  reducedMotion: tsWhen.media(reducedMotionQuery),
} as const;

/** `@media` key for reduced motion — internal; prefer {@link atReducedMotion}. */
const reducedMotionAtRule = toMediaAtRuleKey(reducedMotionQuery);

/** Reduced-motion styles for variant slots — spread into a style object. */
export function atReducedMotion(style: VariantOptionStyle) {
  return typestyles.atRuleBlock(reducedMotionAtRule, style);
}

/**
 * Resolved dark-mode styles for component recipe slots — spread into a style object.
 * Uses TypeStyles `when` + {@link themeWhen.colorModeResolvedDark}.
 */
export function atDarkMode(style: VariantOptionStyle) {
  return typestyles.when(themeWhen.colorModeResolvedDark, style);
}

/** Build a `conditions` entry for `override()` — prefer `{ light, dark }` on color properties when possible. */
export const when = {
  dark: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.colorModeResolvedDark, style, id),
  light: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.colorModeExplicitLight, style, id),
  reducedMotion: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.reducedMotion, style, id),
  match: (condition: ThemeCondition, style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(condition, style, id),
};
