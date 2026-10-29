type StyleValue = string | object | null | undefined;

/**
 * Merges recipe-computed inline CSS (custom properties, sizes) with a caller's
 * `style` (Astro accepts a string or an object). The caller's declarations come
 * last so they win.
 */
export function mergeInlineStyle(
  base: Record<string, string> | undefined,
  user: StyleValue,
): StyleValue {
  if (!base || Object.keys(base).length === 0) return user;
  if (typeof user === 'string') {
    const head = Object.entries(base)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
    return `${head};${user}`;
  }
  return { ...base, ...user };
}
