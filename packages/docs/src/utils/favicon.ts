const faviconTypes: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  ico: 'image/x-icon',
  webp: 'image/webp',
};

/** Resolve `varDocs({ favicon })` to `<link rel="icon">` attributes, or `null` when unset. */
export function faviconLink(
  favicon: string | undefined,
  base = '/',
): { href: string; type: string | undefined } | null {
  if (!favicon) return null;
  const href =
    favicon.startsWith('/') && !favicon.startsWith('//')
      ? `${base.replace(/\/$/, '')}${favicon}`
      : favicon;
  const extension = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(favicon)?.[1]?.toLowerCase();
  return { href, type: extension ? faviconTypes[extension] : undefined };
}
