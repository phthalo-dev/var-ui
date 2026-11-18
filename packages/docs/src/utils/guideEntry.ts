import { getEntry } from 'astro:content';
import config from 'virtual:var-docs/config';
import { matchGuideRoute, resolveGuideRouteConfig } from './routing';

/**
 * Whether a guide entry exists for `pathname`. Call it in the page frontmatter and return a 404
 * `Response` there: `DocsGuidePage` is a child component, and a child can't change the status
 * once the page has started streaming (Astro throws `ResponseSentError`).
 */
export async function guideEntryExists(pathname: string): Promise<boolean> {
  const matched = matchGuideRoute(pathname, resolveGuideRouteConfig(config.routes));
  if (!matched) return false;
  return Boolean(await getEntry(matched.collection, matched.id));
}
