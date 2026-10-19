import { type RecipeVariants, variant, type VariantOptions } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
export const codeBlockVarDefinitions = {
  border: {
    value: t.color.border.default.var,
    syntax: '<color>' as const,
  },
  background: {
    value: t.color.background.surface.var,
    syntax: '<color>' as const,
  },
  backgroundInline: {
    value: t.color.background.subtle.var,
    syntax: '<color>' as const,
  },
  backgroundHeader: {
    value: t.color.background.subtle.var,
    syntax: '<color>' as const,
  },
  filenameColor: {
    value: t.color.text.primary.var,
    syntax: '<color>' as const,
  },
  languageColor: {
    value: t.color.text.secondary.var,
    syntax: '<color>' as const,
  },
  copyButtonColor: {
    value: t.color.text.secondary.var,
    syntax: '<color>' as const,
  },
  copyButtonHoverBackground: {
    value: t.color.background.subtle.var,
    syntax: '<color>' as const,
  },
  feedbackColor: {
    value: t.color.text.secondary.var,
    syntax: '<color>' as const,
  },
  lineNumberColor: {
    value: t.color.text.secondary.var,
    syntax: '<color>' as const,
  },
  lineHighlightBackground: {
    value: t.color.background.subtle.var,
    syntax: '<color>' as const,
  },
} as const;

const codeBlockVariant = variant.enum(['default', 'inline', 'diff', 'terminal'], {
  default: 'default',
});

/**
 * Fenced code chrome. `variant` is a recipe axis (`default`, `inline`, `diff`, `terminal`)
 * applied as `data-variant` on every slot.
 */
export const codeBlock = typestyles.recipe(
  'code-block',
  {
    slots: [
      'root',
      'header',
      'title',
      'filename',
      'language',
      'actions',
      'copyButton',
      'copyButtonIdle',
      'copyButtonCopied',
      'copyButtonError',
      'feedback',
      'feedbackInline',
      'feedbackToast',
      'feedbackSuccess',
      'feedbackError',
      'body',
      'bodyScrollable',
      'pre',
      'preWrap',
      'preScrollX',
      'code',
      'lines',
      'line',
      'lineNumber',
      'lineContent',
      'lineHighlighted',
      'lineAdded',
      'lineDeleted',
    ],
    variants: { variant: codeBlockVariant },
  },
  (c) => {
    const v = c.vars(codeBlockVarDefinitions);
    return {
      vars: v,
      base: {
        root: {
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          borderRadius: t.radius.lg.var,
          backgroundColor: v.background.var,
          overflow: 'hidden',
          boxShadow: t.shadow.lg.var,
        },
        header: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[2].var,
          paddingBlock: t.space[1].var,
          paddingInline: t.space[3].var,
          borderBottomWidth: t.borderWidth.default.var,
          borderBottomStyle: 'solid',
          borderBottomColor: v.border.var,
          backgroundColor: v.backgroundHeader.var,
        },
        title: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          minWidth: 0,
        },
        filename: {
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          color: v.filenameColor.var,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        language: {
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.bold.var,
          fontFamily: t.fontFamily.mono.var,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: v.languageColor.var,
          whiteSpace: 'nowrap',
        },
        actions: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          flexShrink: 0,
        },
        /**
         * Copy button reads as a mono uppercase text action rather than a boxed button. The header
         * already has its own hairline + toolbar tint; a second bordered chip inside it reads as
         * double chrome.
         */
        copyButton: {
          appearance: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          border: 'none',
          backgroundColor: 'transparent',
          color: v.copyButtonColor.var,
          borderRadius: t.radius.sm.var,
          paddingBlock: t.space[1].var,
          paddingInline: t.space[2].var,
          fontFamily: t.fontFamily.mono.var,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.semibold.var,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: t.transition.colorShift.var,
          '&:hover': {
            color: v.filenameColor.var,
            backgroundColor: v.copyButtonHoverBackground.var,
          },
          '&:focus-visible': {
            outline: `${t.borderWidth.thin.var} solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
          '&[data-copied]': {
            color: t.color.tone.success.foreground.var,
          },
          '&[data-error]': {
            color: t.color.tone.danger.foreground.var,
          },
        },
        copyButtonIdle: {},
        copyButtonCopied: {
          color: t.color.tone.success.foreground.var,
        },
        copyButtonError: {
          color: t.color.tone.danger.foreground.var,
        },
        feedback: {
          fontSize: t.fontSize.sm.var,
          color: v.feedbackColor.var,
          minHeight: '1lh',
        },
        feedbackInline: {
          display: 'inline-flex',
          alignItems: 'center',
          marginInlineStart: t.space[1].var,
        },
        feedbackToast: {
          position: 'absolute',
          right: t.space[3].var,
          top: t.space[3].var,
          zIndex: 1,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          backgroundColor: v.background.var,
          borderRadius: t.radius.md.var,
          padding: `2px ${t.space[2].var}`,
          boxShadow: t.shadow.sm.var,
        },
        feedbackSuccess: {
          color: t.color.tone.success.foreground.var,
        },
        feedbackError: {
          color: t.color.tone.danger.foreground.var,
        },
        body: {
          padding: 0,
          backgroundColor: v.background.var,
        },
        bodyScrollable: {
          overflowX: 'auto',
        },
        pre: {
          margin: 0,
          padding: t.space[4].var,
          fontFamily: t.fontFamily.mono.var,
          fontSize: t.fontSize.sm.var,
          lineHeight: 1.6,
          overflow: 'auto',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 0,
        },
        preWrap: {
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowX: 'visible',
        },
        preScrollX: {
          whiteSpace: 'pre',
          overflowX: 'auto',
        },
        code: {
          display: 'block',
        },
        lines: {
          display: 'grid',
          gap: '2px',
        },
        line: {
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'start',
          columnGap: t.space[3].var,
          borderRadius: t.radius.sm.var,
          paddingInline: t.space[2].var,
        },
        lineNumber: {
          minWidth: '2ch',
          textAlign: 'right',
          fontSize: t.fontSize.sm.var,
          color: v.lineNumberColor.var,
          opacity: 0.8,
          userSelect: 'none',
        },
        lineContent: {
          minWidth: 0,
        },
        lineHighlighted: {
          backgroundColor: v.lineHighlightBackground.var,
        },
        lineAdded: {
          backgroundColor: 'rgb(16 185 129 / 0.12)',
        },
        lineDeleted: {
          backgroundColor: 'rgb(248 113 113 / 0.12)',
        },
      },
      variants: {
        variant: {
          default: {},
          inline: {
            root: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: t.space[1].var,
              borderRadius: t.radius.md.var,
              borderWidth: t.borderWidth.default.var,
              borderStyle: 'solid',
              borderColor: v.border.var,
              padding: '2px 8px',
              backgroundColor: v.backgroundInline.var,
            },
          },
          diff: {
            root: {
              borderColor: t.color.border.strong.var,
            },
          },
          terminal: {
            root: {
              backgroundColor: t.color.text.primary.var,
              borderColor: t.color.text.primary.var,
            },
          },
        },
      },
    };
  },
  { layer: 'components' },
);

export type CodeBlockVariant = VariantOptions<typeof codeBlockVariant>;

/** Visual props derived from the schema. */
export type CodeBlockVariantProps = RecipeVariants<typeof codeBlock>;

export const codeBlockVariantPropDocs = [
  { name: 'variant', type: "'default' | 'inline' | 'diff' | 'terminal'", required: false },
] as const satisfies ReadonlyArray<{
  name: keyof CodeBlockVariantProps;
  type: string;
  required: false;
}>;
