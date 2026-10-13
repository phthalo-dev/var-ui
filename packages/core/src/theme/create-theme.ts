import type { CreateTokenValues } from 'typestyles';
import { registerFontFace } from '../fonts/register-font-face';
import { typestyles } from '../runtime';
import { designTokens } from '../tokens';
import type {
  DesignTheme,
  DesignThemeComponentOverrideContext,
  DesignThemeCreateConfig,
} from './types';

type ThemeTokenTree = Record<string, CreateTokenValues>;

type DesignThemeComponents<T extends Record<string, unknown>> = Record<
  string,
  | Record<string, unknown>
  | ((ctx: DesignThemeComponentOverrideContext<T>) => Record<string, unknown>)
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
): DesignTheme<T & ThemeTokenTree> {
  const { fonts, name, tokens: tokenOverrides, modes, components, replace } = config;

  for (const face of fonts ?? []) {
    registerFontFace(face);
  }

  const surface = typestyles.tokens.createTheme({
    name,
    replace: replace ?? true,
    // Defaults use `designTokens.*.var` (SyntaxRef); TypeStyles theme tokens are CreateTokenValues.
    tokens: tokenOverrides,
    modes,
    components,
  } as Parameters<typeof typestyles.tokens.createTheme>[0]);

  return {
    ...surface,
    tokens: (surface.tokens ?? designTokens) as DesignTheme<T & ThemeTokenTree>['tokens'],
  } as DesignTheme<T & ThemeTokenTree>;
}

/**
 * Drop a runtime design theme surface (tokens + themed recipe overrides).
 * Avoid theme names where one is a prefix of another (e.g. `dark` and `dark-mode`) — TypeStyles
 * invalidation keys are prefix-based; prefer distinct names until upstream uses boundary-safe matching.
 */
export function disposeDesignTheme(name: string): void {
  typestyles.tokens.disposeTheme(name, { removeLiveCss: true });
}
