import * as core from '@var-ui/core';

const slugToCamel = (slug: string) => slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** Components whose recipe export isn't their slug in camelCase. */
const RECIPE_FOR_SLUG: Record<string, string> = { text: 'textBlock', 'icon-button': 'button' };

/**
 * Variant defaults (`recipe.defaults`) of a component slug's core recipe, keyed by prop name, in
 * the props tables' type style (`"md"`, `false`). The props extractor merges these into the
 * generated props data, so the docs tables, the Markdown views and the CLI all show them (#193).
 */
export function getRecipeDefaults(slug: string): Record<string, string> {
  const camel = slugToCamel(slug);
  const names = RECIPE_FOR_SLUG[slug] ? [RECIPE_FOR_SLUG[slug], camel] : [camel, slug];
  for (const name of names) {
    const recipe = (core as Record<string, unknown>)[name];
    if (typeof recipe !== 'function') continue;
    const defaults = (recipe as { defaults?: Record<string, unknown> }).defaults;
    if (!defaults) continue;
    return Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [
        key,
        typeof value === 'string' ? `"${value}"` : String(value),
      ]),
    );
  }
  return {};
}
