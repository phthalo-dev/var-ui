import type { DemoId, DemoSnippets } from './types';
import { keyByDemoId } from './demoPath';

export type { DemoId, DemoSnippets } from './types';

/**
 * Code samples for every demo, from `src/demos/<component>/<name>/snippets.ts`. Each folder
 * also holds `react.tsx` (required) and, when the demo has a static preview, `astro.astro` and
 * `html.ts`: see `reactDemoMap`, `astroDemoMap` and `htmlDemoMap`.
 */
export const demoSnippets = keyByDemoId(
  import.meta.glob<DemoSnippets>('./*/*/snippets.ts', { eager: true, import: 'snippets' }),
) as Record<DemoId, DemoSnippets>;

/** Every demo id, sorted (component, then demo name). */
export const DEMO_IDS = (Object.keys(demoSnippets) as DemoId[]).sort();

/** The snippets for `id`, or a clear error naming the folder to add. */
export function getDemoSnippets(id: string): DemoSnippets {
  const snippets = demoSnippets[id as DemoId];
  if (!snippets) {
    throw new Error(
      `Unknown demo "${id}": add src/demos/${id.replace('.', '/')}/ with snippets.ts and react.tsx`,
    );
  }
  return snippets;
}
