import { tokens as designTokens } from './declare';
import { tokenValues } from './preset';

/** A colour token's default per mode; other tokens have one value. */
export type ModeAwareTokenValue = { light?: string | number; dark?: string | number };

export type DesignTokenEntry = {
  /** Dot path on `designTokens` (`space.md`, `color.text.primary`). */
  path: string;
  /** The CSS custom property (`--var-ui-space-md`). */
  cssVar: string;
  /** `var(--…)` reference, the same string as `designTokens.<path>.var`. */
  ref: string;
  /** The built-in default (`tokenValues`); colours carry `{ light, dark }`. */
  value: string | number | ModeAwareTokenValue;
};

type TokenRef = { var: string };

function isTokenRef(value: unknown): value is TokenRef {
  // `designTokens` groups are proxies that answer any key; only leaves carry a string `var`.
  return (
    value != null &&
    typeof value === 'object' &&
    'var' in value &&
    typeof (value as { var: unknown }).var === 'string'
  );
}

function isModeAwareValue(value: unknown): value is ModeAwareTokenValue {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return (
    keys.length > 0 &&
    keys.every((key) => key === 'light' || key === 'dark') &&
    Object.values(value).every((entry) => typeof entry === 'string' || typeof entry === 'number')
  );
}

function walk(
  values: Record<string, unknown>,
  refs: Record<string, unknown>,
  path: string[],
  out: DesignTokenEntry[],
): void {
  for (const [key, value] of Object.entries(values)) {
    const ref = refs[key];
    const nextPath = [...path, key];
    const isLeafValue =
      typeof value === 'string' || typeof value === 'number' || isModeAwareValue(value);
    if (isLeafValue && isTokenRef(ref)) {
      out.push({
        path: nextPath.join('.'),
        cssVar: ref.var.replace(/^var\((.+)\)$/, '$1'),
        ref: ref.var,
        value: value as DesignTokenEntry['value'],
      });
    } else if (value != null && typeof value === 'object' && ref != null) {
      walk(value as Record<string, unknown>, ref as Record<string, unknown>, nextPath, out);
    }
  }
}

/**
 * Every built-in design token with its CSS variable and default value, in schema order.
 * `designTokens` itself is a proxy (any path type-checks against the schema but it has no
 * enumerable keys), so use this to list, search or document tokens at runtime.
 *
 * ```ts
 * listDesignTokens().filter((token) => token.path.startsWith('space.'));
 * // [{ path: 'space.none', cssVar: '--var-ui-space-none', ref: 'var(--var-ui-space-none)', value: '0' }, …]
 * ```
 */
export function listDesignTokens(): DesignTokenEntry[] {
  const out: DesignTokenEntry[] = [];
  walk(
    tokenValues as unknown as Record<string, unknown>,
    designTokens as unknown as Record<string, unknown>,
    [],
    out,
  );
  return out;
}
