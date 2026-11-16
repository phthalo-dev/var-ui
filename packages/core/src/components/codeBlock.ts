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
    'feedback',
    'feedbackToast',
    'body',
    'pre',
    'code',
    'line',
    'lineNumber',
    'lineContent',
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
          gap: t.space.xs.var,
          paddingBlock: t.space.xxs.var,
          paddingInline: t.space.sm.var,
          ...borderSide('block-end', vars.border.var),
          backgroundColor: vars.backgroundHeader.var,
        },
        title: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
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
          gap: t.space.xxs.var,
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
          gap: t.space.xxs.var,
          border: 'none',
          backgroundColor: 'transparent',
          color: vars.copyButtonColor.var,
          borderRadius: t.radius.sm.var,
          paddingBlock: t.space.xxs.var,
          paddingInline: t.space.xs.var,
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
        feedback: {
          fontSize: t.fontSize.sm.var,
          color: vars.feedbackColor.var,
          minHeight: '1lh',
          display: 'inline-flex',
          alignItems: 'center',
          marginInlineStart: t.space.xxs.var,
          '&[data-tone="success"]': {
            color: t.color.tone.success.foreground.var,
          },
          '&[data-tone="error"]': {
            color: t.color.tone.danger.foreground.var,
          },
        },
        feedbackToast: {
          position: 'absolute',
          insetInlineEnd: t.space.sm.var,
          top: t.space.sm.var,
          zIndex: t.zIndex.raised.var,
          ...border(vars.border.var),
          backgroundColor: vars.background.var,
          borderRadius: t.radius.md.var,
          padding: `0.125rem ${t.space.xs.var}`,
          boxShadow: t.shadow.sm.var,
        },
        body: {
          padding: 0,
          backgroundColor: vars.background.var,
          overflowX: 'auto',
        },
        pre: {
          margin: 0,
          padding: t.space.md.var,
          fontFamily: t.fontFamily.mono.var,
          fontSize: t.fontSize.sm.var,
          lineHeight: 1.6,
          overflow: 'auto',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 0,
          whiteSpace: 'pre',
          overflowX: 'auto',
          '&[data-wrap]': {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'visible',
          },
        },
        code: {
          display: 'block',
          '&[data-line-numbers]': {
            display: 'grid',
            gap: '0.125rem',
          },
        },
        line: {
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'start',
          columnGap: t.space.sm.var,
          borderRadius: t.radius.sm.var,
          paddingInline: t.space.xs.var,
          '&[data-highlighted]': {
            backgroundColor: vars.lineHighlightBackground.var,
          },
          '&[data-line-tone="added"]': {
            backgroundColor: t.color.tone.success.subtleBackground.var,
          },
          '&[data-line-tone="deleted"]': {
            backgroundColor: t.color.tone.danger.subtleBackground.var,
          },
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
      },
      variants: {
        variant: {
          default: {},
          inline: {
            root: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: t.space.xxs.var,
              borderRadius: t.radius.md.var,
              ...border(vars.border.var),
              padding: '0.125rem 0.5rem',
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
