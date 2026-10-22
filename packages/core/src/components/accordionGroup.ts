import { atProperty, type RecipeVariants, variant, type VariantOptions } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const accordionPane = variant.enum(['flush', 'bordered'], { default: 'bordered' });

/**
 * Outer chrome for stacked `Accordion` panels — border, radius, and overflow clip.
 */
export const accordionGroup = typestyles.recipe({
  name: 'accordion-group',
  layer: 'components',
  slots: ['root'],
  variants: {
    variant: accordionPane,
  },
  vars: {
    border: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    background: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.background.var,
          overflow: 'hidden',
        },
      },
      variants: {
        variant: {
          flush: {
            root: {
              borderWidth: 0,
              borderRadius: 0,
              backgroundColor: 'transparent',
            },
          },
          bordered: {},
        },
      },
    };
  },
});

export type AccordionGroupVariant = VariantOptions<typeof accordionPane>;
export type AccordionGroupVariantProps = RecipeVariants<typeof accordionGroup>;
