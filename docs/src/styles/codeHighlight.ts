import type { VariantOptionStyle } from 'typestyles';
import {
  atDarkMode,
  darkSyntaxValues,
  lightSyntaxValues,
  typestyles,
  type SyntaxFaceValues,
} from '@var-ui/core';

/** Layout ancestor must include `codeHljsScope.root` so rules match `CodeBlock` output. */
const cb = '[data-codeblock]';

function scopeSelectorList(list: string): string {
  return list
    .split(',')
    .map((part) => `& ${cb} ${part.trim()}`)
    .join(', ');
}

function hljsSyntaxStyles(colors: SyntaxFaceValues): VariantOptionStyle {
  return {
    [`& ${cb} .hljs`]: {
      color: colors.base,
      background: 'transparent',
      display: 'block',
      overflowX: 'auto',
    },
    [scopeSelectorList(
      '.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_',
    )]: {
      color: colors.keyword,
    },
    [scopeSelectorList(
      '.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_',
    )]: {
      color: colors.title,
    },
    [scopeSelectorList(
      '.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-variable,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id',
    )]: {
      color: colors.attr,
    },
    [scopeSelectorList('.hljs-regexp,.hljs-string,.hljs-meta .hljs-string')]: {
      color: colors.string,
    },
    [scopeSelectorList('.hljs-built_in,.hljs-symbol')]: {
      color: colors.builtIn,
    },
    [scopeSelectorList('.hljs-comment,.hljs-code,.hljs-formula')]: {
      color: colors.comment,
    },
    [scopeSelectorList('.hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo')]: {
      color: colors.name,
    },
    [scopeSelectorList('.hljs-subst')]: {
      color: colors.base,
    },
    [scopeSelectorList('.hljs-section')]: {
      color: colors.section,
      fontWeight: 'bold',
    },
    [scopeSelectorList('.hljs-bullet')]: {
      color: colors.bullet,
    },
    [scopeSelectorList('.hljs-emphasis')]: {
      color: colors.base,
      fontStyle: 'italic',
    },
    [scopeSelectorList('.hljs-strong')]: {
      color: colors.base,
      fontWeight: 'bold',
    },
    [scopeSelectorList('.hljs-addition')]: {
      color: colors.addition,
      backgroundColor: colors.additionBackground,
    },
    [scopeSelectorList('.hljs-deletion')]: {
      color: colors.deletion,
      backgroundColor: colors.deletionBackground,
    },
  };
}

/**
 * Maps `color.code` presets to highlight.js class names for this docs site.
 *
 * Uses explicit light/dark palette wiring via `atDarkMode` so syntax colors
 * follow the docs `data-color-mode` toggle (and system preference), not only
 * `color-scheme` / `light-dark()` on semantic tokens.
 *
 * Compose **`codeHljsScope.root`** on a page shell so selectors apply inside
 * `[data-codeblock]` wrappers.
 */
export const codeHljsScope = typestyles.recipe({
  name: 'docs-hljs',
  layer: 'utilities',
  slots: ['root'],
  styles: {
    base: {
      root: {
        colorScheme: 'inherit',
        ...hljsSyntaxStyles(lightSyntaxValues),
        ...atDarkMode(hljsSyntaxStyles(darkSyntaxValues)),
      },
    },
  },
});
