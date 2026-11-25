import { findTextMatch } from './textMatch';

/** The fields a command palette searches. `meta` is the visible subtitle (a description). */
export type CommandSearchFields = {
  title: string;
  meta?: string;
  keywords?: ReadonlyArray<string>;
  /**
   * Section headings inside the item (a page's h2/h3s). A word-start match ranks below the title
   * and description, and the matched heading becomes the subtitle.
   */
  headings?: ReadonlyArray<string>;
  /**
   * The item's full text (a page body). Matched last, at the start of a word (a phrase matches
   * too), and the passage around the match becomes the subtitle. Palettes can fetch it lazily
   * (`searchIndexUrl` on the Astro `CommandPalette`).
   */
  body?: string;
  group?: string;
};

/**
 * How strongly an item matched the query, best first. Ranking compares tiers (one-typo matches
 * also prefer a longer correctly typed prefix); items that tie keep their original order.
 *
 * Title hits at a word start or camelCase hump outrank descriptions; a title match in the middle
 * of a word (`sel` in Carousel) is closer to noise and ranks below description word-starts.
 */
export const commandMatchTier = {
  exactTitle: 13,
  titlePrefix: 12,
  /** At the start of a later word of the title (after a space or punctuation): `Icon button`. */
  titleWordStart: 11,
  /** At a camelCase hump: `IconButton`, `ChatComposer`. */
  titleHump: 10,
  /** At the start of a keyword or one of its words. */
  keyword: 9,
  /** The description starts with the query: it is about that thing. */
  metaPrefix: 8,
  /**
   * At the start of a word in one of the item's section `headings` (`providers` → Getting
   * started's "Providers"): an authored section title, above a passing word in a description.
   */
  heading: 7,
  metaWordStart: 6,
  /** Inside a title or keyword word, not at its start: `sel` in Carousel (or its `carousel` slug). */
  titleSubstring: 5,
  meta: 4,
  /**
   * At the start of a word in the item's `body` (full text): below everything in the visible
   * fields, above typo matches.
   */
  body: 3,
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

/** Length of the common prefix of `a` and `b`. */
function sharedPrefix(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/**
 * The first title word that starts with `q` give or take one typo: its index (`-1` for none) and
 * how many leading characters of `q` it shares as typed (`inpt` keeps 3 of Input, 2 of Install).
 */
function typoWordMatch(title: string, q: string): { index: number; shared: number } {
  if (q.length < TYPO_MIN_LENGTH || /\s/.test(q)) return { index: -1, shared: 0 };
  const words = titleWords(title);
  const index = words.findIndex((word) =>
    [q.length - 1, q.length, q.length + 1].some(
      (length) => length <= word.length && withinOneEdit(q, word.slice(0, length)),
    ),
  );
  return { index, shared: index < 0 ? 0 : sharedPrefix(q, words[index]!) };
}

/** The first heading with a word that starts with `q` (already trimmed and lowercased). */
function headingMatch(item: CommandSearchFields, q: string): string | undefined {
  return item.headings?.find((heading) => {
    const lower = heading.toLowerCase();
    return lower.startsWith(q) || boundaryMatch(heading, lower, q) !== null;
  });
}

/** Index of the first word-start match of `q` (lowercased) in `text`, or `-1`. */
function wordStartIndex(text: string, q: string): number {
  const lower = text.toLowerCase();
  if (lower.startsWith(q)) return 0;
  for (let at = lower.indexOf(q, 1); at > 0; at = lower.indexOf(q, at + 1)) {
    if (!isWordChar(text[at - 1])) return at;
  }
  return -1;
}

function bodyMatch(item: CommandSearchFields, q: string): number {
  return item.body ? wordStartIndex(item.body, q) : -1;
}

/**
 * Scores `item` against `query`: exact title > title prefix > title word-start > title camelCase
 * hump > keyword word-start > description prefix > section heading word-start > description
 * word-start > mid-word title or keyword substring > description substring > body word-start > title with one typo. Returns `null` when nothing matches, and `0` for an empty
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
  const keywords = item.keywords?.map((keyword) => keyword.toLowerCase()) ?? [];
  if (keywords.some((keyword) => keyword.startsWith(q) || boundaryMatch(keyword, keyword, q))) {
    return commandMatchTier.keyword;
  }
  const meta = item.meta?.toLowerCase();
  if (meta?.startsWith(q)) return commandMatchTier.metaPrefix;
  if (headingMatch(item, q) !== undefined) return commandMatchTier.heading;
  const metaAt = meta ? meta.indexOf(q) : -1;
  if (meta && metaAt > 0 && boundaryMatch(item.meta!, meta, q) === 'word') {
    return commandMatchTier.metaWordStart;
  }
  if (title.includes(q) || keywords.some((keyword) => keyword.includes(q))) {
    return commandMatchTier.titleSubstring;
  }
  if (metaAt > 0) return commandMatchTier.meta;
  if (bodyMatch(item, q) >= 0) return commandMatchTier.body;
  const typo = typoWordMatch(item.title, q);
  if (typo.index === 0) return commandMatchTier.titleTypoPrefix;
  if (typo.index > 0) return commandMatchTier.titleTypo;
  return null;
}

/**
 * The sort key `rankCommandItems` uses: the tier, plus (for one-typo matches only) a fraction for
 * the correctly typed prefix, so `inpt` puts Input* (3 letters right) above Installation (2).
 */
function rankScore(item: CommandSearchFields, query: string): number | null {
  const tier = scoreCommandItem(item, query);
  if (tier !== commandMatchTier.titleTypoPrefix && tier !== commandMatchTier.titleTypo) return tier;
  const { shared } = typoWordMatch(item.title, query.trim().toLowerCase());
  return tier + Math.min(shared, 99) / 100;
}

function isMetaTier(tier: number | null): boolean {
  return (
    tier === commandMatchTier.metaPrefix ||
    tier === commandMatchTier.metaWordStart ||
    tier === commandMatchTier.meta
  );
}

/** Whether `item` matches `query` at all (title, keywords, description, headings or body). */
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
    const tier = rankScore(item, query);
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
  const exactHit = [...groups.values()].some((group) => group.best >= commandMatchTier.body);
  return [...groups.values()]
    .map((group) =>
      exactHit && !isMatch
        ? {
            ...group,
            entries: group.entries.filter((entry) => entry.score >= commandMatchTier.body),
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
 * The subtitle to show for `item` under `query`. When the item matched only by a section heading,
 * that heading. When the item matched only in its description
 * (not its title or keywords) and the match sits past the start, the text is cut to begin shortly
 * before the match (at a word boundary, with a leading `…`) so the highlighted match is not lost
 * to truncation. Otherwise returns `meta` unchanged.
 */
export function commandMetaSnippet(item: CommandSearchFields, query: string): string | undefined {
  const { meta } = item;
  const tier = scoreCommandItem(item, query);
  // Found by a section heading: show that heading, so the result says where the match is.
  if (tier === commandMatchTier.heading) {
    return headingMatch(item, query.trim().toLowerCase()) ?? meta;
  }
  // Found only in the full text: show the passage around the match.
  if (tier === commandMatchTier.body && item.body) {
    return bodySnippet(item.body, query.trim().toLowerCase());
  }
  if (!meta || !isMetaTier(tier)) return meta;
  const match = findTextMatch(meta, query);
  if (!match || match[0] <= SNIPPET_LEAD) return meta;
  let start = match[0] - SNIPPET_LEAD;
  // Begin at the next word so the snippet does not open mid-word.
  const space = meta.slice(start, match[0]).search(/\s\S/);
  if (space >= 0) start += space + 1;
  return `…${meta.slice(start)}`;
}

/** Characters of body text kept after the match start in a body snippet. */
const BODY_SNIPPET_LENGTH = 120;

/** The body around the match of `q`: from a word start shortly before it, cut at a word end. */
function bodySnippet(body: string, q: string): string {
  const text = body.replace(/\s+/g, ' ');
  const collapsedAt = Math.max(0, wordStartIndex(text, q.replace(/\s+/g, ' ')));
  let start = Math.max(0, collapsedAt - SNIPPET_LEAD);
  if (start > 0) {
    const space = text.slice(start, collapsedAt).search(/\s\S/);
    start = space >= 0 ? start + space + 1 : collapsedAt;
  }
  let end = Math.min(text.length, collapsedAt + BODY_SNIPPET_LENGTH);
  if (end < text.length) {
    const lastSpace = text.lastIndexOf(' ', end);
    if (lastSpace > collapsedAt) end = lastSpace;
  }
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}
