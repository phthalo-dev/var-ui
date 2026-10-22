import { designTokens as t } from '@var-ui/core';

const c = t.color.code;

type TokenColor = {
  scope: string | string[];
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string;
    fontWeight?: string;
  };
};

function token(
  scope: string | string[],
  foreground: string,
  extra?: Omit<TokenColor['settings'], 'foreground'>,
): TokenColor {
  return { scope, settings: { foreground, ...extra } };
}

/**
 * Shiki theme for MDX fenced code blocks. Colors reference semantic `color.code`
 * tokens (`--var-ui-color-code-*`) so syntax highlighting tracks the active
 * design theme and color mode.
 */
export const designTokenShikiTheme = {
  name: 'var-ui-code',
  colors: {
    'editor.foreground': c.base.var,
    'editor.background': 'transparent',
  },
  tokenColors: [
    token(['comment', 'punctuation.definition.comment', 'string.comment'], c.comment.var),
    token(
      [
        'keyword',
        'storage.type',
        'storage.modifier',
        'keyword.control',
        'keyword.operator.new',
        'keyword.other',
      ],
      c.keyword.var,
    ),
    token(
      [
        'entity.name.function',
        'entity.name.type',
        'entity.name.class',
        'entity.name.type.class',
        'support.class',
        'support.type',
        'entity.other.inherited-class',
      ],
      c.title.var,
    ),
    token(
      [
        'entity.other.attribute-name',
        'constant.numeric',
        'constant.language',
        'constant.other',
        'keyword.operator',
        'variable',
        'variable.other',
        'variable.parameter',
        'variable.language',
        'entity.name.constant',
        'entity.other.attribute-name.class.css',
        'entity.other.attribute-name.id.css',
      ],
      c.attr.var,
    ),
    token(['string', 'constant.regexp', 'string.regexp'], c.string.var),
    token(['support.function', 'support.variable', 'entity.name.function.support'], c.builtIn.var),
    token(
      [
        'entity.name.tag',
        'entity.other.attribute-name.pseudo-class',
        'entity.other.attribute-name.pseudo-element',
        'punctuation.definition.tag',
      ],
      c.name.var,
    ),
    token(['markup.heading', 'entity.name.section'], c.section.var, { fontWeight: 'bold' }),
    token(['constant.character', 'punctuation.definition.list'], c.bullet.var),
    token(['markup.inserted', 'meta.diff.header.to-file'], c.addition.var, {
      background: c.additionBackground.var,
    }),
    token(['markup.deleted', 'meta.diff.header.from-file'], c.deletion.var, {
      background: c.deletionBackground.var,
    }),
    token(['emphasis'], c.base.var, { fontStyle: 'italic' }),
    token(['strong'], c.base.var, { fontWeight: 'bold' }),
  ],
} as const;
