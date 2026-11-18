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
  exactTitle: 11,
  titlePrefix: 10,
  /** At the start of a later word of the title (after a space or punctuation): `Icon button`. */
  titleWordStart: 9,
  /** At a camelCase hump: `IconButton`, `ChatComposer`. */
  titleHump: 8,
  titleSubstring: 7,
  keyword: 6,
  /** The description starts with the query: it is about that thing. */
  metaPrefix: 5,
  metaWordStart: 4,
  meta: 3,
  /**
   * One typo (insertion, deletion, substitution or swap) at the start of the title, for queries
   * of 4+ characters: `buton` → Button. Only counted when nothing matches as typed.
   */
  titleTypoPrefix: 2,
  /** One typo at the start of a later title word: `buton` → IconButton. */
  titleTypo: 1,
} as const;

export type CommandMatchTier = (typeof commandMatchTier)[keyof typeof commandMatchTier];

function isWordChar(char: string | undefined): boolean {
  return char !== undefined && /[\p{L}\p{N}]/u.test(char);
}

function isHump(text: string, at: number): boolean {
  const before = text[at - 1];
  const char = text[at];
  return (
    char !== undefined &&
    char !== char.toLowerCase() &&
    before !== undefined &&
    before === before.toLowerCase() &&
    isWordChar(before)
  );
}

/**
 * Where `q` occurs in `text` past its first character: at the start of a word (after a
 * non-letter/digit), at a camelCase hump, or nowhere at a boundary.
 */
function boundaryMatch(text: string, lower: string, q: string): 'word' | 'hump' | null {
  let hump = false;
  for (let at = lower.indexOf(q, 1); at > 0; at = lower.indexOf(q, at + 1)) {
    if (!isWordChar(text[at - 1])) return 'word';
    if (isHump(text, at)) hump = true;
  }
  return hump ? 'hump' : null;
}

/** Title words, split at spaces/punctuation and camelCase humps, lowercased. */
function titleWords(title: string): string[] {
  const words: string[] = [];
  let word = '';
  for (let i = 0; i < title.length; i++) {
    const char = title[i]!;
    if (!isWordChar(char)) {
      if (word) words.push(word);
      word = '';
      continue;
    }
    if (word && isHump(title, i)) {
      words.push(word);
      word = '';
    }
    word += char;
  }
  if (word) words.push(word);
  return words.map((entry) => entry.toLowerCase());
}

/** Whether `a` and `b` are at most one edit apart (insert, delete, substitute or swap). */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    // Substitution, or a swap of two neighbours.
    if (a.slice(i + 1) === b.slice(i + 1)) return true;
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
  }
  const [longer, shorter] = a.length > b.length ? [a, b] : [b, a];
  return longer.slice(i + 1) === shorter.slice(i);
}

/** Shortest query that gets one-typo tolerance: shorter ones match too much. */
const TYPO_MIN_LENGTH = 4;

/** Index of the first title word that starts with `q` give or take one typo, or `-1`. */
function typoWordIndex(title: string, q: string): number {
  if (q.length < TYPO_MIN_LENGTH || /\s/.test(q)) return -1;
  return titleWords(title).findIndex((word) =>
    [q.length - 1, q.length, q.length + 1].some(
      (length) => length <= word.length && withinOneEdit(q, word.slice(0, length)),
    ),
  );
}

/**
 * Scores `item` against `query`: exact title > title prefix > title word-start > title camelCase
 * hump > title substring > keyword > description prefix > description word-start > description
 * substring > title with one typo. Returns `null` when nothing matches, and `0` for an empty
 * query (everything matches equally).
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
  const titleBoundary = boundaryMatch(item.title, title, q);
  if (titleBoundary === 'word') return commandMatchTier.titleWordStart;
  if (titleBoundary === 'hump') return commandMatchTier.titleHump;
  if (title.includes(q)) return commandMatchTier.titleSubstring;
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))) {
    return commandMatchTier.keyword;
  }
  if (item.meta) {
    const meta = item.meta.toLowerCase();
    if (meta.startsWith(q)) return commandMatchTier.metaPrefix;
    if (meta.includes(q)) {
      return boundaryMatch(item.meta, meta, q) === 'word'
        ? commandMatchTier.metaWordStart
        : commandMatchTier.meta;
    }
  }
  const typoAt = typoWordIndex(item.title, q);
  if (typoAt === 0) return commandMatchTier.titleTypoPrefix;
  if (typoAt > 0) return commandMatchTier.titleTypo;
  return null;
}

function isMetaTier(tier: number | null): boolean {
  return (
    tier === commandMatchTier.metaPrefix ||
    tier === commandMatchTier.metaWordStart ||
    tier === commandMatchTier.meta
  );
}

/** Whether `item` matches `query` at all (title, keywords or description). */
export function matchCommandItem(item: CommandSearchFields, query: string): boolean {
  return scoreCommandItem(item, query) !== null;
}

/**
 * Filters `items` to those matching `query` and orders them by relevance: items are sorted by
 * score within their `group`, and groups by their best hit, so the first item is the top hit.
 * Ties keep the original order. An empty query returns every item in its original order. One-typo
 * title matches are kept only when nothing matched as typed.
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

  // Typo matches only rescue a query that found nothing as typed.
  const exactHit = [...groups.values()].some(
    (group) => group.best > commandMatchTier.titleTypoPrefix,
  );
  return [...groups.values()]
    .map((group) =>
      exactHit && !isMatch
        ? {
            ...group,
            entries: group.entries.filter(
              (entry) => entry.score > commandMatchTier.titleTypoPrefix,
            ),
          }
        : group,
    )
    .filter((group) => group.entries.length > 0)
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
  if (!meta || !isMetaTier(scoreCommandItem(item, query))) return meta;
  const match = findTextMatch(meta, query);
  if (!match || match[0] <= SNIPPET_LEAD) return meta;
  let start = match[0] - SNIPPET_LEAD;
  // Begin at the next word so the snippet does not open mid-word.
  const space = meta.slice(start, match[0]).search(/\s\S/);
  if (space >= 0) start += space + 1;
  return `…${meta.slice(start)}`;
}
