import { color } from 'typestyles/color';
import { typestyles } from '@var-ui/core';
import { COLOR_MODE_ATTRIBUTE } from '@var-ui/core/theme-constants';

/** Perceptual mix with page background — neo-brutalist palette themes in this folder. */
const shadowOffsetLightAlpha = 0.5;

export function neoBrutalistShadowOffsetLight(subtleBackground: string): string {
  return color.alpha(subtleBackground, shadowOffsetLightAlpha, 'oklch');
}

export function neoBrutalistBorderDarkDefault(hue: number): string {
  return color.oklch('40%', 0.02, hue);
}

export function neoBrutalistBorderDarkStrong(hue: number): string {
  return color.oklch('54%', 0.026, hue);
}

export function neoBrutalistShadowOffsetDark(hue: number): string {
  return color.oklch('6.5%', 0.035, hue);
}

export function neoBrutalistShadowValues(shadowColor: string) {
  return {
    xs: `0.0625rem 0.0625rem 0 0 ${shadowColor}`,
    sm: `0.125rem 0.125rem 0 0 ${shadowColor}`,
    md: `0.1875rem 0.1875rem 0 0 ${shadowColor}`,
    lg: `0.25rem 0.25rem 0 0 ${shadowColor}`,
    xl: `0.3125rem 0.3125rem 0 0 ${shadowColor}`,
  } as const;
}

export const resolvedDarkColorModeWhen = typestyles.tokens.when.or(
  typestyles.tokens.when.attr(COLOR_MODE_ATTRIBUTE, 'dark', { scope: 'self' }),
  typestyles.tokens.when.and(
    typestyles.tokens.when.not(
      typestyles.tokens.when.attr(COLOR_MODE_ATTRIBUTE, 'light', { scope: 'self' }),
    ),
    typestyles.tokens.when.prefersDark,
  ),
);
