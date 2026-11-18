import { z } from 'astro/zod';

/** Shared frontmatter for guide-style MDX pages. */
export const guideFrontmatterSchema = z.object({
  /** Page title — required. */
  title: z.string().min(1),
  /** Short description for SEO / cards; also the hero lead. */
  description: z.string().optional(),
  /** Hero eyebrow above the title. Defaults to the route's section name. */
  eyebrow: z.string().optional(),
  /**
   * Layout template.
   * - `guide` — standard article with optional sidebar/TOC (default)
   * - `splash` — wider layout without section sidebar (reserved)
   */
  template: z.enum(['guide', 'splash']).default('guide'),
  /** When false, DocsPage suppresses the auto TOC. */
  tableOfContents: z.boolean().optional().default(true),
  /** Extra search terms for the docs search (words the page covers but its title and headings don't say). */
  keywords: z.array(z.string()).optional(),
  /** Wider article column (e.g. Colors / Shadows token grids). */
  wide: z.boolean().optional().default(false),
});

export type GuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;

/**
 * Starlight-style factory for the `docs` collection schema.
 * Usage: `schema: docsSchema()`
 */
export function docsSchema() {
  return guideFrontmatterSchema;
}

/**
 * Starlight-style factory for the `theming` collection schema.
 * Alias of {@link docsSchema} — kept for Var UI docs dogfood; not a privileged
 * collection type. Guide-only sites can use `docsSchema()` for every collection.
 * Usage: `schema: themingSchema()`
 */
export function themingSchema() {
  return guideFrontmatterSchema;
}
