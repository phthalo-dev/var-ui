export { cx, combine, mergeProps } from 'typestyles';

/** An Astro `style` attribute value: a declaration string or a style object. */
export type StyleAttribute = string | object | null | undefined;

/**
 * Puts a component's own declarations (recipe custom properties, `aspect-ratio`, …) in front of
 * the caller's `style`, which may be a string or an object. The caller's declarations come last,
 * so they win. Returns `style` unchanged when there is nothing to add.
 *
 * ```astro
 * <div style={withStyle(styleVars([[vars.maxHeight, maxHeight]]), style)} />
 * ```
 */
export function withStyle(
  own: Record<string, string> | undefined,
  style: StyleAttribute,
): StyleAttribute {
  if (!own || Object.keys(own).length === 0) return style;
  if (typeof style === 'string') {
    return [...Object.entries(own).map(([name, value]) => `${name}: ${value}`), style]
      .filter(Boolean)
      .join('; ');
  }
  return { ...own, ...style };
}
