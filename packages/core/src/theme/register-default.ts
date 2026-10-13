import type { CreateTokenValues, Theme, ThemeOverrideInput } from 'typestyles';
import { defaultTokens } from '../tokens/preset';
import type { DesignThemeTokenValues } from '../tokens/types';
import { createDesignTheme } from './create-theme';
import type { DesignTheme, DesignThemeComponentOverrideContext } from './types';
import { DEFAULT_THEME_NAME } from './constants';

type DefaultThemeTokenTree = {
  [K in keyof typeof defaultTokens]: CreateTokenValues;
};

const defaultThemeTokens = defaultTokens as unknown as DefaultThemeTokenTree;

type DefaultThemeComponents = Record<
  string,
  | Record<string, unknown>
  | ((ctx: DesignThemeComponentOverrideContext<DefaultThemeTokenTree>) => Record<string, unknown>)
>;

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
export let defaultTheme: DefaultThemeSurface = createDefaultThemeSurface();

/** Re-register the built-in default theme (e.g. after TypeStyles `reset()` in tests). */
export function registerDefaultTheme(): void {
  defaultTheme = createDefaultThemeSurface();
}

export type DefaultTheme = DefaultThemeSurface;
