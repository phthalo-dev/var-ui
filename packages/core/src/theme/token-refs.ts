import { designTokens } from '../tokens';
import { tokenSchema } from '../tokens/schema';
import type { DesignThemeComponentPatch } from './types';

/** A token reference: the custom property `name` and its `var()`, same shape as `designTokens`. */
export type TokenRef = { readonly name: string; readonly var: string };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** `{ light, dark }` (any subset): one token whose value follows the color mode. */
const isModeLeaf = (value: Record<string, unknown>) =>
  Object.keys(value).length > 0 &&
  Object.keys(value).every((key) => key === 'light' || key === 'dark') &&
  Object.values(value).every((entry) => typeof entry !== 'object');

const ref = (name: string): TokenRef => ({ name, var: `var(${name})` });

function refTree(values: Record<string, unknown>, prefix: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    const name = `${prefix}-${key}`;
    out[key] = isPlainObject(value) && !isModeLeaf(value) ? refTree(value, name) : ref(name);
  }
  return out;
}

/**
 * The token refs of a theme: built-in namespaces are `designTokens`, custom ones (`app`, `brand`,
 * …) are built from the theme's own values with the same `{ name, var }` leaves, so a recipe
 * writes `t.space.md.var` and `t.app.heroCover.var` alike (#230). TypeStyles itself hands themes
 * `var(--…)` strings.
 */
export function themeTokenRefs(values: Record<string, unknown> | undefined): unknown {
  const custom: Record<string, unknown> = {};
  for (const [namespace, tree] of Object.entries(values ?? {})) {
    if (namespace in tokenSchema || !isPlainObject(tree)) continue;
    custom[namespace] = refTree(tree, `--var-ui-${namespace}`);
  }
  return new Proxy(custom, {
    get: (target, key) =>
      typeof key === 'string' && key in target
        ? target[key]
        : (designTokens as unknown as Record<string | symbol, unknown>)[key],
  });
}

/**
 * Theme `components` factories receive TypeStyles' context, whose `tokens` are `var(--…)`
 * strings. Hand them the theme's refs instead, matching the factory types.
 */
export function withTokenRefs<C extends Record<string, unknown> | undefined>(
  components: C,
  tokens: unknown,
): C {
  if (!components) return components;
  const out: Record<string, unknown> = {};
  for (const [namespace, patch] of Object.entries(components)) {
    const p = patch as DesignThemeComponentPatch<Record<string, unknown>> & {
      styles?: unknown;
    };
    out[namespace] =
      typeof p?.styles === 'function'
        ? {
            ...p,
            styles: (ctx: Record<string, unknown>) =>
              (p.styles as (c: unknown) => unknown)({ ...ctx, tokens }),
          }
        : patch;
  }
  return out as C;
}
