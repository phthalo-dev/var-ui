import type { CreateTokenValues, Theme, ThemeOverrideInput } from 'typestyles';
import { defaultTokens } from '../tokens/preset';
import type { DesignThemeTokenValues } from '../tokens/types';
import { createDesignTheme } from './create-theme';
import type { ThemeTokensOf } from './token-tree';
import type { DesignTheme, DesignThemeComponentPatch } from './types';
import { DEFAULT_THEME_NAME } from './constants';

type DefaultThemeTokenTree = ThemeTokensOf<typeof defaultTokens>;

// Declared token refs are valid theme leaves (TypeStyles 0.37), so the default tree is typed as is.
// The `override` input is still narrowed with `as` below: Var UI patches allow partial
// `{ light }` / `{ dark }` mode leaves.
const defaultThemeTokens = defaultTokens;

type DefaultThemeComponents = Record<string, DesignThemeComponentPatch<DefaultThemeTokenTree>>;

type NamespaceMap = Record<string, CreateTokenValues>;
/** No added namespaces. Not `Record<string, never>`: its index signature would intersect `app` to `never`. */
type NoNamespaces = Record<never, never>;

/** Input for forking {@link defaultTheme} — Var UI token patches + TypeStyles override fields. */
export type DefaultThemeOverrideInput<X extends NamespaceMap = NoNamespaces> = {
  name: string;
  replace?: boolean;
  /** Patches for existing namespaces. */
  tokens?: DesignThemeTokenValues;
  /** New namespaces (e.g. `app`) on this child theme, typed on its `.tokens` as `{ name, var }` refs. */
  extend?: X;
  modes?: ThemeOverrideInput<DefaultThemeTokenTree>['modes'];
  components?: DefaultThemeComponents;
};

/**
 * Built-in default theme — TypeStyles `Theme` with a Var UI-typed `.override()`.
 * (`DesignTheme.override` is too strict against SyntaxRef leaves in `tokenValues`.)
 * `X` collects the namespaces added with `extend` along the chain of child themes.
 */
export type DefaultThemeSurface<X extends NamespaceMap = NoNamespaces> = Omit<
  DesignTheme<DefaultThemeTokenTree & X>,
  'override'
> & {
  override<const Y extends NamespaceMap = NoNamespaces>(
    input: DefaultThemeOverrideInput<Y>,
  ): DefaultThemeSurface<X & Y>;
};

function bindDefaultOverride<X extends NamespaceMap>(
  surface: Theme<DefaultThemeTokenTree & X>,
): DefaultThemeSurface<X> {
  return {
    ...surface,
    tokens: (surface.tokens ?? undefined) as DefaultThemeSurface<X>['tokens'],
    override<const Y extends NamespaceMap>(input: DefaultThemeOverrideInput<Y>) {
      return bindDefaultOverride<X & Y>(
        surface.override(
          input as Parameters<Theme<DefaultThemeTokenTree & X>['override']>[0],
        ) as unknown as Theme<DefaultThemeTokenTree & X & Y>,
      );
    },
  } as DefaultThemeSurface<X>;
}

function createDefaultThemeSurface(): DefaultThemeSurface {
  return bindDefaultOverride<NoNamespaces>(
    createDesignTheme({
      name: DEFAULT_THEME_NAME,
      tokens: defaultThemeTokens,
    }),
  );
}

/**
 * Built-in default theme surface (`theme-var-ui-default`).
 * Fork child themes with `defaultTheme.override({ name, tokens, extend, … })`.
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
