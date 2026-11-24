import { z } from 'zod';

const TopNavItemSchema = z
  .object({
    text: z.string(),
    link: z.string(),
    match: z.string().optional(),
    external: z.boolean().optional(),
    icon: z.string().optional(),
    iconOnly: z.boolean().optional(),
  })
  .refine((item) => !item.iconOnly || Boolean(item.icon), {
    message: '`iconOnly` top nav items need an `icon`',
    path: ['iconOnly'],
  });

const SidebarItemSchema = z.object({
  text: z.string(),
  link: z.string(),
});

const SidebarSectionSchema = z.object({
  title: z.string(),
  items: z.array(SidebarItemSchema),
});

const ColorModeSchema = z
  .object({
    default: z.enum(['light', 'dark', 'system']).optional().default('system'),
    storageKey: z.string().optional().default('theme-mode'),
  })
  .optional();

/**
 * Theme config — same `createDesignTheme()` model as apps.
 * `syntax: 'design-tokens'` (default) wires Shiki to semantic `color.code.*` vars
 * so fenced code tracks presets + color mode.
 */
export const VarDocsThemePresetSchema = z.object({
  /** Stable id used in localStorage and `/themes/{id}.css`. */
  id: z.string().min(1),
  /** Label in the theme picker. */
  label: z.string().min(1),
  /** `createDesignTheme().className` applied to `<html>`. */
  className: z.string().min(1),
  /** Optional swatch color for the picker. */
  swatch: z.string().optional(),
  /**
   * When true, CSS is loaded from `/themes/{id}.css` (lazy).
   * Defaults to `false` for the first preset / id `default`, otherwise `true`.
   */
  lazyCss: z.boolean().optional(),
  /**
   * Typestyles extract entry relative to the Astro project root.
   * Defaults to `typestyles-themes/{id}.ts` when `lazyCss` is effective.
   */
  entry: z.string().optional(),
});

export const VarDocsThemeConfigSchema = z.object({
  /** Class on `<html>` for SSR first paint (`ThemeScript`). */
  defaultClassName: z.string().min(1),
  colorMode: ColorModeSchema,
  /**
   * Shiki theme for MDX fenced blocks.
   * `'design-tokens'` (default) → semantic `color.code.*` CSS variables from
   * the active design theme.
   * Pass a Shiki theme object only when opting out of token-driven highlighting.
   */
  syntax: z
    .union([z.literal('design-tokens'), z.record(z.string(), z.unknown())])
    .optional()
    .default('design-tokens'),
  /**
   * Showcase / brand presets for the floating picker + lazy CSS extract.
   * Omit for sites that only use `defaultClassName` (no picker).
   */
  presets: z.array(VarDocsThemePresetSchema).optional(),
  /** localStorage key for the selected preset id. */
  storageKey: z.string().min(1).optional().default('docs-theme-id'),
});

export const VarDocsTypestylesConfigSchema = z.object({
  /**
   * CSS extraction entry relative to the Astro project root
   * (e.g. `'typestyles-entry.ts'`).
   */
  entry: z.string().min(1),
  /**
   * Optional glob of theme preset modules for per-preset lazy CSS (Phase 5).
   */
  extractPresets: z.string().optional(),
});

const RouteMapEntrySchema = z.object({
  /** URL prefix without trailing slash, e.g. `'/docs'`. */
  prefix: z.string().min(1),
  /** Astro content collection name. */
  collection: z.string().min(1),
});

/**
 * Free-form named guide routes. Keys are labels only — matching uses
 * `prefix` + `collection`. No privileged `theming` (or other) key in core.
 *
 * @example
 * ```ts
 * { docs: { prefix: '/docs', collection: 'docs' } }
 * { docs: { … }, theming: { prefix: '/theming', collection: 'theming' } }
 * { guides: { prefix: '/guides', collection: 'guides' } }
 * ```
 */
export const VarDocsRoutesConfigSchema = z.record(z.string(), RouteMapEntrySchema).optional();

export const VarDocsComponentsConfigSchema = z
  .object({
    /**
     * Layout wrapper for guide pages (typically the site `BaseLayout.astro`).
     * Path is relative to the Astro project root or an absolute file URL/path.
     */
    Layout: z.string().min(1),
    /**
     * Optional module exporting MDX shortcode components
     * (e.g. `{ ColorSwatches, CssVariableReference }`).
     */
    mdxComponents: z.string().optional(),
  })
  .optional();

export const VarDocsUserConfigSchema = z.object({
  /** Site title — used in `<title>` and header when no logo. */
  title: z.string().min(1),
  /**
   * Favicon URL that `DocsPage` and `DocsMarketingPage` emit in `<head>` (and `DocsFavicon` for
   * site layouts that render their own `<head>`). Root-relative paths get the Astro `base`.
   * The `type` is taken from the extension (`.svg`, `.png`, `.ico`). Omit for no favicon link.
   * @example '/favicon.svg'
   */
  favicon: z.string().min(1).optional(),
  /** Top navigation items (maps to TopNav). Optional in Phase 2. */
  topNav: z.array(TopNavItemSchema).optional(),
  /** Sidebar sections. Optional in Phase 2 (site still computes per-route). */
  sidebar: z.array(SidebarSectionSchema).optional(),
  /** Docs chrome + syntax (Var UI theming DX). */
  theme: VarDocsThemeConfigSchema,
  /** typestyles build integration. */
  typestyles: VarDocsTypestylesConfigSchema,
  /**
   * Free-form URL prefix → collection mapping for the injected guide catch-all.
   * Default when omitted: `{ docs: { prefix: '/docs', collection: 'docs' } }`.
   */
  routes: VarDocsRoutesConfigSchema,
  /**
   * Override shell components. Phase 3 requires `Layout` for injected guide routes.
   */
  components: VarDocsComponentsConfigSchema,
  /**
   * When true, skip injecting guide catch-all routes from `routes`
   * (site provides its own pages).
   */
  disableGuideRoutes: z.boolean().optional().default(false),
  /** Disable injected stub middleware (site may provide its own). */
  disableMiddleware: z.boolean().optional().default(false),
  /**
   * Sibling `.md` URLs, `/llms.txt`, and the DocsPage markdown link.
   * Default true. Pass `false` to opt out, or an object for extra prefixes
   * (e.g. `/components`) and an optional `llms.txt` tagline.
   */
  markdownViews: z
    .union([
      z.boolean(),
      z.object({
        extraPrefixes: z.array(z.string().min(1)).optional(),
        tagline: z.string().optional(),
      }),
    ])
    .optional()
    .default(true),
});

export type VarDocsUserConfig = z.input<typeof VarDocsUserConfigSchema>;
export type VarDocsConfig = z.output<typeof VarDocsUserConfigSchema>;

export function parseVarDocsConfig(input: unknown): VarDocsConfig {
  return VarDocsUserConfigSchema.parse(input);
}
