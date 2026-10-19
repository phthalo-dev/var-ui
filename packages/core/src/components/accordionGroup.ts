import { atProperty, type RecipeVariants, variant, type VariantOptions } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const accordionPane = variant.enum(['flush', 'bordered'], { default: 'bordered' });

/**
 * Outer chrome for stacked `Accordion` panels — border, radius, and overflow clip.
 */
export const accordionGroup = typestyles.recipe(
  'accordion-group',
  {
    slots: ['root'],
    variants: {
      variant: accordionPane,
    },
  },
  (c) => {
    const v = c.vars({
      border: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      background: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
    });
    return {
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          borderRadius: t.radius.md.var,
          backgroundColor: v.background.var,
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
  { layer: 'components' },
);

export type AccordionGroupVariant = VariantOptions<typeof accordionPane>;
export type AccordionGroupVariantProps = RecipeVariants<typeof accordionGroup>;
