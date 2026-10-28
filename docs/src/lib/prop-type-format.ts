/**
 * Deterministic formatting for prop type strings in the generated docs.
 *
 * `ts.TypeChecker.typeToString` renders union members in TypeScript's internal type-id
 * order, which follows the order each literal was first interned while checking the
 * program. That is neither the authored order nor stable:
 *
 * - `variant.enum(['subtle', 'solid', 'outline'])` prints as `"outline" | "subtle" | "solid"`,
 *   because a shared literal can be interned earlier than the enum that owns it.
 * - Adding or removing an unrelated source file reorders unrelated unions such as
 *   `enterKeyHint` (`@types/react` shares the `'search'` literal with first-party code).
 *
 * `packages/cli/data/catalog.json` used to be committed and compared byte-for-byte against a
 * fresh generation, so that churn showed up as spurious diffs and a failing `completeness`
 * test. The catalog is now generated at build time, but stable output still keeps the
 * generated props and CLI docs deterministic.
 * This module removes the dependency on compiler internals by canonicalising the rendered
 * text:
 *
 * - union members are deduped and sorted with a locale-independent comparator;
 * - `NonNullable<X>` — which typestyles' `RecipeVariants` leaves un-reduced in printed
 *   output — is expanded to `X` minus its `null` / `undefined` members;
 * - the same treatment recurses into generic arguments, parenthesised types, function
 *   parameter lists, function return types and object type members.
 *
 * The result is a pure function of the type's structure, so it is identical no matter how
 * the program is shaped.
 */

const GROUP_CLOSE: Record<string, string> = { '<': '>', '(': ')', '[': ']', '{': '}' };
const GROUP_OPEN_CHARS = '<([{';
const GROUP_CLOSE_CHARS = '>)]}';
const NON_NULLABLE_PREFIX = 'NonNullable<';

function isQuote(char: string): boolean {
  return char === '"' || char === "'" || char === '`';
}

/** Index just past the quoted literal that starts at `start`. */
function skipQuoted(text: string, start: number): number {
  const quote = text[start];
  let index = start + 1;

  while (index < text.length) {
    if (text[index] === '\\') {
      index += 2;
      continue;
    }

    if (text[index] === quote) {
      return index + 1;
    }

    index += 1;
  }

  return text.length;
}

/**
 * Index of the character closing the group opened at `start`, or -1 when unbalanced.
 *
 * `=>` is skipped so the `>` of an arrow never counts as a generic closer.
 */
function findGroupEnd(text: string, start: number): number {
  const close = GROUP_CLOSE[text[start]];

  if (!close) {
    return -1;
  }

  let depth = 0;
  let index = start;

  while (index < text.length) {
    const char = text[index];

    if (isQuote(char)) {
      index = skipQuoted(text, index);
      continue;
    }

    if (char === '=' && text[index + 1] === '>') {
      index += 2;
      continue;
    }

    if (char === text[start]) {
      depth += 1;
    } else if (char === close) {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }

    index += 1;
  }

  return -1;
}

type TopLevelHit = { kind: 'arrow' | 'separator'; index: number };

/**
 * Positions of the tokens that are significant at the top level of `text`: every arrow
 * (`=>`) and every occurrence of `separator`.
 *
 * Indexes nested inside a bracketed group or a string literal are skipped, so callers can
 * split and search without writing their own scanner.
 */
function topLevelHits(text: string, separator: string): TopLevelHit[] {
  const hits: TopLevelHit[] = [];
  let depth = 0;
  let index = 0;

  while (index < text.length) {
    const char = text[index];

    if (isQuote(char)) {
      index = skipQuoted(text, index);
      continue;
    }

    if (char === '=' && text[index + 1] === '>') {
      if (depth === 0) {
        hits.push({ kind: 'arrow', index });
      }

      index += 2;
      continue;
    }

    if (GROUP_OPEN_CHARS.includes(char)) {
      depth += 1;
      index += 1;
      continue;
    }

    if (GROUP_CLOSE_CHARS.includes(char)) {
      depth -= 1;
      index += 1;
      continue;
    }

    if (depth === 0 && separator && text.startsWith(separator, index)) {
      hits.push({ kind: 'separator', index });
      index += separator.length;
      continue;
    }

    index += 1;
  }

  return hits;
}

/** Split `text` on `separator`, ignoring separators nested inside groups or literals. */
function splitTopLevel(text: string, separator: string): string[] {
  const parts: string[] = [];
  let start = 0;

  for (const hit of topLevelHits(text, separator)) {
    if (hit.kind === 'separator') {
      parts.push(text.slice(start, hit.index));
      start = hit.index + separator.length;
    }
  }

  parts.push(text.slice(start));

  return parts;
}

/** Index of the first `=>` at depth zero, or -1. */
function findTopLevelArrow(text: string): number {
  return topLevelHits(text, '').find((hit) => hit.kind === 'arrow')?.index ?? -1;
}

/** Index of the first `separator` at depth zero, or -1. */
function findTopLevelSeparator(text: string, separator: string): number {
  return topLevelHits(text, separator).find((hit) => hit.kind === 'separator')?.index ?? -1;
}

/**
 * Expand a `NonNullable<…>` member into its own members, dropping `null` / `undefined`.
 *
 * The printed `NonNullable` is a display artifact: `RecipeVariants` maps over the recipe
 * selections with `{ [K in keyof T]: NonNullable<T[K]> }`, and the checker prints the
 * un-reduced alias. Expanding it is semantically exact.
 */
function expandNonNullable(member: string): string[] {
  const text = member.trim();

  if (
    !text.startsWith(NON_NULLABLE_PREFIX) ||
    findGroupEnd(text, NON_NULLABLE_PREFIX.length - 1) !== text.length - 1
  ) {
    return [text];
  }

  return splitTopLevel(text.slice(NON_NULLABLE_PREFIX.length, -1), '|')
    .flatMap(expandNonNullable)
    .filter((part) => part !== 'null' && part !== 'undefined');
}

function compareMembers(left: string, right: string): number {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

/**
 * Rank that keeps `null` / `undefined` after the other members, matching how optional
 * properties are conventionally rendered (`{ … } | undefined`).
 */
function nullishRank(member: string): number {
  if (member === 'null') {
    return 1;
  }

  if (member === 'undefined') {
    return 2;
  }

  return 0;
}

/**
 * Sort key for a member: string literals compare by their content rather than their
 * quotes, so `"additions"` sorts before `"additions removals"` instead of after it.
 */
function comparisonKey(member: string): string {
  const text = member.trim();
  const quote = text[0];

  if (
    text.length > 1 &&
    (quote === '"' || quote === "'" || quote === '`') &&
    text.endsWith(quote)
  ) {
    return text.slice(1, -1);
  }

  return text;
}

function joinUnion(members: string[]): string {
  const unique = [...new Set(members.map((member) => member.trim()).filter(Boolean))];

  unique.sort(
    (left, right) =>
      nullishRank(left) - nullishRank(right) ||
      compareMembers(comparisonKey(left), comparisonKey(right)) ||
      compareMembers(left, right),
  );

  return unique.join(' | ');
}

function canonicalizeParameter(parameter: string): string {
  const text = parameter.trim();
  const separator = findTopLevelSeparator(text, ':');

  if (separator === -1) {
    return text;
  }

  const name = text.slice(0, separator).trimEnd();

  return `${name}: ${canonicalizeTypeText(text.slice(separator + 1))}`;
}

function canonicalizeObjectMember(member: string): string {
  const separator = findTopLevelSeparator(member, ':');

  if (separator === -1) {
    return member;
  }

  const name = member.slice(0, separator).trimEnd();

  return `${name}: ${canonicalizeTypeText(member.slice(separator + 1))}`;
}

function canonicalizeObjectBody(inner: string): string {
  const members = splitTopLevel(inner, ';')
    .map((member) => member.trim())
    .filter(Boolean);

  if (members.length === 0) {
    return inner;
  }

  // Match the checker's own object-type style: `{ a: b; }`.
  return ` ${members.map(canonicalizeObjectMember).join('; ')}; `;
}

/**
 * Canonicalise the parameter list of an arrow type's head.
 *
 * `head` is everything before `=>`; parameters are the one place in a type expression where
 * a top-level `:` separates a name from a type rather than a member.
 */
function canonicalizeArrowHead(head: string): string {
  const text = head.trim();
  const open = text.indexOf('(');

  if (open === -1) {
    return text;
  }

  const end = findGroupEnd(text, open);

  if (end !== text.length - 1) {
    return text;
  }

  const prefix = text.slice(0, open);
  const parameters = splitTopLevel(text.slice(open + 1, end), ',')
    .map((parameter) => canonicalizeParameter(parameter))
    .filter(Boolean);

  return `${prefix}(${parameters.join(', ')})`;
}

/**
 * Canonicalise the contents of a bracketed group.
 *
 * `after` is the character following the group, used to tell a function parameter list
 * (`(value: string) => …`) apart from a parenthesised type (`(A | B)`).
 */
function canonicalizeGroupBody(open: string, inner: string, after: string): string {
  if (!inner.trim()) {
    return inner;
  }

  if (open === '<') {
    return splitTopLevel(inner, ',')
      .map((argument) => canonicalizeTypeText(argument))
      .join(', ');
  }

  if (open === '(') {
    return after === '='
      ? splitTopLevel(inner, ',')
          .map((parameter) => canonicalizeParameter(parameter))
          .join(', ')
      : canonicalizeTypeText(inner);
  }

  if (open === '{') {
    return canonicalizeObjectBody(inner);
  }

  return canonicalizeTypeText(inner);
}

/** Recursively canonicalise the contents of every bracketed group in `text`. */
function rewriteGroups(text: string): string {
  let output = '';
  let index = 0;

  while (index < text.length) {
    const char = text[index];

    if (isQuote(char)) {
      const end = skipQuoted(text, index);

      output += text.slice(index, end);
      index = end;
      continue;
    }

    if (char === '=' && text[index + 1] === '>') {
      output += '=>';
      index += 2;
      continue;
    }

    if (GROUP_OPEN_CHARS.includes(char)) {
      const end = findGroupEnd(text, index);

      if (end === -1) {
        output += text.slice(index);
        break;
      }

      const inner = text.slice(index + 1, end);

      output += `${char}${canonicalizeGroupBody(char, inner, text[end + 1] ?? '')}${GROUP_CLOSE[char]}`;
      index = end + 1;
      continue;
    }

    output += char;
    index += 1;
  }

  return output;
}

function canonicalizeMember(member: string): string {
  const text = member.trim();

  return text ? rewriteGroups(text) : text;
}

/** Canonicalise a single type expression (union ordering, `NonNullable`, nesting). */
function canonicalizeTypeText(raw: string): string {
  const text = raw.trim();

  if (!text) {
    return text;
  }

  const arrow = findTopLevelArrow(text);

  if (arrow !== -1) {
    const head = text.slice(0, arrow);

    return `${canonicalizeArrowHead(head)} => ${canonicalizeTypeText(text.slice(arrow + 2))}`;
  }

  const members = splitTopLevel(text, '|');

  if (members.length > 1) {
    return joinUnion(members.flatMap(expandNonNullable).map(canonicalizeMember));
  }

  const expanded = expandNonNullable(text);

  if (expanded.length === 0) {
    return 'never';
  }

  if (expanded.length > 1) {
    return joinUnion(expanded.map(canonicalizeMember));
  }

  return canonicalizeMember(expanded[0]);
}

/**
 * Canonicalise the `typeToString` output for a documented prop.
 *
 * Deterministic for a given type shape, regardless of how the type program was built.
 */
export function canonicalizePropType(raw: string): string {
  return canonicalizeTypeText(raw);
}
