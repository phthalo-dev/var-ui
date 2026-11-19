import { variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';

/**
 * Text link. By default it inherits the surrounding font size, so a link inside a `Text` or a
 * paragraph matches its sentence; `size` sets one for a standalone link ("← Back to runs").
 * `tone` picks the colour: `accent` (the link colour), or `primary` / `secondary` text for quiet
 * navigation links. The `icon` slot wraps a leading or trailing icon; it stays inline so a long
 * link still wraps like text.
 *
 * ```ts
 * const l = link({ tone: 'secondary', size: 'sm' });
 * <a href="/runs" className={l.root.className}>
 *   <span className={l.icon.className}>{arrowLeftSvg}</span>Back to runs
 * </a>
 * ```
 */
export const link = typestyles.recipe({
  name: 'link',
  layer: 'components',
  slots: ['root', 'icon'],
  variants: {
    tone: variant.enum(['accent', 'primary', 'secondary'], { default: 'accent' }),
    size: variant.enum(['inherit', 'xs', 'sm', 'md', 'lg'], { default: 'inherit' }),
  },
  styles: {
    base: {
      root: {
        color: t.color.link.default.var,
        textDecoration: 'none',
        fontWeight: t.fontWeight.medium.var,
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:focus-visible': {
          ...focusRing,
          borderRadius: t.radius.sm.var,
        },
        '&[aria-disabled="true"]': {
          cursor: 'not-allowed',
          opacity: t.opacity.disabled.var,
          textDecoration: 'none',
        },
      },
      icon: {
        display: 'inline-block',
        // Sit on the text's x-height whatever the font size: the icon is sized in `em`.
        verticalAlign: '-0.125em',
        inlineSize: '1em',
        blockSize: '1em',
        '& > svg': { display: 'block', inlineSize: '100%', blockSize: '100%' },
        '&:first-child': { marginInlineEnd: '0.25em' },
        '&:last-child': { marginInlineStart: '0.25em' },
      },
    },
    variants: {
      tone: {
        accent: {},
        primary: { root: { color: t.color.text.primary.var } },
        secondary: {
          root: {
            color: t.color.text.secondary.var,
            '&:hover': { color: t.color.text.primary.var },
          },
        },
      },
      size: {
        inherit: {},
        xs: { root: { fontSize: t.fontSize.xs.var } },
        sm: { root: { fontSize: t.fontSize.sm.var } },
        md: { root: { fontSize: t.fontSize.md.var } },
        lg: { root: { fontSize: t.fontSize.lg.var } },
      },
    },
  },
});

/** Visual props derived from the schema. */
export type LinkVariantProps = RecipeVariants<typeof link>;
