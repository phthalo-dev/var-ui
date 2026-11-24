import type { TopNavItem } from '../types';

/**
 * The `match` prefix that selects a header link on `currentPath`: the longest one that prefixes
 * it, so `/docs/changelog/…` selects `Changelog` (`/docs/changelog`) and not also `Docs`
 * (`/docs`). `undefined` when none matches. Empty matches never match.
 */
export function selectedTopNavMatch(
  matches: Iterable<string | undefined>,
  currentPath: string,
): string | undefined {
  let best: string | undefined;
  for (const match of matches) {
    if (!match || !currentPath.startsWith(match)) continue;
    if (best === undefined || match.length > best.length) best = match;
  }
  return best;
}

/** Link attributes for a header item: external items open in a new tab. */
export function topNavLinkAttributes(item: TopNavItem): {
  target?: '_blank';
  rel?: string;
} {
  return item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}
