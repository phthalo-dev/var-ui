import { designTokens as t, focusRing, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');

/**
 * Docs kit chrome for `@var-ui/docs/CodeBlock`: a demo "stage" (dot-grid preview) joined to the
 * shared code block, with an optional collapse toggle floating over a fade.
 */
export const codeBlock = typestyles.recipe({
  name: 'docs-code-block',
  layer: 'components',
  slots: [
    'root',
    'card',
    'stageWrap',
    'toolbar',
    'preview',
    'previewInner',
    'code',
    'codeBlock',
    'codeFade',
    'expand',
    'expandButton',
  ],
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xs.var,
      },
      card: {
        borderRadius: t.radius.lg.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        backgroundColor: t.color.background.surface.var,
        overflow: 'hidden',
      },
      stageWrap: {
        position: 'relative',
        // Reveal the toolbar while the pointer or focus is anywhere on the stage.
        '&:is(:hover, :focus-within) > [role="toolbar"]': {
          opacity: 1,
        },
      },
      // Small preview toolbar (color mode, direction), top-right, shown on hover / focus.
      toolbar: {
        position: 'absolute',
        top: t.space.xs.var,
        insetInlineEnd: t.space.xs.var,
        display: 'flex',
        gap: '0.125rem',
        padding: '0.125rem',
        borderRadius: t.radius.md.var,
        border: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
        backgroundColor: t.color.background.surface.var,
        boxShadow: t.shadow.xs.var,
        opacity: 0,
        transition: `opacity ${t.duration.fast.var} ${t.easing.standard.var}`,
        '& [aria-pressed="true"]': {
          color: t.color.tone.accent.foreground.var,
          backgroundColor: t.color.tone.accent.subtleBackground.var,
        },
        '& svg': { width: '1rem', height: '1rem' },
        '@media (hover: none)': { opacity: 1 },
      },
      // Layout only: the surface and dot field come from the core `stage` recipe. Height follows
      // the content, with a 120px floor.
      preview: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '7.5rem',
        padding: `${t.space.xl.var} ${t.space.lg.var}`,
        overflowX: 'auto',
        [belowMd]: {
          padding: `${t.space.xl.var} ${t.space.md.var}`,
        },
      },
      previewInner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minWidth: 0,
      },
      code: {
        position: 'relative',
        borderTopWidth: t.borderWidth.default.var,
        borderTopStyle: 'solid',
        borderTopColor: t.color.border.default.var,
      },
      // Inside a demo card the code block drops its own frame: the card is the frame.
      codeBlock: {
        '& .var-ui-code-block': {
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
        },
      },
      codeFade: {
        position: 'absolute',
        insetInline: 0,
        bottom: 0,
        height: '5rem',
        pointerEvents: 'none',
        background: `linear-gradient(to bottom, transparent, ${t.color.background.code.var} 70%)`,
      },
      // Collapsed: a small ghost button floating over the fade. Expanded: a quiet footer row.
      expand: {
        display: 'flex',
        justifyContent: 'center',
        paddingBlock: t.space.sm.var,
        backgroundColor: t.color.background.code.var,
        '&[hidden]': { display: 'none' },
        '[data-demo-collapsed] > &': {
          position: 'absolute',
          insetInline: 0,
          bottom: 0,
          backgroundColor: 'transparent',
          pointerEvents: 'none',
        },
      },
      expandButton: {
        appearance: 'none',
        pointerEvents: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        height: '1.75rem',
        paddingInline: t.space.sm.var,
        borderRadius: t.radius.full.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        backgroundColor: t.color.background.surface.var,
        boxShadow: t.shadow.xs.var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.medium.var,
        fontFamily: 'inherit',
        color: t.color.text.secondary.var,
        cursor: 'pointer',
        transition: t.transition.colorShift.var,
        '&:hover': {
          color: t.color.text.primary.var,
          borderColor: t.color.border.strong.var,
        },
        '&:focus-visible': {
          ...focusRing,
        },
      },
    },
  }),
});
