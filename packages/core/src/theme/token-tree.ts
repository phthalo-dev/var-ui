import type { CreateTokenValues, SyntaxRef } from 'typestyles';

export type ThemeTokenTree = Record<string, CreateTokenValues>;

/**
 * Value tree as TypeStyles sees it: declared token refs (`SyntaxRef` leaves) are accepted at
 * runtime and serialize to `var(--…)` strings, but `CreateTokenValues` has no `SyntaxRef` leaf, so
 * they are typed as `string` where the tree is handed to `Theme<E>`.
 */
export type StringifyTokenRefs<T> = T extends string | number
  ? T
  : T extends SyntaxRef<string>
    ? string
    : T extends { readonly [key: string]: unknown }
      ? { readonly [K in keyof T]: StringifyTokenRefs<T[K]> }
      : string;

/** `T` as a TypeStyles token tree (refs stringified), or the open tree when `T` is not one. */
export type ThemeTokensOf<T> =
  StringifyTokenRefs<T> extends infer S extends ThemeTokenTree ? S : ThemeTokenTree;
