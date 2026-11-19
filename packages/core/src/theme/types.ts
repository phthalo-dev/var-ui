import type {
  CreateTokenValues,
  InferThemeTokensFromConfig,
  Theme,
  ThemeComponentsFor,
} from 'typestyles';
import type { FontFaceDefinition } from '../fonts/types';
import type { DesignThemeTokenValues, ThemeModeDefinition } from '../tokens/types';

type DesignTokenRefs = typeof import('../tokens/declare').tokens;

/**
 * Create-theme config. `tokens` is intentionally open so default trees that use
 * `designTokens.*.var` (SyntaxRef) remain assignable; {@link createDesignTheme} casts
 * at the TypeStyles boundary.
 */
export type DesignThemeCreateConfig = {
  name: string;
  replace?: boolean;
  tokens?: Record<string, unknown>;
  modes?: ThemeModeDefinition[];
  fonts?: FontFaceDefinition[];
};

export type CustomNamespacesFromTokenMap<Tokens> =
  Tokens extends Record<string, unknown>
    ? Omit<Tokens, keyof DesignThemeTokenValues>
    : Record<string, never>;

/** Custom `tokens` namespaces from a theme config (excludes built-in design namespaces). */
export type InferCustomThemeTokens<C extends DesignThemeCreateConfig> = C extends {
  tokens: infer Tok extends Record<string, unknown>;
}
  ? CustomNamespacesFromTokenMap<Tok>
  : Record<string, never>;

/** A token reference, the same shape as every `designTokens` leaf. */
export type TokenRef = { readonly name: string; readonly var: string };

/** `{ name, var }` refs for a custom token tree; `{ light, dark }` leaves are one token. */
export type TokenRefsOf<T> = T extends string | number
  ? TokenRef
  : T extends { light?: string | number; dark?: string | number }
    ? keyof T extends 'light' | 'dark'
      ? TokenRef
      : { readonly [K in keyof T]: TokenRefsOf<T[K]> }
    : T extends Record<string, unknown>
      ? { readonly [K in keyof T]: TokenRefsOf<T[K]> }
      : TokenRef;

/**
 * Declared design token refs plus custom namespaces from `createDesignTheme({ tokens })`, all with
 * `{ name, var }` leaves (`t.space.md.var`, `t.app.heroCover.var`).
 * Hoist custom token maps into a leaf module for override factories (avoids `typeof theme.tokens` cycles).
 */
export type DesignThemeTokens<E extends Record<string, unknown> = Record<string, never>> =
  DesignTokenRefs & {
    readonly [K in keyof E & string]: TokenRefsOf<E[K]>;
  };

/** Context passed to theme `components` factories — full design token refs + custom namespaces. */
/** Partial CSS for one recipe inside a theme `components` entry. Slots nest under `base`. */
export type DesignThemeComponentStylePatch = {
  base?: Record<string, unknown>;
  variants?: Record<string, Record<string, unknown>>;
  compoundVariants?: ReadonlyArray<{
    variants: Record<string, unknown>;
    style: Record<string, unknown>;
  }>;
};

export type DesignThemeComponentOverrideContext<
  E extends Record<string, unknown> = Record<string, never>,
> = {
  readonly tokens: DesignThemeTokens<CustomNamespacesFromTokenMap<E>>;
  readonly theme: DesignTheme<
    E extends Record<string, CreateTokenValues> ? E : Record<string, never>
  >;
  /** Refs for vars the recipe declared. */
  readonly vars: { readonly [key: string]: { readonly name: string; readonly var: string } };
};

/** One theme `components` entry: reassign `vars`, restyle with `styles`. */
export type DesignThemeComponentPatch<E extends Record<string, unknown> = Record<string, never>> = {
  vars?: Record<string, unknown>;
  styles?:
    | DesignThemeComponentStylePatch
    | ((ctx: DesignThemeComponentOverrideContext<E>) => DesignThemeComponentStylePatch);
};

/**
 * Theme returned by {@link createDesignTheme} / {@link DesignTheme.override}.
 * `E` is the full `tokens` map (TypeStyles) so `.override()` patches are closed against that tree.
 */
export type DesignTheme<E extends Record<string, CreateTokenValues> = Record<string, never>> =
  Theme<E> & {
    tokens: DesignThemeTokens<CustomNamespacesFromTokenMap<E>>;
  };

/** Config input aligned with TypeStyles `createTheme` + optional `fonts`. */
export type DesignThemeConfig = DesignThemeCreateConfig &
  ThemeComponentsFor<{ tokens: Record<string, CreateTokenValues> }>;

export type { InferThemeTokensFromConfig, ThemeComponentsFor };
