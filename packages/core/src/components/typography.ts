import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Named heading recipe. Visual `size` is independent of the semantic level
 * the React wrapper renders — pick size for hierarchy, level for outline.
 *
 * ```tsx
 * <h3 className={heading({ size: 'lg' })}>Settings</h3>
 * ```
 */
export const heading = typestyles.recipe(
  'heading',
  (c) => {
    const v = c.vars({
      color: { value: t.color.text.primary.var, syntax: '<color>' },
    });
    return {
      base: {
        margin: 0,
        color: v.color.var,
        fontFamily: t.fontFamily.display.var,
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: t.lineHeight.tight.var,
        letterSpacing: '-0.01em',
      },
      variants: {
        size: {
          xs: { fontSize: t.fontSize.md.var },
          sm: { fontSize: t.fontSize.lg.var },
          md: { fontSize: t.fontSize.xl.var },
          lg: { fontSize: t.fontSize['2xl'].var },
          xl: { fontSize: t.fontSize['3xl'].var },
          display: {
            fontSize: t.fontSize['3xl'].var,
            fontFamily: t.fontFamily.display.var,
            letterSpacing: '-0.02em',
          },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);

/**
 * Named body-text recipe (`Text` in React). Distinct from the `text` docs
 * utility in `styles.ts`.
 *
 * ```tsx
 * <p className={textBlock({ tone: 'secondary', size: 'sm' })}>hint</p>
 * ```
 */
export const textBlock = typestyles.recipe(
  'text-block',
  (c) => {
    const v = c.vars({
      color: { value: t.color.text.primary.var, syntax: '<color>' },
      secondaryColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        margin: 0,
        color: v.color.var,
        lineHeight: t.lineHeight.normal.var,
      },
      variants: {
        size: {
          xs: { fontSize: t.fontSize.xs.var },
          sm: { fontSize: t.fontSize.sm.var },
          md: { fontSize: t.fontSize.md.var },
          lg: { fontSize: t.fontSize.lg.var },
        },
        tone: {
          primary: {},
          secondary: { color: v.secondaryColor.var },
        },
        weight: {
          normal: { fontWeight: t.fontWeight.normal.var },
          medium: { fontWeight: t.fontWeight.medium.var },
          semibold: { fontWeight: t.fontWeight.semibold.var },
        },
        lineClamp: {
          false: {},
          '1': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          '2': {
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          },
          '3': {
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
          },
        },
      },
      defaultVariants: { size: 'md', tone: 'primary', weight: 'normal', lineClamp: 'false' },
    };
  },
  { layer: 'components' },
);
