import type { StylingHooksDoc } from './extract-styling-hooks';

const modules = import.meta.glob('../generated/styling/*.json', {
  eager: true,
}) as Record<string, { default: StylingHooksDoc } | StylingHooksDoc>;

/** Load generated styling hooks for a component slug, or null when it has none. */
export function loadStylingHooks(slug: string): StylingHooksDoc | null {
  const key = Object.keys(modules).find((path) => path.endsWith(`/${slug}.json`));
  if (!key) return null;
  const mod = modules[key]!;
  const doc = 'default' in mod && mod.default ? mod.default : (mod as StylingHooksDoc);
  const hasHooks = doc.slots.length > 0;
  return hasHooks ? doc : null;
}
