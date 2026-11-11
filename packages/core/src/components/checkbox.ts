import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';
import { forced } from '../internal/forcedColors';
import { atForcedColors } from '../theme/conditions';
import { controlSizeVariants, indicatorSize } from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';

export const checkbox = typestyles.recipe({
  name: 'checkbox',
  layer: 'components',
  slots: ['root', 'box', 'label', 'group', 'groupLabel'],
  variants: { size: controlSize },
  vars: {
    boxBorder: {
      ...atProperty.color,
      value: t.color.border.strong.var,
    },
    boxBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    boxForeground: {
      ...atProperty.color,
      value: t.color.tone.accent.foregroundOnBackground.var,
    },
    groupLabelColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
        },
        box: {
          flexShrink: 0,
          borderRadius: t.radius.sm.var,
          ...border(vars.boxBorder.var),
          backgroundColor: vars.boxBackground.var,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: t.fontWeight.semibold.var,
          color: vars.boxForeground.var,
          '&[data-selected], &[data-indeterminate]': {
            [vars.boxBackground.name]: t.color.tone.accent.background.var,
            [vars.boxBorder.name]: t.color.tone.accent.background.var,
            ...atForcedColors(forced.selected),
          },
          ':focus-within > &': {
            ...focusRing,
          },
        },
        label: {},
        group: {
          display: 'grid',
          gap: t.space.xxs.var,
        },
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
            root: { gap: m.gap },
            box: { width: m.box, height: m.box, fontSize: m.markFontSize },
            label: { fontSize: m.labelFontSize },
          };
        }),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type CheckboxVariantProps = RecipeVariants<typeof checkbox>;
