import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { border, borderSide } from '../internal/border';
import { focusRing } from '../internal/focusRing';
import { density } from '../shared/variantAxes';

/**
 * Rendered markdown or rich text inside app UI: chat bubbles, trace panels, notes, descriptions.
 * It styles the bare elements a markdown renderer emits (headings, paragraphs, lists, links,
 * inline and fenced code, blockquotes, tables, rules) relative to the surrounding font size, so
 * it fits whatever it sits in. `density` sets the rhythm: `compact` for chat bubbles and cards,
 * `balanced` for panels, `spacious` for reading views.
 *
 * Element rules live in the `base` cascade layer. A Var UI component rendered inside (a
 * `CodeBlock`, `Table`, `Link` or `Code`, e.g. through the React `proseComponents` mapping)
 * is in the `components` layer, so its own styles win without any specificity contest.
 *
 * ```ts
 * <div className={prose({ density: 'compact' }).className}>{html}</div>
 * ```
 */
export const prose = typestyles.recipe({
  name: 'prose',
  layer: 'base',
  variants: { density },
  vars: {
    /** Space between blocks (paragraphs, lists, code, tables). */
    flow: { ...atProperty.length, value: t.space.sm.var },
    /** Space above a heading; below it is `flow`. */
    headingGap: { ...atProperty.length, value: t.space.md.var },
    /** Heading scale, as multiples of the body size. */
    h1Size: { syntax: '*', value: '1.5em' },
    h2Size: { syntax: '*', value: '1.25em' },
    h3Size: { syntax: '*', value: '1.125em' },
    lineHeight: { syntax: '*', value: t.lineHeight.normal.var },
    secondaryColor: { ...atProperty.color, value: t.color.text.secondary.var },
    borderColor: { ...atProperty.color, value: t.color.border.default.var },
    codeBackground: { ...atProperty.color, value: t.color.background.subtle.var },
  },
  styles: ({ vars }) => ({
    base: {
      lineHeight: vars.lineHeight.var,
      overflowWrap: 'break-word',
      '& > :first-child': { marginBlockStart: 0 },
      '& :where(p, ul, ol, pre, blockquote, table, hr)': { marginBlock: 0 },
      // Flow between blocks, bare elements and components alike (a mapped CodeBlock or Table
      // sets no outer margin, so this reaches it from the base layer).
      '& > :where(:not(:last-child)), & :where(li, blockquote) > :where(:not(:last-child))': {
        marginBlockEnd: vars.flow.var,
      },
      '& :where(h1, h2, h3, h4, h5, h6)': {
        marginBlock: `${vars.headingGap.var} ${vars.flow.var}`,
        fontFamily: 'inherit',
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: t.lineHeight.tight.var,
        color: 'inherit',
      },
      '& :where(h1)': { fontSize: vars.h1Size.var },
      '& :where(h2)': { fontSize: vars.h2Size.var },
      '& :where(h3)': { fontSize: vars.h3Size.var },
      '& :where(h4, h5, h6)': { fontSize: '1em' },
      '& :where(ul, ol)': { paddingInlineStart: '1.5em' },
      '& :where(li + li, li > ul, li > ol)': { marginBlockStart: '0.25em' },
      '& :where(li > ul, li > ol)': { marginBlockEnd: 0 },
      '& :where(li)::marker': { color: vars.secondaryColor.var },
      '& :where(strong, b)': { fontWeight: t.fontWeight.semibold.var },
      '& :where(a)': {
        color: t.color.link.default.var,
        textDecoration: 'underline',
        textDecorationThickness: '0.0625rem',
        textUnderlineOffset: '0.15em',
        textDecorationColor: 'color-mix(in srgb, currentColor 40%, transparent)',
        '&:hover': { textDecorationColor: 'currentColor' },
        '&:focus-visible': { ...focusRing, borderRadius: t.radius.sm.var },
      },
      '& :where(:not(pre) > code)': {
        fontFamily: t.fontFamily.mono.var,
        fontSize: '0.875em',
        paddingInline: '0.25em',
        borderRadius: t.radius.sm.var,
        backgroundColor: vars.codeBackground.var,
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      },
      '& :where(pre)': {
        overflowX: 'auto',
        padding: `${t.space.sm.var} ${t.space.md.var}`,
        borderRadius: t.radius.md.var,
        ...border(vars.borderColor.var),
        backgroundColor: vars.codeBackground.var,
        fontFamily: t.fontFamily.mono.var,
        fontSize: '0.875em',
        lineHeight: t.lineHeight.normal.var,
      },
      '& :where(pre code)': { fontSize: 'inherit', fontFamily: 'inherit' },
      '& :where(blockquote)': {
        marginInline: 0,
        paddingInlineStart: '0.875em',
        ...borderSide('inline-start', vars.borderColor.var, t.borderWidth.thick.var),
        color: vars.secondaryColor.var,
      },
      '& :where(hr)': {
        border: 'none',
        ...borderSide('block-start', vars.borderColor.var),
      },
      '& :where(table)': {
        display: 'block',
        maxInlineSize: '100%',
        overflowX: 'auto',
        borderCollapse: 'collapse',
        fontSize: '0.9375em',
      },
      '& :where(th, td)': {
        padding: '0.375em 0.75em',
        textAlign: 'start',
        verticalAlign: 'top',
        ...borderSide('block-end', vars.borderColor.var),
        backgroundColor: 'transparent',
      },
      '& :where(th)': { fontWeight: t.fontWeight.semibold.var },
      '& :where(caption)': {
        captionSide: 'bottom',
        paddingBlockStart: '0.375em',
        textAlign: 'start',
        color: vars.secondaryColor.var,
      },
      '& :where(img, video)': { maxInlineSize: '100%', blockSize: 'auto' },
    },
    variants: {
      density: {
        compact: {
          [vars.flow.name]: t.space.xs.var,
          [vars.headingGap.name]: t.space.sm.var,
          [vars.h1Size.name]: '1.25em',
          [vars.h2Size.name]: '1.125em',
          [vars.h3Size.name]: '1em',
        },
        balanced: {},
        spacious: {
          [vars.flow.name]: t.space.md.var,
          [vars.headingGap.name]: t.space.xl.var,
          [vars.h1Size.name]: '1.875em',
          [vars.h2Size.name]: '1.5em',
          [vars.h3Size.name]: '1.25em',
          [vars.lineHeight.name]: t.lineHeight.relaxed.var,
        },
      },
    },
  }),
});

export type ProseVariantProps = RecipeVariants<typeof prose>;
