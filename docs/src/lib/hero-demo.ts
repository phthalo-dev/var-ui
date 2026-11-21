import { DEMO_IDS, type DemoId } from '../demos/registry';

/**
 * Hero picks for components without a `<slug>.default` demo, where the alphabetically first
 * demo isn't the best one.
 */
const HERO_OVERRIDES: Partial<Record<string, DemoId | null>> = {
  'toggle-group': 'toggle-group.single',
};

/** Page-scale components (shells, layouts) or invisible ones have no hero preview. */
const NO_HERO = new Set([
  'app-shell',
  'layout',
  'layout-panel',
  'splitter',
  'top-nav',
  'top-nav-mega-menu',
  'side-nav',
  'chat-layout',
  'portal',
  'visually-hidden',
  'hidden',
  'aspect-ratio',
  'grid',
  'stack',
  'center',
  'section',
  'scroll-area',
  'loading-overlay',
]);

/** The demo shown live in a component page's hero band, if any. */
export function heroDemoId(slug: string): DemoId | undefined {
  if (NO_HERO.has(slug)) return undefined;
  const override = HERO_OVERRIDES[slug];
  if (override !== undefined) return override ?? undefined;
  const ids = DEMO_IDS.filter((id) => id.startsWith(`${slug}.`));
  return ids.find((id) => id.endsWith('.default')) ?? ids[0];
}
