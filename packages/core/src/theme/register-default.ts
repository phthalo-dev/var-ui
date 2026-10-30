import type { CreateTokenValues, Theme, ThemeOverrideInput } from 'typestyles';
import { defaultTokens } from '../tokens/preset';
import type { DesignThemeTokenValues } from '../tokens/types';
import { createDesignTheme } from './create-theme';
import type { DesignTheme, DesignThemeComponentPatch } from './types';
import { DEFAULT_THEME_NAME } from './constants';

type DefaultThemeTokenTree = {
  [K in keyof typeof defaultTokens]: CreateTokenValues;
};

// TypeStyles' CreateTokenValues rejects SyntaxRef leaves (declared token refs); upstream gap, see
// audit/detail/typestyles-upstream.md. The cast is confined to these two spots.
const defaultThemeTokens = defaultTokens as unknown as DefaultThemeTokenTree;

type DefaultThemeComponents = Record<string, DesignThemeComponentPatch<DefaultThemeTokenTree>>;

/** Input for forking {@link defaultTheme} — Var UI token patches + TypeStyles override fields. */
export type DefaultThemeOverrideInput = {
  name: string;
  replace?: boolean;
  tokens?: DesignThemeTokenValues;
  modes?: ThemeOverrideInput<DefaultThemeTokenTree>['modes'];
  components?: DefaultThemeComponents;
};

/**
 * Built-in default theme — TypeStyles `Theme` with a Var UI-typed `.override()`.
 * (`DesignTheme.override` is too strict against SyntaxRef leaves in `tokenValues`.)
 */
export type DefaultThemeSurface = Omit<DesignTheme<DefaultThemeTokenTree>, 'override'> & {
  override(input: DefaultThemeOverrideInput): DefaultThemeSurface;
};

function bindDefaultOverride(surface: Theme<DefaultThemeTokenTree>): DefaultThemeSurface {
  return {
    ...surface,
    tokens: (surface.tokens ?? undefined) as DefaultThemeSurface['tokens'],
    override(input: DefaultThemeOverrideInput): DefaultThemeSurface {
      return bindDefaultOverride(
        surface.override(input as ThemeOverrideInput<DefaultThemeTokenTree>),
      );
    },
  } as DefaultThemeSurface;
}

function createDefaultThemeSurface(): DefaultThemeSurface {
  return bindDefaultOverride(
    createDesignTheme({
      name: DEFAULT_THEME_NAME,
      tokens: defaultThemeTokens,
    }) as unknown as Theme<DefaultThemeTokenTree>,
  );
}

/**
 * Built-in default theme surface (`theme-var-ui-default`).
 * Fork child themes with `defaultTheme.override({ name, tokens, … })`.
 */
export const defaultTheme: DefaultThemeSurface = createDefaultThemeSurface();

/**
 * Re-emit the built-in default theme's CSS (e.g. after TypeStyles `reset()` in tests).
 * `defaultTheme` itself is stable: its class name and `override()` do not depend on the emit.
 */
export function registerDefaultTheme(): void {
  createDefaultThemeSurface();
}

export type DefaultTheme = DefaultThemeSurface;
