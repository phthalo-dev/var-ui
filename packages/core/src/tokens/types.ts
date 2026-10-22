import type { InferValuesFromSchema, ModeAwareTokenLeaf } from 'typestyles';
import type { tokenSchema } from './schema';

/** Require every key from a schema-derived token value tree (for default registration). */
type RequiredTokenValues<S> =
  S extends Record<string, unknown> ? { [K in keyof S]-?: RequiredTokenValues<S[K]> } : S;

/** Schema-aware partial token values (mode-aware `{ light, dark }` leaves on scalars). */
export type DesignTokenPatch<T> = T extends string | number
  ? ModeAwareTokenLeaf | T
  : T extends readonly (infer U)[]
    ? readonly DesignTokenPatch<U>[]
    : T extends object
      ? { [K in keyof T]?: DesignTokenPatch<T[K]> }
      : T;

type ThemeOverridableNamespace = Exclude<keyof DesignTokens, 'stroke'>;

/**
 * Canonical Var UI token tree — derived from `tokenSchema` so new schema keys
 * surface as type errors in `defaults/` until values are registered.
 */
export type DesignTokens = RequiredTokenValues<InferValuesFromSchema<typeof tokenSchema>>;

/** Semantic color tokens — palette ramps are registered separately. */
export type SemanticColorTokens = Omit<DesignTokens['color'], 'palette'>;

/** Partial color namespace values for generators and theme patches (mode-aware leaves allowed). */
export type ColorTokenPatch = DesignTokenPatch<DesignTokens['color']>;

/** Partial built-in namespace overrides for `createDesignTheme({ tokens })` / `Theme.override`. */
export type DesignThemeTokenValues = {
  [K in ThemeOverridableNamespace]?: DesignTokenPatch<DesignTokens[K]>;
};

export type {
  DeepPartialTokenValues,
  DeepPartialThemeTokens,
  ThemeModeDefinition,
  ThemeOverrideInput,
} from 'typestyles';
