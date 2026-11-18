import { codeBlock, designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');

/**
 * Docs page hero band: a softly tinted accent panel with a fading dot field (the Var UI stage
 * motif), category eyebrow, display title, lead, a copyable import line, and one row of
 * metadata (source, package, markdown). The page's tabs follow 24px below.
 */
export const docsPageHeader = typestyles.recipe({
  name: 'docs-page-header',
  layer: 'components',
  slots: [
    'root',
    'content',
    'preview',
    'eyebrow',
    'title',
    'lead',
    'importRow',
    'importCode',
    'meta',
    'metaItem',
    'metaLabel',
    'metaValue',
    'metaIcon',
    'metaCode',
  ],
  styles: () => ({
    base: {
      root: {
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        alignItems: 'center',
        columnGap: t.space.xl.var,
        // With a live preview the band splits: copy on the left, the component on the right.
        '&[data-has-preview]': {
          gridTemplateColumns: 'minmax(0, 1fr) minmax(14rem, 18rem)',
          [belowMd]: { gridTemplateColumns: 'minmax(0, 1fr)' },
        },
        marginBlockEnd: t.space.lg.var,
        padding: `${t.space.xl.var} ${t.space.xl.var} ${t.space.lg.var}`,
        minWidth: 0,
        borderRadius: t.radius.xl.var,
        border: `${t.borderWidth.default.var} solid color-mix(in oklab, ${t.color.tone.accent.foreground.var} 16%, ${t.color.border.subtle.var})`,
        // Surface + accent dot field fading under the text come from core `stage`.
        [belowMd]: {
          padding: `${t.space.lg.var} ${t.space.md.var} ${t.space.md.var}`,
          borderRadius: t.radius.lg.var,
        },
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.sm.var,
        minWidth: 0,
      },
      // The hero preview: the live component on a raised plate, at most 200px tall.
      preview: {
        display: 'grid',
        placeItems: 'center',
        boxSizing: 'border-box',
        minHeight: '7.5rem',
        maxHeight: '12.5rem',
        padding: t.space.md.var,
        overflow: 'hidden',
        borderRadius: t.radius.lg.var,
        border: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
        backgroundColor: t.color.background.surface.var,
        boxShadow: t.shadow.md.var,
        [belowMd]: { display: 'none' },
      },
      eyebrow: {
        margin: 0,
        fontSize: t.fontSize.xs.var,
        lineHeight: '1rem',
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: t.letterSpacing.caps.var,
        textTransform: 'uppercase',
        color: t.color.tone.accent.foreground.var,
      },
      title: {
        margin: 0,
        fontFamily: t.fontFamily.display.var,
        fontSize: 'clamp(2rem, 1.4rem + 1.8vw, 2.75rem)',
        lineHeight: 1.08,
        fontWeight: t.fontWeight.bold.var,
        letterSpacing: '-0.02em',
        color: t.color.text.primary.var,
      },
      lead: {
        margin: 0,
        maxWidth: '40rem',
        fontSize: '1.1875rem',
        lineHeight: '1.75rem',
        color: t.color.text.secondary.var,
        [belowMd]: {
          fontSize: '1.0625rem',
          lineHeight: '1.625rem',
        },
      },
      // The import statement as a copyable pill (the most-copied line on the page).
      importRow: {
        // The copy button reuses the codeBlock recipe outside a code block root, so seed the
        // code-block vars it reads (recipe vars are only defined on the recipe's root class).
        [codeBlock.vars.copyButtonColor.name]: t.color.text.secondary.var,
        [codeBlock.vars.filenameColor.name]: t.color.text.primary.var,
        [codeBlock.vars.copyButtonHoverBackground.name]:
          `color-mix(in oklab, ${t.color.text.primary.var} 7%, transparent)`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xxs.var,
        alignSelf: 'flex-start',
        maxWidth: '100%',
        marginBlockStart: t.space.xs.var,
        paddingInlineStart: t.space.sm.var,
        paddingInlineEnd: t.space.xxs.var,
        height: '2.25rem',
        boxSizing: 'border-box',
        borderRadius: t.radius.md.var,
        border: `${t.borderWidth.default.var} solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.surface.var,
      },
      importCode: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: t.fontFamily.mono.var,
        fontSize: '0.8125rem',
        fontWeight: t.fontWeight.normal.var,
        color: t.color.text.primary.var,
        backgroundColor: 'transparent',
        padding: 0,
      },
      meta: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: t.space.lg.var,
        rowGap: t.space.xs.var,
        margin: 0,
        marginBlockStart: t.space.xxs.var,
        padding: 0,
        listStyle: 'none',
        fontSize: t.fontSize.sm.var,
        lineHeight: '1.25rem',
      },
      metaItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xs.var,
        minWidth: 0,
      },
      metaLabel: {
        color: t.color.text.secondary.var,
      },
      metaValue: {
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: t.space.sm.var,
        minWidth: 0,
        color: t.color.text.primary.var,
        // Plain text links that underline on hover: a calm row inside the hero band.
        '& a': {
          color: 'inherit',
          fontWeight: t.fontWeight.medium.var,
          textDecoration: 'none',
          textUnderlineOffset: '0.1875rem',
          '&:hover': {
            color: t.color.link.default.var,
            textDecoration: 'underline',
          },
        },
      },
      metaIcon: {
        display: 'inline-flex',
        flexShrink: 0,
        color: t.color.text.secondary.var,
        '& svg': { width: '0.875rem', height: '0.875rem' },
      },
      metaCode: {
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.normal.var,
        color: t.color.text.primary.var,
        backgroundColor: 'transparent',
        padding: 0,
      },
    },
  }),
});

/** Page-level view tabs (Documentation / Playground / Props / Styles) under the page header. */
export const docsPageTabs = typestyles.recipe({
  name: 'docs-page-tabs',
  layer: 'components',
  slots: ['root', 'list', 'panel'],
  styles: () => ({
    base: {
      root: {
        gap: t.space.xl.var,
      },
      list: {
        display: 'flex',
      },
      panel: {
        minWidth: 0,
        padding: 0,
        '&[hidden]': { display: 'none' },
      },
    },
  }),
});

/**
 * Guide article under a `DocsPageHeader`: the MDX `# Title` is already the hero H1, so it is
 * hidden, and the paragraph after it reads as ordinary body text (the hero carries the lead).
 * `utilities` layer, alongside `proseContent`, whose heading rhythm it adjusts.
 */
export const docsGuideArticle = typestyles.recipe({
  name: 'docs-guide-article',
  layer: 'utilities',
  slots: ['root'],
  styles: () => ({
    base: {
      root: {
        minWidth: 0,
        '& > h1:first-child': {
          display: 'none',
        },
        '& > h1:first-child + p': {
          fontSize: 'inherit',
          lineHeight: 'inherit',
          color: 'inherit',
          marginBottom: t.space.md.var,
        },
        '& > h1:first-child + h2': {
          marginTop: 0,
        },
      },
    },
  }),
});
