import type { CreateTokenValues } from 'typestyles';

export type ThemeTokenTree = Record<string, CreateTokenValues>;

/**
 * Value tree as TypeStyles sees it. Declared token refs are valid `CreateTokenValues` leaves, so
 * a default tree built from `designTokens.*` needs no stringifying workaround.
 */
export type ThemeTokensOf<T> = T extends ThemeTokenTree ? T : ThemeTokenTree;
