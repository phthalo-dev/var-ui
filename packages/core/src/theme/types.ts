import type {
  CreateTokenValues,
  InferThemeTokensFromConfig,
  Theme,
  ThemeComponentsFor,
  TokenRefTree,
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

/** @deprecated Prefer {@link DesignThemeCreateConfig} */
export type DesignThemeConfigFields = DesignThemeCreateConfig & {
  tokens?: Record<string, CreateTokenValues>;
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

/**
 * Declared design token refs plus custom namespaces from `createDesignTheme({ tokens })`.
 * Hoist custom token maps into a leaf module for override factories (avoids `typeof theme.tokens` cycles).
 */
export type DesignThemeTokens<E extends Record<string, unknown> = Record<string, never>> =
  DesignTokenRefs & {
    readonly [K in keyof E & string]: E[K] extends CreateTokenValues
      ? TokenRefTree<E[K]>
      : TokenRefTree<CreateTokenValues>;
  };

/** Context passed to theme `components` factories — full design token refs + custom namespaces. */
export type DesignThemeComponentOverrideContext<
  E extends Record<string, unknown> = Record<string, never>,
> = {
  readonly tokens: DesignThemeTokens<CustomNamespacesFromTokenMap<E>>;
  readonly theme: DesignTheme<
    E extends Record<string, CreateTokenValues> ? E : Record<string, never>
  >;
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

/** @deprecated Use {@link InferCustomThemeTokens} */
export type InferThemeExtendFromConfig<C extends DesignThemeCreateConfig> =
  InferCustomThemeTokens<C>;
