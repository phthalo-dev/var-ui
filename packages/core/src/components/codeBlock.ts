import { atProperty, type RecipeVariants, variant, type VariantOptions } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border, borderSide } from '../internal/border';

/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
const codeBlockVarDefinitions = {
  border: {
    ...atProperty.color,
    value: t.color.border.default.var,
  },
  background: {
    ...atProperty.color,
    value: t.color.background.surface.var,
  },
  backgroundInline: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
  backgroundHeader: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
  filenameColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  languageColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  copyButtonColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  copyButtonHoverBackground: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
  feedbackColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  lineNumberColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  lineHighlightBackground: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
} as const;

const codeBlockVariant = variant.enum(['default', 'inline', 'diff', 'terminal'], {
  default: 'default',
});

/**
 * Fenced code chrome. `variant` is a recipe axis (`default`, `inline`, `diff`, `terminal`)
 * applied as `data-variant` on every slot.
 */
export const codeBlock = typestyles.recipe({
  name: 'code-block',
  layer: 'components',
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
  vars: codeBlockVarDefinitions,
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          ...border(vars.border.var),
          borderRadius: t.radius.lg.var,
          backgroundColor: vars.background.var,
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
          ...borderSide('block-end', vars.border.var),
          backgroundColor: vars.backgroundHeader.var,
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
          color: vars.filenameColor.var,
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
          color: vars.languageColor.var,
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
          color: vars.copyButtonColor.var,
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
            color: vars.filenameColor.var,
            backgroundColor: vars.copyButtonHoverBackground.var,
          },
          '&:focus-visible': {
            ...focusRing,
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
          color: vars.feedbackColor.var,
          minHeight: '1lh',
        },
        feedbackInline: {
          display: 'inline-flex',
          alignItems: 'center',
          marginInlineStart: t.space[1].var,
        },
        feedbackToast: {
          position: 'absolute',
          insetInlineEnd: t.space[3].var,
          top: t.space[3].var,
          zIndex: t.zIndex.raised.var,
          ...border(vars.border.var),
          backgroundColor: vars.background.var,
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
          backgroundColor: vars.background.var,
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
          textAlign: 'end',
          fontSize: t.fontSize.sm.var,
          color: vars.lineNumberColor.var,
          opacity: 0.8,
          userSelect: 'none',
        },
        lineContent: {
          minWidth: 0,
        },
        lineHighlighted: {
          backgroundColor: vars.lineHighlightBackground.var,
        },
        lineAdded: {
          backgroundColor: t.color.tone.success.subtleBackground.var,
        },
        lineDeleted: {
          backgroundColor: t.color.tone.danger.subtleBackground.var,
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
              ...border(vars.border.var),
              padding: '2px 8px',
              backgroundColor: vars.backgroundInline.var,
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
});

export type CodeBlockVariant = VariantOptions<typeof codeBlockVariant>;

/** Visual props derived from the schema. */
export type CodeBlockVariantProps = RecipeVariants<typeof codeBlock>;
