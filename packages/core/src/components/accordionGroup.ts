import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { paneVariant } from './variantAxes';

/**
 * Outer chrome for stacked `Accordion` panels — border, radius, and overflow clip.
 */
export const accordionGroup = typestyles.recipe(
  'accordion-group',
  {
    slots: ['root'],
    variants: {
      variant: paneVariant,
    },
  },
  (c) => {
    const v = c.vars({
      border: {
        value: t.color.border.default.var,
        syntax: atProperty.color.syntax,
      },
      background: {
        value: t.color.background.surface.var,
        syntax: atProperty.color.syntax,
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

export type AccordionGroupRecipeProps = NonNullable<Parameters<typeof accordionGroup>[0]>;
export type AccordionGroupVariant = NonNullable<AccordionGroupRecipeProps['variant']>;

export type AccordionGroupVariantProps = {
  variant?: AccordionGroupVariant;
};

export const accordionGroupVariantPropDocs = [
  { name: 'variant', type: "'flush' | 'bordered'", required: false },
] as const satisfies ReadonlyArray<{
  name: keyof AccordionGroupVariantProps;
  type: string;
  required: false;
}>;
