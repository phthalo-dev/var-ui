import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';
import { forced } from '../internal/forcedColors';
import { atForcedColors } from '../theme/conditions';
import { controlSizeVariants, indicatorSize } from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';

export const radio = typestyles.recipe({
  name: 'radio',
  layer: 'components',
  slots: ['group', 'item', 'control', 'label', 'groupLabel'],
  variants: { size: controlSize },
  vars: {
    controlBorder: {
      ...atProperty.color,
      value: t.color.border.strong.var,
    },
    indicatorBackground: {
      ...atProperty.color,
      value: 'transparent',
    },
    groupLabelColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        group: {
          display: 'grid',
          gap: t.space.xxs.var,
        },
        item: {
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
        },
        control: {
          flexShrink: 0,
          borderRadius: t.radius.full.var,
          ...border(vars.controlBorder.var),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            borderRadius: t.radius.full.var,
            backgroundColor: vars.indicatorBackground.var,
            transition: t.transition.background.var,
          },
          '&[data-selected]::before': {
            [vars.indicatorBackground.name]: t.color.tone.accent.background.var,
            ...atForcedColors(forced.fill),
          },
          ':focus-within > &': {
            ...focusRing,
          },
        },
        label: {},
        groupLabel: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.groupLabelColor.var,
        },
      },
      variants: {
        size: controlSizeVariants((size) => {
          const m = indicatorSize(size);
          return {
            item: { gap: m.gap },
            control: {
              width: m.box,
              height: m.box,
              '&::before': { width: m.dot, height: m.dot },
            },
            label: { fontSize: m.labelFontSize },
          };
        }),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type RadioVariantProps = RecipeVariants<typeof radio>;
