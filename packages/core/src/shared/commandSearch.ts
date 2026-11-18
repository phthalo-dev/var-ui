import { findTextMatch } from './textMatch';

/** The fields a command palette searches. `meta` is the visible subtitle (a description). */
export type CommandSearchFields = {
  title: string;
  meta?: string;
  keywords?: ReadonlyArray<string>;
  group?: string;
};

/**
 * How strongly an item matched the query, best first. Ranking compares tiers only; items in the
 * same tier keep their original order.
 */
export const commandMatchTier = {
  exactTitle: 6,
  titlePrefix: 5,
  titleWordStart: 4,
  titleSubstring: 3,
  keyword: 2,
  meta: 1,
} as const;

export type CommandMatchTier = (typeof commandMatchTier)[keyof typeof commandMatchTier];

function isWordChar(char: string | undefined): boolean {
  return char !== undefined && /[\p{L}\p{N}]/u.test(char);
}

/** Whether `q` occurs in `text` at the start of a word (after a non-letter/digit or a camelCase hump). */
function matchesAtWordStart(text: string, lower: string, q: string): boolean {
  for (let at = lower.indexOf(q, 1); at > 0; at = lower.indexOf(q, at + 1)) {
    const before = text[at - 1];
    const char = text[at];
    if (!isWordChar(before)) return true;
    if (char && char !== char.toLowerCase() && before === before!.toLowerCase()) return true;
  }
  return false;
}

/**
 * Scores `item` against `query`: exact title > title prefix > title word-start > title substring >
 * keyword > description (`meta`). Returns `null` when nothing matches, and `0` for an empty query
 * (everything matches equally).
 */
export function scoreCommandItem(
  item: CommandSearchFields,
  query: string,
): CommandMatchTier | 0 | null {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const title = item.title.toLowerCase();
  if (title === q) return commandMatchTier.exactTitle;
  if (title.startsWith(q)) return commandMatchTier.titlePrefix;
  if (matchesAtWordStart(item.title, title, q)) return commandMatchTier.titleWordStart;
  if (title.includes(q)) return commandMatchTier.titleSubstring;
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))) {
    return commandMatchTier.keyword;
  }
  if (item.meta?.toLowerCase().includes(q)) return commandMatchTier.meta;
  return null;
}

/** Whether `item` matches `query` at all (title, keywords or description). */
export function matchCommandItem(item: CommandSearchFields, query: string): boolean {
  return scoreCommandItem(item, query) !== null;
}

/**
 * Filters `items` to those matching `query` and orders them by relevance: items are sorted by
 * score within their `group`, and groups by their best hit, so the first item is the top hit.
 * Ties keep the original order. An empty query returns every item in its original order.
 *
 * Pass `isMatch` to replace the default match test; items it accepts that do not score are ranked
 * last (in original order).
 */
export function rankCommandItems<T extends CommandSearchFields>(
  items: ReadonlyArray<T>,
  query: string,
  isMatch?: (item: T, query: string) => boolean,
): T[] {
  if (!query.trim()) return isMatch ? items.filter((item) => isMatch(item, query)) : [...items];

  type Scored = { item: T; score: number };
  const groups = new Map<string, { best: number; first: number; entries: Scored[] }>();
  items.forEach((item, index) => {
    const tier = scoreCommandItem(item, query);
    if (isMatch ? !isMatch(item, query) : tier === null) return;
    const score = tier ?? 0;
    const key = item.group ?? '';
    const group = groups.get(key);
    if (group) {
      group.entries.push({ item, score });
      group.best = Math.max(group.best, score);
    } else {
      groups.set(key, { best: score, first: index, entries: [{ item, score }] });
    }
  });

  return [...groups.values()]
    .sort((a, b) => b.best - a.best || a.first - b.first)
    .flatMap((group) =>
      // `sort` is stable, so equal scores keep their original order.
      group.entries.sort((a, b) => b.score - a.score).map((entry) => entry.item),
    );
}

/** Characters of context kept before a description match when the snippet is cut. */
const SNIPPET_LEAD = 24;

/**
 * The subtitle to show for `item` under `query`. When the item matched only in its description
 * (not its title or keywords) and the match sits past the start, the text is cut to begin shortly
 * before the match (at a word boundary, with a leading `…`) so the highlighted match is not lost
 * to truncation. Otherwise returns `meta` unchanged.
 */
export function commandMetaSnippet(item: CommandSearchFields, query: string): string | undefined {
  const { meta } = item;
  if (!meta || scoreCommandItem(item, query) !== commandMatchTier.meta) return meta;
  const match = findTextMatch(meta, query);
  if (!match || match[0] <= SNIPPET_LEAD) return meta;
  let start = match[0] - SNIPPET_LEAD;
  // Begin at the next word so the snippet does not open mid-word.
  const space = meta.slice(start, match[0]).search(/\s\S/);
  if (space >= 0) start += space + 1;
  return `…${meta.slice(start)}`;
}
