import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { semanticTone } from '../shared/semanticTone';
import { TONE_KEYS } from '../tokens/schema/color/tone';

const headingSize = variant.enum(['xs', 'sm', 'md', 'lg', 'xl', 'display'], { default: 'md' });

/**
 * Named heading recipe. Visual `size` is independent of the semantic level
 * the React wrapper renders — pick size for hierarchy, level for outline.
 *
 * ```tsx
 * <h3 className={heading({ size: 'lg' })}>Settings</h3>
 * ```
 */
export const heading = typestyles.recipe({
  name: 'heading',
  layer: 'components',
  variants: {
    size: headingSize,
  },
  vars: {
    color: { ...atProperty.color, value: t.color.text.primary.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        margin: 0,
        color: vars.color.var,
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
    };
  },
});

/**
 * Named body-text recipe (`Text` in React). Distinct from the `text` docs
 * utility in `styles.ts`.
 *
 * ```tsx
 * <p className={textBlock({ tone: 'secondary', size: 'sm' })}>hint</p>
 * ```
 */
export const textBlock = typestyles.recipe({
  name: 'text-block',
  layer: 'components',
  variants: {
    size: variant.enum(['xs', 'sm', 'md', 'lg'], { default: 'md' }),
    tone: variant.enum(['primary', 'secondary', ...TONE_KEYS], { default: 'primary' }),
    weight: variant.enum(['normal', 'medium', 'semibold'], { default: 'normal' }),
    lineClamp: variant.enum(['false', '1', '2', '3'], { default: 'false' }),
  },
  vars: {
    color: { ...atProperty.color, value: t.color.text.primary.var },
    secondaryColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        margin: 0,
        color: vars.color.var,
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
          secondary: { color: vars.secondaryColor.var },
          // Every semantic tone paints its foreground token. The axis is built from TONE_KEYS, so a
          // new token tone is a type error here until it is styled.
          accent: { color: semanticTone.accent.foreground },
          success: { color: semanticTone.success.foreground },
          warning: { color: semanticTone.warning.foreground },
          danger: { color: semanticTone.danger.foreground },
          info: { color: semanticTone.info.foreground },
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
    };
  },
});

/** Visual props derived from the schema. */
export type HeadingVariantProps = RecipeVariants<typeof heading>;

/** Visual props derived from the schema. */
export type TextBlockVariantProps = RecipeVariants<typeof textBlock>;
