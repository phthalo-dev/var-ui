import { atProperty } from 'typestyles';
import { designTokens as t, prose, proseRules, recipeVars, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');
const pv = recipeVars(prose);

/** One solid logical border side, as longhands (so a state can still swap just the color). */
const side = (
  name: 'block-end' | 'inline-start',
  color: string,
  width = t.borderWidth.default.var,
) => {
  const prefix = name === 'block-end' ? 'borderBlockEnd' : 'borderInlineStart';
  return { [`${prefix}Width`]: width, [`${prefix}Style`]: 'solid', [`${prefix}Color`]: color };
};

/**
 * Docs long-form reading style, applied after `prose` (see {@link docsArticleProse}):
 *
 * ```astro
 * <article {...combine(...docsArticleProse(), article.root)}>
 * ```
 *
 * `prose` supplies the element rules and the `[data-not-prose]` opt-out (demo stages, widgets).
 * This recipe tunes prose's vars to the docs ramp (a fixed 16/26 reading size, display-font
 * headings) and adds what only the docs need: the lead paragraph, the docs table and inline-code
 * styles, keyboard keys, status badges, and spacing for code blocks and demos. It sits in the
 * `base` layer beside `prose`, so components rendered inside keep their own styles. Its var
 * settings tie with `prose`'s defaults on specificity and win by coming later (this module
 * imports `prose`, so it always registers after it).
 */
export const docsProse = typestyles.recipe({
  name: 'docs-prose',
  layer: 'base',
  vars: {
    tableBorder: { ...atProperty.color, value: t.color.border.default.var },
    tableCellBorder: { ...atProperty.color, value: t.color.border.subtle.var },
    blockquoteBorder: { ...atProperty.color, value: t.color.border.strong.var },
    preBackground: { ...atProperty.color, value: t.color.background.subtle.var },
  },
  styles: ({ vars }) => ({
    base: {
      // Long-form reading size: 16/26, independent of the 14px control scale.
      fontFamily: t.fontFamily.body.var,
      fontSize: t.fontSize.prose.body.var,
      color: t.color.text.primary.var,
      [pv.lineHeight.name]: t.lineHeight.prose.body.var,
      [pv.flow.name]: t.space.md.var,
      [pv.h1Size.name]: t.fontSize.prose.h1.var,
      [pv.h2Size.name]: t.fontSize.prose.h2.var,
      [pv.h3Size.name]: t.fontSize.prose.h3.var,
      [pv.borderColor.name]: t.color.border.default.var,
      [pv.codeBackground.name]: `color-mix(in srgb, ${t.color.text.primary.var} 6%, transparent)`,
      [belowMd]: {
        [pv.h1Size.name]: '2rem',
        [pv.h2Size.name]: '1.5rem',
      },
      ...proseRules({
        '& :where(h1, h2, h3, h4, h5, h6)': {
          fontFamily: t.fontFamily.display.var,
          color: t.color.text.primary.var,
        },
        '& h1': {
          fontWeight: t.fontWeight.bold.var,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginTop: 0,
          marginBottom: t.space.md.var,
        },
        // The paragraph right after the page title is the lead: larger and muted.
        '& > h1 + p': {
          fontSize: t.fontSize.prose.lead.var,
          lineHeight: t.lineHeight.prose.lead.var,
          color: t.color.text.secondary.var,
          marginBottom: t.space.lg.var,
          [belowMd]: {
            fontSize: '1.0625rem',
            lineHeight: '1.625rem',
          },
        },
        // H2 opens a major section: 28/34 at 650, 56px of air above it.
        '& h2': {
          fontWeight: 650,
          letterSpacing: '-0.015em',
          lineHeight: t.lineHeight.prose.h2.var,
          marginTop: '3.5rem',
          marginBottom: t.space.md.var,
          [belowMd]: {
            lineHeight: '1.875rem',
            marginTop: t.space.xxl.var,
          },
        },
        '& h3': {
          letterSpacing: '-0.01em',
          lineHeight: t.lineHeight.prose.h3.var,
          marginTop: t.space.xl.var,
          marginBottom: t.space.xs.var,
        },
        // An H3 that directly follows its H2 sits closer: they read as one heading group.
        '& h2 + h3': {
          marginTop: t.space.lg.var,
        },
        '& h4, & h5, & h6': {
          lineHeight: '1.5rem',
          marginTop: t.space.lg.var,
          marginBottom: t.space.xxs.var,
        },
        '& p': {
          marginTop: 0,
          marginBottom: t.space.md.var,
        },
        '& ul, & ol': {
          marginTop: 0,
          marginBottom: t.space.md.var,
          paddingInlineStart: '1.25rem',
        },
        '& li': {
          marginBottom: '0.375rem',
          paddingInlineStart: t.space.xxs.var,
        },
        '& li + li': {
          marginTop: 0,
        },
        // Links: accent text with a quiet 30% underline that firms up on hover.
        '& a': {
          textUnderlineOffset: '0.1875rem',
          textDecorationColor: 'color-mix(in srgb, currentColor 30%, transparent)',
          fontWeight: t.fontWeight.medium.var,
          transition: t.transition.colorShift.var,
          '&:hover': {
            color: t.color.link.hover.var,
          },
        },
        // Inline `code`: a quiet neutral chip in body color (tight 4px sides, so punctuation
        // sits against it), never competing with links.
        '& :not(pre) > code': {
          fontWeight: t.fontWeight.normal.var,
          color: t.color.text.primary.var,
          paddingBlock: '0.0625rem',
          paddingInline: '0.25rem',
        },
        // Table cells carry mono text only; the first column keeps the chip because it names
        // the thing the row is about. Everywhere else (prose, lists, leads) code is a chip.
        '& :where(table:not([class])) td > code': {
          backgroundColor: 'transparent',
          paddingInline: 0,
        },
        '& :where(table:not([class])) td:first-child > code': {
          backgroundColor: pv.codeBackground.var,
          paddingInline: '0.25rem',
        },
        '& a > code': {
          color: 'inherit',
        },
        '& a[data-alert-action]': {
          color: 'inherit',
          fontWeight: 'inherit',
          textDecoration: 'underline',
          textDecorationColor: 'currentColor',
          '&:hover': {
            color: 'inherit',
            textDecoration: 'none',
          },
        },
        '& pre:not([data-codeblock-pre])': {
          fontSize: '0.8125rem',
          lineHeight: '1.375rem',
          backgroundColor: vars.preBackground.var,
          padding: `${t.space.md.var} ${t.space.lg.var}`,
          borderRadius: t.radius.lg.var,
          marginBottom: t.space.md.var,
        },
        '& pre code': {
          backgroundColor: 'transparent',
          padding: 0,
          border: 'none',
          borderRadius: 0,
          fontWeight: 'inherit',
          color: 'inherit',
          whiteSpace: 'pre',
        },
        // Code blocks and demos sit as siblings of prose: 24px from text, 12px between a pair.
        '& > :is([data-codeblock], [data-code-block])': {
          marginBlock: t.space.lg.var,
        },
        '& > :is([data-codeblock], [data-code-block]) + :is([data-codeblock], [data-code-block])': {
          marginTop: t.space.sm.var,
        },
        '& > :is([data-codeblock], [data-code-block]):first-child': {
          marginTop: 0,
        },
        '& > :is([data-codeblock], [data-code-block]):last-child': {
          marginBottom: 0,
        },
        '& blockquote': {
          margin: `${t.space.lg.var} 0`,
          paddingBlock: t.space.xxs.var,
          paddingInline: `${t.space.md.var} 0`,
          ...side('inline-start', vars.blockquoteBorder.var, t.borderWidth.thick.var),
          fontStyle: 'normal',
        },
        '& blockquote p': {
          marginBottom: t.space.xs.var,
        },
        '& blockquote p:last-child': {
          marginBottom: 0,
        },
        '& kbd': {
          fontFamily: t.fontFamily.mono.var,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          padding: `0.125rem ${t.space.xs.var}`,
          borderRadius: t.radius.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: t.color.border.strong.var,
          backgroundColor: t.color.background.surface.var,
          boxShadow: `0 0.0625rem 0 ${t.color.border.default.var}`,
          whiteSpace: 'nowrap',
        },
        '& [data-docs-badge]': {
          display: 'inline-flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          lineHeight: 1.2,
          padding: `0.125rem ${t.space.xs.var}`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: t.color.border.default.var,
          backgroundColor: t.color.background.subtle.var,
          color: t.color.text.primary.var,
          verticalAlign: '0.08em',
        },
        '& [data-docs-badge][data-docs-badge-tone="success"]': badgeTone('success', 14, 85),
        '& [data-docs-badge][data-docs-badge-tone="warning"]': badgeTone('warning', 16, 75),
        '& [data-docs-badge][data-docs-badge-tone="danger"]': badgeTone('danger', 12, 80),
        '& [data-docs-badge][data-docs-badge-tone="info"]': badgeTone('accent', 12, 75),
        '& hr': {
          margin: `${t.space.lg.var} 0`,
          [belowMd]: {
            margin: `${t.space.md.var} 0`,
          },
        },
        // Markdown tables (no class). A Var UI `Table` keeps its own look.
        '& table:not([class])': {
          display: 'table',
          width: '100%',
          marginBlock: `${t.space.md.var} ${t.space.lg.var}`,
          fontSize: t.fontSize.md.var,
          lineHeight: '1.25rem',
        },
        '& :where(table:not([class])) thead': {
          ...side('block-end', vars.tableBorder.var),
        },
        '& :where(table:not([class])) :is(th, td)': {
          paddingBlock: t.space.sm.var,
          paddingInline: `0 ${t.space.lg.var}`,
          ...side('block-end', vars.tableCellBorder.var),
        },
        '& :where(table:not([class])) :is(th, td):last-child': {
          paddingInlineEnd: 0,
        },
        // Column headers only: a row header (`tbody th`) is body text.
        '& :where(table:not([class])) thead th': {
          paddingBlock: t.space.xs.var,
          fontSize: t.fontSize.xs.var,
          color: t.color.text.secondary.var,
          textTransform: 'uppercase',
          letterSpacing: t.letterSpacing.caps.var,
          whiteSpace: 'nowrap',
        },
        '& :where(table:not([class])) tr:last-child td': {
          borderBottom: 'none',
        },
        '& :where(table:not([class])) caption': {
          captionSide: 'bottom',
          paddingTop: t.space.xs.var,
          fontSize: t.fontSize.sm.var,
          color: t.color.text.secondary.var,
          textAlign: 'start',
        },
      }),
    },
  }),
});

/**
 * The class parts of a docs article: `prose`, then {@link docsProse}. Spread them into
 * `combine` / `mergeProps`. The default density: `docsProse` sets every density knob itself,
 * and a density variant's attribute selector would out-rank those settings.
 */
export function docsArticleProse() {
  return [prose(), docsProse()] as const;
}

/** Scroll container for a wide table inside docs prose (wrap it by hand). */
export const docsProseTableWrap = typestyles.recipe({
  name: 'docs-prose-table-wrap',
  layer: 'components',
  styles: () => ({
    base: {
      overflowX: 'auto',
      marginBottom: t.space.sm.var,
    },
  }),
});

function badgeTone(
  tone: 'success' | 'warning' | 'danger' | 'accent',
  fillPercent: number,
  textPercent: number,
) {
  const fg = t.color.tone[tone].foreground.var;
  return {
    borderColor: `color-mix(in srgb, ${fg} 45%, ${t.color.border.default.var})`,
    backgroundColor: `color-mix(in srgb, ${fg} ${fillPercent}%, ${t.color.background.surface.var})`,
    color: `color-mix(in srgb, ${fg} ${textPercent}%, ${t.color.text.primary.var})`,
  };
}
