import type { ShowcaseThemeId } from '@/themes/presets';

export type ThemePlaygroundViewport = 'desktop' | 'mobile';

export type ThemePlaygroundFontFamilyId = 'body' | 'display' | 'mono';
export type ThemePlaygroundTypeScale = '1.125' | '1.2' | '1.25' | '1.333';
export type ThemePlaygroundBaseSize = 'sm' | 'md' | 'lg' | 'xl';
export type ThemePlaygroundSpacingPreset = 'compact' | 'default' | 'comfortable' | 'gigantic';

export type ThemePlaygroundColorOverrides = Record<string, string>;

export type ThemePlaygroundTypography = {
  headingFont: ThemePlaygroundFontFamilyId;
  bodyFont: ThemePlaygroundFontFamilyId;
  typeScale: ThemePlaygroundTypeScale;
  baseSize: ThemePlaygroundBaseSize;
};

export type ThemePlaygroundState = {
  presetId: ShowcaseThemeId;
  viewport: ThemePlaygroundViewport;
  colors: ThemePlaygroundColorOverrides;
  typography: ThemePlaygroundTypography;
  spacingPreset: ThemePlaygroundSpacingPreset;
};

export const DEFAULT_THEME_PLAYGROUND_TYPOGRAPHY: ThemePlaygroundTypography = {
  headingFont: 'display',
  bodyFont: 'body',
  typeScale: '1.2',
  baseSize: 'md',
};

export const DEFAULT_THEME_PLAYGROUND_STATE: ThemePlaygroundState = {
  presetId: 'default',
  viewport: 'desktop',
  colors: {},
  typography: DEFAULT_THEME_PLAYGROUND_TYPOGRAPHY,
  spacingPreset: 'default',
};
