import type { Catalog, TokenRecord } from '../types';

/** Lowercase, separators dropped: `fontSize`, `font-size` and `font size` all match. */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[\s._-]+/g, '');
}

/**
 * Tokens whose path or CSS variable contains `query` (`space`, `text.primary`,
 * `--var-ui-font-size`). Every token when the query is empty.
 */
export function filterTokens(tokens: readonly TokenRecord[], query = ''): TokenRecord[] {
  const needle = normalize(query.replace(/^--var-ui-/, ''));
  if (!needle) return [...tokens];
  return tokens.filter(
    (token) =>
      normalize(token.path).includes(needle) ||
      normalize(token.cssVar.replace(/^--var-ui-/, '')).includes(needle),
  );
}

function formatValue(value: TokenRecord['value']): string {
  if (typeof value === 'object') {
    const { light, dark } = value;
    return light === dark ? String(light) : `${light ?? '—'} / ${dark ?? '—'} (light / dark)`;
  }
  return String(value);
}

/** Aligned `path  --css-var  value` rows, or JSON. */
export function formatTokens(tokens: readonly TokenRecord[], json: boolean): string {
  if (json) return `${JSON.stringify(tokens, null, 2)}\n`;
  if (tokens.length === 0) return '';
  const pathWidth = Math.max(...tokens.map((token) => token.path.length));
  const varWidth = Math.max(...tokens.map((token) => token.cssVar.length));
  return tokens
    .map(
      (token) =>
        `${token.path.padEnd(pathWidth)}  ${token.cssVar.padEnd(varWidth)}  ${formatValue(token.value)}\n`,
    )
    .join('');
}

export function catalogTokens(catalog: Catalog): readonly TokenRecord[] {
  if (!catalog.tokens) {
    throw new Error(
      'This catalog has no design tokens (it predates `var-ui tokens`). Update @var-ui/cli.',
    );
  }
  return catalog.tokens;
}

export function noTokensMessage(query: string): string {
  return `No design tokens match "${query}". Try a group name: space, color, fontSize, radius, shadow.\n`;
}
