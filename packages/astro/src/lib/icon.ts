import type { IconName } from '@var-ui/core';
import { defaultIconSvgs } from '@var-ui/icons/glyphs';

/**
 * An icon in a data-driven Astro API (menu items, segmented control options): a registry name
 * (`'colorModeDark'`) or SVG markup, e.g. a glyph from `@var-ui/icons/glyphs/<name>`:
 *
 * ```ts
 * import { svg as gridSvg } from '@var-ui/icons/glyphs/grid';
 * const options = [{ value: 'grid', label: 'Grid', icon: { svg: gridSvg } }];
 * ```
 *
 * The data counterpart of a named slot: slots can't be generated in a `.map()` (Astro hoists
 * slot content out of the callback), so per-option content has to travel with the data.
 */
export type AstroIcon = IconName | { svg: string };

const registry: Record<string, string> = defaultIconSvgs;

/** SVG markup for an {@link AstroIcon}. Throws on an unknown name, so a typo fails the build. */
export function iconMarkup(icon: AstroIcon): string {
  if (typeof icon !== 'string') return icon.svg;
  const svg = registry[icon];
  if (svg === undefined) {
    throw new Error(
      `[var-ui] Unknown icon "${icon}". Use a registry name (${Object.keys(registry).join(', ')}) or pass { svg } markup.`,
    );
  }
  return svg;
}
