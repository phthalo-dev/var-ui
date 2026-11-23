/** The attribute naming a disclosure for {@link persistDisclosures}. */
export const DISCLOSURE_ID_ATTRIBUTE = 'data-section-id';

/**
 * Remembers which `<details>` disclosures inside `root` the reader opened or closed, in
 * `localStorage` under `storageKey`. Framework-agnostic: `SideNav persistKey` (React and Astro)
 * uses it for collapsible sections.
 *
 * - A disclosure takes part when it has a `data-section-id` (the section's `id`, or its title).
 * - On init each one is set to its stored state. One that holds the current page
 *   (`[aria-current="page"]`) always stays open, so the reader never lands inside a closed group.
 * - Every later `toggle` is written back. Without storage (private mode), state isn't remembered.
 *
 * Returns a cleanup that removes the listeners.
 */
export function persistDisclosures(root: ParentNode, storageKey: string): () => void {
  const read = (): Record<string, boolean> => {
    try {
      const parsed: unknown = JSON.parse(globalThis.localStorage?.getItem(storageKey) ?? '{}');
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  };
  const write = (state: Record<string, boolean>) => {
    try {
      globalThis.localStorage?.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Storage unavailable or full: open state just isn't remembered.
    }
  };

  const stored = read();
  const cleanups: Array<() => void> = [];
  root
    .querySelectorAll<HTMLDetailsElement>(`details[${DISCLOSURE_ID_ATTRIBUTE}]`)
    .forEach((details) => {
      const id = details.getAttribute(DISCLOSURE_ID_ATTRIBUTE) ?? '';
      const holdsCurrent = details.querySelector('[aria-current="page"]') != null;
      if (holdsCurrent) details.open = true;
      else if (id in stored) details.open = Boolean(stored[id]);
      const onToggle = () => write({ ...read(), [id]: details.open });
      details.addEventListener('toggle', onToggle);
      cleanups.push(() => details.removeEventListener('toggle', onToggle));
    });
  return () => cleanups.forEach((cleanup) => cleanup());
}
