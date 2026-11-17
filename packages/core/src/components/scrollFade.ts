import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { inlineScrollFade } from '../internal/scrollFade';

/**
 * Scroll affordance for any horizontal scroller: the edges fade while there is more to see
 * in that direction (scroll-driven, no JavaScript). Apply to the element that scrolls —
 * chip rows, tab strips, wide tables, code.
 *
 * ```tsx
 * <div {...mergeProps(scrollFade())}>…a row that can overflow…</div>
 * ```
 */
export const scrollFade = typestyles.recipe({
  name: 'scroll-fade',
  layer: 'components',
  vars: {
    start: { ...atProperty.length, value: '0px' },
    end: { ...atProperty.length, value: '0px' },
  },
  styles: ({ vars }) => ({
    base: {
      overflowX: 'auto',
      scrollbarWidth: 'thin',
      ...inlineScrollFade('var-ui-scroll-fade', { start: vars.start, end: vars.end }),
    },
  }),
});

/** Visual props derived from the schema. */
export type ScrollFadeVariantProps = RecipeVariants<typeof scrollFade>;
