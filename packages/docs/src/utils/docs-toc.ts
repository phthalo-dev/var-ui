export const DOCS_TOC_CONTENT_SELECTOR = '.docs-article';
/** Headings inside a live demo (`data-prose-isolate`, e.g. an open dialog title) are not page sections. */
export const DOCS_TOC_HEADING_SELECTOR =
  'h2[id]:not([data-prose-isolate] *), h3[id]:not([data-prose-isolate] *)';

export function normalizeDocsPath(path: string): string {
  return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
}

export type DocsTocOptions = {
  /**
   * Guide URL prefixes that should show the auto TOC.
   * Defaults to `/docs` (core kit); pass every configured `routes.*.prefix`.
   */
  guidePrefixes?: readonly string[];
  /**
   * Exact paths that should also show TOC (e.g. a component catalog index).
   * Defaults to none — catalog indexes are consumer/plugin concerns.
   */
  extraPaths?: readonly string[];
};

const DEFAULT_GUIDE_PREFIXES = ['/docs'] as const;

/** Whether the standard docs TOC should render in DocsPage for this path. */
export function shouldShowDocsToc(path: string, options?: DocsTocOptions): boolean {
  const normalized = normalizeDocsPath(path);

  if (normalized === '/') return false;
  if (normalized.startsWith('/playground')) return false;
  if (normalized.startsWith('/dev')) return false;
  // Component detail pages typically render TOC inside their own chrome.
  if (normalized.startsWith('/components/')) return false;

  const extraPaths = options?.extraPaths ?? [];
  if (extraPaths.some((p) => normalizeDocsPath(p) === normalized)) {
    return true;
  }

  const prefixes = options?.guidePrefixes ?? DEFAULT_GUIDE_PREFIXES;
  return prefixes.some((prefix) => {
    const p = normalizeDocsPath(prefix);
    return normalized === p || normalized.startsWith(`${p}/`);
  });
}
