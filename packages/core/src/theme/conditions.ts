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

const explicitDark = tsWhen.or(
  tsWhen.attr(COLOR_MODE_ATTRIBUTE, 'dark', { scope: 'ancestor' }),
  tsWhen.attr(COLOR_MODE_ATTRIBUTE, 'dark', { scope: 'self' }),
);
const explicitLight = tsWhen.or(
  tsWhen.attr(COLOR_MODE_ATTRIBUTE, 'light', { scope: 'ancestor' }),
  tsWhen.attr(COLOR_MODE_ATTRIBUTE, 'light', { scope: 'self' }),
);

/** OS dark when the document root is not explicitly light. Nested pins use {@link atDarkMode}. */
const systemDark = tsWhen.and(
  tsWhen.not(tsWhen.attr(COLOR_MODE_ATTRIBUTE, 'light', { scope: 'ancestor' })),
  tsWhen.prefersDark,
);

/** Canonical `ThemeCondition` presets for var-ui color mode and a11y media queries. */
const themeWhen = {
  /** Explicit `data-color-mode="dark"` or system dark when the root is not pinned to light. */
  colorModeResolvedDark: tsWhen.or(explicitDark, systemDark),
  colorModeExplicitDark: explicitDark,
  colorModeExplicitLight: explicitLight,
  colorModeSystemDark: tsWhen.and(
    tsWhen.not(tsWhen.attr(COLOR_MODE_ATTRIBUTE, 'light', { scope: 'ancestor' })),
    tsWhen.not(tsWhen.attr(COLOR_MODE_ATTRIBUTE, 'dark', { scope: 'ancestor' })),
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
 * Dark styles for a component slot. An explicit `data-color-mode` on the component
 * or an ancestor wins over the OS preference, including a light pin inside an OS-dark page.
 */
export function atDarkMode(style: VariantOptionStyle) {
  const pinnedDark = `[${COLOR_MODE_ATTRIBUTE}="dark"]`;
  const pinnedLight = `[${COLOR_MODE_ATTRIBUTE}="light"]`;
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
  match: (condition: ThemeCondition, style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(condition, style, id),
};
