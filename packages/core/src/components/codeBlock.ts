import { atProperty, type RecipeVariants, variant, type VariantOptions } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border, borderSide } from '../internal/border';
import { inlineScrollFade } from '../internal/scrollFade';

const LANGUAGE_LABELS: Record<string, string> = {
  sh: 'Shell',
  shell: 'Shell',
  bash: 'Shell',
  zsh: 'Shell',
  console: 'Shell',
  tsx: 'TSX',
  ts: 'TS',
  typescript: 'TS',
  jsx: 'JSX',
  js: 'JS',
  javascript: 'JS',
  css: 'CSS',
  html: 'HTML',
  astro: 'Astro',
  json: 'JSON',
  md: 'Markdown',
  mdx: 'MDX',
  diff: 'Diff',
  txt: 'Text',
  text: 'Text',
  plaintext: 'Text',
};

/**
 * Display label for a code block language id (`tsx` → `TSX`, `bash` → `Shell`): one
 * convention for every code block header. Unknown ids are upper-cased.
 */
export function codeLanguageLabel(language: string): string {
  const id = language.trim().toLowerCase();
  return LANGUAGE_LABELS[id] ?? id.toUpperCase();
}

/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
const codeBlockVarDefinitions = {
  border: {
    ...atProperty.color,
    value: t.color.border.default.var,
  },
  background: {
    ...atProperty.color,
    value: t.color.background.code.var,
  },
  backgroundInline: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
  backgroundHeader: {
    ...atProperty.color,
    value: t.color.background.codeHeader.var,
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
    value: `color-mix(in oklab, ${t.color.text.primary.var} 7%, transparent)`,
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
  maxHeight: {
    syntax: '*',
    initial: 'none',
    value: 'none',
  },
  /** Font size of the code and line numbers (set it to fit long declarations in a narrow column). */
  fontSize: {
    syntax: '*',
    initial: '0.8125rem',
    value: t.fontSize.sm.var,
  },
  /** Width of the right-edge fade on horizontally scrollable code (scroll-driven; 0 at the end). */
  scrollFade: {
    ...atProperty.length,
    value: '0px',
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
    'tabs',
    'tab',
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
        },
        // 40px header: label on the left, an always-visible icon copy button on the right.
        header: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space.xs.var,
          minHeight: '2.5rem',
          boxSizing: 'border-box',
          paddingBlock: t.space.xxs.var,
          paddingInlineStart: t.space.md.var,
          paddingInlineEnd: '0.375rem',
          ...borderSide('block-end', vars.border.var),
          backgroundColor: vars.backgroundHeader.var,
        },
        title: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          minWidth: 0,
        },
        // Tabbed code blocks (package managers, multiple files): tabs replace the filename.
        tabs: {
          display: 'flex',
          alignItems: 'center',
          gap: '0.125rem',
          marginInlineStart: `calc(-1 * ${t.space.xs.var})`,
          minWidth: 0,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        },
        tab: {
          appearance: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          height: '1.75rem',
          paddingInline: t.space.xs.var,
          border: 'none',
          borderRadius: t.radius.md.var,
          backgroundColor: 'transparent',
          fontFamily: 'inherit',
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.languageColor.var,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: t.transition.colorShift.var,
          '&:hover': {
            color: vars.filenameColor.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
          '&[aria-selected="true"]': {
            color: vars.filenameColor.var,
            backgroundColor: vars.copyButtonHoverBackground.var,
          },
        },
        // Filename and language label share one style: 12px/500 muted.
        filename: {
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.languageColor.var,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        language: {
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.languageColor.var,
          whiteSpace: 'nowrap',
          // Next to a filename the language is redundant (the extension says it).
          '* + &': {
            display: 'none',
          },
        },
        actions: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
          flexShrink: 0,
        },
        /**
         * Copy button: a 28px ghost icon button. The text label is screen-reader only (the
         * button also carries `aria-label`); the icon swaps to a check on success.
         */
        copyButton: {
          appearance: 'none',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: '1.75rem',
          height: '1.75rem',
          padding: 0,
          border: 'none',
          backgroundColor: 'transparent',
          color: vars.copyButtonColor.var,
          borderRadius: t.radius.md.var,
          cursor: 'pointer',
          transition: t.transition.colorShift.var,
          '& [data-codeblock-copy-icon]': {
            display: 'inline-flex',
          },
          '& svg': {
            width: '1rem',
            height: '1rem',
          },
          '& [data-codeblock-copy-text]': {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          },
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
          '&:empty': {
            display: 'none',
          },
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
          overflowY: 'auto',
          maxHeight: vars.maxHeight.var,
        },
        pre: {
          // Scroll affordance: while more code is off to the right, the edge fades out.
          // The scroll-driven timeline is inactive when nothing overflows, so short code
          // keeps a hard edge and browsers without scroll timelines show no fade.
          ...inlineScrollFade('var-ui-code-block-scroll-fade', { end: vars.scrollFade }),
          margin: 0,
          paddingBlock: t.space.md.var,
          paddingInline: t.space.md.var,
          fontFamily: t.fontFamily.mono.var,
          fontSize: vars.fontSize.var,
          lineHeight: 1.7,
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
            backgroundColor: t.color.code.additionBackground.var,
            color: t.color.code.addition.var,
          },
          '&[data-line-tone="deleted"]': {
            backgroundColor: t.color.code.deletionBackground.var,
            color: t.color.code.deletion.var,
          },
          '&[data-line-tone="hunk"]': {
            color: t.color.code.section.var,
          },
        },
        lineNumber: {
          minWidth: '2ch',
          textAlign: 'end',
          fontSize: vars.fontSize.var,
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
