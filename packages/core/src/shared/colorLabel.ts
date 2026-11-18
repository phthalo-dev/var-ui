/** Var UI's color token custom-property prefixes, most specific first. */
const TOKEN_PREFIXES = ['--var-ui-color-palette-', '--var-ui-color-', '--var-ui-'];

/**
 * Short, readable label for a CSS color value: a Var UI token reference reads as its token name
 * (`var(--var-ui-color-palette-phthalo-7)` → `phthalo-7`, `var(--var-ui-color-background-surface)`
 * → `background-surface`), any other `var(--x)` as `--x`; other values are returned as given.
 * A light / dark pair (`a / b`) labels each side.
 */
export function colorValueLabel(value: string): string {
  const trimmed = value.trim();
  if (trimmed.includes(' / ')) {
    return trimmed
      .split(' / ')
      .map((part) => colorValueLabel(part))
      .join(' / ');
  }
  const match = /^var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)$/.exec(trimmed);
  if (!match?.[1]) return trimmed;
  const name = match[1];
  const prefix = TOKEN_PREFIXES.find((candidate) => name.startsWith(candidate));
  return prefix ? name.slice(prefix.length) : name;
}
