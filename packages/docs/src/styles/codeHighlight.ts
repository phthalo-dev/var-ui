import { designTokens as t, typestyles } from '@var-ui/core';

const c = t.color.code;

/** Root class of the `@var-ui/core` `codeBlock` recipe (checked in `codeHighlight.test.ts`). */
export const CODE_BLOCK_ROOT_CLASS = 'var-ui-code-block';

const scoped = (selectors: string) =>
  selectors
    .split(',')
    .map((selector) => `.${CODE_BLOCK_ROOT_CLASS} ${selector.trim()}`)
    .join(', ');

/**
 * highlight.js token classes (`@var-ui/docs/highlight` output) mapped to the theme's
 * `color.code.*` tokens: the same palette as the design-token Shiki theme used for MDX fences.
 * The tokens carry both colour modes, so highlighted blocks follow the theme and mode. Scoped to
 * `CodeBlock` (`.var-ui-code-block`), so other `hljs` output on the page is left alone.
 */
export const codeHighlightRules = {
  [scoped('.hljs')]: { color: c.base.var, background: 'transparent' },
  [scoped(
    '.hljs-keyword, .hljs-meta .hljs-keyword, .hljs-template-tag, .hljs-template-variable, .hljs-type, .hljs-variable.language_',
  )]: { color: c.keyword.var },
  [scoped(
    '.hljs-title, .hljs-title.class_, .hljs-title.class_.inherited__, .hljs-title.function_',
  )]: { color: c.title.var },
  [scoped(
    '.hljs-attr, .hljs-attribute, .hljs-literal, .hljs-meta, .hljs-number, .hljs-operator, .hljs-variable, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-id',
  )]: { color: c.attr.var },
  [scoped('.hljs-regexp, .hljs-string, .hljs-meta .hljs-string')]: { color: c.string.var },
  [scoped('.hljs-built_in, .hljs-symbol')]: { color: c.builtIn.var },
  [scoped('.hljs-comment, .hljs-code, .hljs-formula')]: { color: c.comment.var },
  [scoped('.hljs-name, .hljs-quote, .hljs-selector-tag, .hljs-selector-pseudo')]: {
    color: c.name.var,
  },
  [scoped('.hljs-subst')]: { color: c.base.var },
  [scoped('.hljs-section')]: { color: c.section.var, fontWeight: 'bold' },
  [scoped('.hljs-bullet')]: { color: c.bullet.var },
  [scoped('.hljs-emphasis')]: { color: c.base.var, fontStyle: 'italic' },
  [scoped('.hljs-strong')]: { color: c.base.var, fontWeight: 'bold' },
  [scoped('.hljs-addition')]: {
    color: c.addition.var,
    backgroundColor: c.additionBackground.var,
  },
  [scoped('.hljs-deletion')]: {
    color: c.deletion.var,
    backgroundColor: c.deletionBackground.var,
  },
} as const;

typestyles.global.rules(codeHighlightRules);
