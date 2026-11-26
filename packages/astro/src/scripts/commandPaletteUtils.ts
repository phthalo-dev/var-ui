import type { IconName } from '@var-ui/core';
import { matchCommandItem, rankCommandItems } from '@var-ui/core/shared/commandSearch';

export type CommandPaletteItem = {
  /** Stable item key. Also used as the destination URL when `href` is not provided. */
  id: string;
  title: string;
  /** Muted one-line subtitle under the title (also searched). */
  meta?: string;
  keywords?: string[];
  /** Section headings inside the item (a page's h2/h3s): searched, and a match is the subtitle. */
  headings?: string[];
  group?: string;
  /** Leading type icon (page, component, theme…), resolved from the icon registry. */
  icon?: IconName;
  /** Explicit destination URL. When set, `id` is used only as the stable item key. */
  href?: string;
};

/** An item as serialized for the client script: the icon resolved to SVG markup. */
export type CommandPaletteClientItem = Omit<CommandPaletteItem, 'icon'> & { iconSvg?: string };

export type CommandPaletteGroup<T = CommandPaletteItem> = {
  id: string;
  label: string;
  items: T[];
};

export function matchCommandPaletteItem(
  item: Pick<CommandPaletteItem, 'title' | 'meta' | 'keywords' | 'headings'>,
  query: string,
): boolean {
  return matchCommandItem(item, query);
}

/**
 * Items matching `query`, ranked by relevance (exact title > title prefix > title word-start >
 * keyword > description > section heading > mid-word title); groups are ordered by their best hit, so the first
 * item is the top hit. An empty query keeps the original order.
 */
export function filterCommandPaletteItems<
  T extends Pick<CommandPaletteItem, 'title' | 'meta' | 'keywords' | 'headings' | 'group'>,
>(items: ReadonlyArray<T>, query: string): T[] {
  return rankCommandItems(items, query);
}

export function groupCommandPaletteResults<T extends Pick<CommandPaletteItem, 'group' | 'title'>>(
  items: ReadonlyArray<T>,
): CommandPaletteGroup<T>[] {
  const hasGroups = items.some((item) => item.group);
  if (!hasGroups) {
    return items.length > 0 ? [{ id: 'default', label: '', items: [...items] }] : [];
  }

  const order: string[] = [];
  const buckets = new Map<string, T[]>();

  for (const item of items) {
    const label = item.group ?? 'Other';
    if (!buckets.has(label)) {
      buckets.set(label, []);
      order.push(label);
    }
    buckets.get(label)!.push(item);
  }

  return order.map((label) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    items: buckets.get(label)!,
  }));
}

export function flattenCommandPaletteGroups<T>(groups: ReadonlyArray<CommandPaletteGroup<T>>): T[] {
  return groups.flatMap((group) => group.items);
}

export function moveCommandPaletteActiveIndex(
  activeIndex: number,
  length: number,
  direction: 'up' | 'down',
): number {
  if (length <= 0) return -1;
  if (activeIndex < 0) return direction === 'down' ? 0 : length - 1;
  if (direction === 'down') return (activeIndex + 1) % length;
  return (activeIndex - 1 + length) % length;
}

const RECENT_LIMIT = 5;

/** Ids remembered under `key` (most recent first); `[]` when storage is unavailable. */
export function readRecentCommandPaletteIds(key: string): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/** Remember `id` as the most recent choice under `key` (deduped, capped at five). */
export function rememberCommandPaletteId(key: string, id: string): string[] {
  const next = [id, ...readRecentCommandPaletteIds(key).filter((entry) => entry !== id)].slice(
    0,
    RECENT_LIMIT,
  );
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // History is a convenience only.
  }
  return next;
}
