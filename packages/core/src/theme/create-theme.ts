import type { CreateTokenValues } from 'typestyles';
import { registerFontFace } from '../fonts/register-font-face';
import { typestyles } from '../runtime';
import { themeTokenRefs, withTokenRefs } from './token-refs';
import type { ThemeTokenTree, ThemeTokensOf } from './token-tree';
import { REDUCED_MOTION_MODE_ID, reducedMotionMode } from './reduced-motion';
import type { DesignTheme, DesignThemeComponentPatch, DesignThemeCreateConfig } from './types';

type DesignThemeComponents<T extends Record<string, unknown>> = Record<
  string,
  DesignThemeComponentPatch<T>
>;

/**
 * Compile a TypeStyles theme surface (`tokens`, `modes`, optional `components`).
 * Light/dark values belong on mode-aware token leaves (`{ light, dark }`).
 * Fork child themes with {@link DesignTheme.override} on a parent theme (e.g. `defaultTheme`).
 */
export function createDesignTheme<const T extends Record<string, unknown> = Record<string, never>>(
  config: DesignThemeCreateConfig & {
    tokens?: T;
    components?: DesignThemeComponents<T>;
  },
): DesignTheme<ThemeTokensOf<T>> {
  const { fonts, name, tokens: tokenOverrides, modes, components, replace } = config;

  for (const face of fonts ?? []) {
    registerFontFace(face);
  }

  const refs = themeTokenRefs(tokenOverrides);
  const surface = typestyles.tokens.createTheme({
    name,
    replace: replace ?? true,
    // Defaults use `designTokens.*.var` (SyntaxRef); TypeStyles theme tokens are CreateTokenValues.
    tokens: tokenOverrides,
    // Every theme zeroes durations under prefers-reduced-motion unless it supplies its own mode.
    modes: modes?.some((mode) => mode.id === REDUCED_MOTION_MODE_ID)
      ? modes
      : [reducedMotionMode, ...(modes ?? [])],
    components: withTokenRefs(components, refs),
  } as Parameters<typeof typestyles.tokens.createTheme>[0]);

  return {
    ...surface,
    // `{ name, var }` refs for every namespace (TypeStyles' own `tokens` are `var()` strings).
    tokens: refs as DesignTheme<ThemeTokensOf<T>>['tokens'],
  } as DesignTheme<ThemeTokensOf<T>>;
}

/**
 * Drop a runtime design theme surface (tokens + themed recipe overrides).
 * Avoid theme names where one is a prefix of another (e.g. `dark` and `dark-mode`) — TypeStyles
 * invalidation keys are prefix-based; prefer distinct names until upstream uses boundary-safe matching.
 */
export function disposeDesignTheme(name: string): void {
  typestyles.tokens.disposeTheme(name, { removeLiveCss: true });
}
