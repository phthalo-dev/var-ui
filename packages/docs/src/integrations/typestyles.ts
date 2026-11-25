import typestylesVite from '@typestyles/vite';
import type { Plugin } from 'vite';
import { fileURLToPath } from 'node:url';

/**
 * Stable sheet path, matched by the `<link>` tags in DocsPage /
 * DocsMarketingPage and the theme script's lazy-CSS insertion anchor.
 * `@typestyles/vite` 0.7+ hashes the emitted asset when no `fileName` is set
 * and retargets only Vite HTML inputs via `transformIndexHtml` — Astro SSR
 * pages never run that hook, so the hashed URL would 404 in production.
 */
export const TYPESTYLES_CSS_FILE_NAME = 'typestyles.css';

function resolveDocsStyles(): string {
  return fileURLToPath(import.meta.resolve('@var-ui/docs/styles', import.meta.url));
}

/**
 * Wire `@typestyles/vite` for the configured extraction entry.
 *
 * Always includes `@var-ui/docs/styles` so the docs kit chrome recipes are extracted
 * even when the site entry only imports `@var-ui/core` and `@var-ui/react`.
 */
export function vitePluginVarDocsTypestyles(entry: string): Plugin {
  return typestylesVite({
    mode: 'build',
    extract: {
      modules: [entry, resolveDocsStyles()],
      fileName: TYPESTYLES_CSS_FILE_NAME,
    },
  }) as Plugin;
}
