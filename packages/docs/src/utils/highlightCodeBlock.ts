import { highlightCode, highlightCodeClassName } from './highlightCode';

/**
 * Sync highlight.js highlighting. The `hljs-*` classes it emits are coloured with the theme's
 * `color.code.*` tokens by `@var-ui/docs/styles` (inside a `CodeBlock`), the same palette as the
 * design-token Shiki theme on MDX fences.
 */
export { highlightCode, highlightCodeClassName };

export type HighlightedCodeBlockContent = {
  codeHtml?: string;
  codeClassName?: string;
  lineHtml?: string[];
};

/** Build pre-highlighted HTML for `CodeBlock` from plain source. */
export function highlightCodeBlockContent(
  code: string,
  language?: string,
  options?: { showLineNumbers?: boolean },
): HighlightedCodeBlockContent {
  if (!language) return {};

  if (options?.showLineNumbers) {
    const lines = code.replace(/\n$/, '').split('\n');
    return { lineHtml: lines.map((line) => highlightCode(line, language) || '&nbsp;') };
  }

  return {
    codeHtml: highlightCode(code, language),
    codeClassName: highlightCodeClassName(language),
  };
}
