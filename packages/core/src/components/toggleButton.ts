import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { duration } from '../tokens/defaults/duration';
import { easing } from '../tokens/defaults/easing';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';

/** Single toggle button and segmented-control item styling. */
export const toggleButton = typestyles.recipe({
  name: 'toggle-button',
  layer: 'components',
  variants: {
    size: controlSize,
    segmented: variant.boolean({ default: false }),
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
    foreground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    selectedBackground: {
      ...atProperty.color,
      value: t.color.tone.accent.background.var,
    },
    selectedForeground: {
      ...atProperty.color,
      value: t.color.tone.accent.foregroundOnBackground.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        appearance: 'none',
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: vars.border.var,
        borderRadius: t.radius.md.var,
        backgroundColor: vars.background.var,
        color: vars.foreground.var,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2].var,
        transition: 'background-color 140ms ease, border-color 140ms ease',
        '&:hover': {
          backgroundColor: t.color.background.subtle.var,
        },
        '&:focus-visible': {
          ...focusRing,
        },
        '&[data-selected]': {
          [vars.background.name]: vars.selectedBackground.var,
          [vars.border.name]: vars.selectedBackground.var,
          [vars.foreground.name]: vars.selectedForeground.var,
          '&:hover': {
            [vars.background.name]: t.color.link.hover.var,
            [vars.border.name]: t.color.link.hover.var,
          },
        },
      },
      variants: {
        size: controlSizeVariants((size) => controlSurfaceSize(size)),
        segmented: {
          true: {
            height: '100%',
            minHeight: 0,
            paddingBlock: 0,
            border: 'none',
            borderRadius: t.radius.full.var,
            backgroundColor: 'transparent',
            [vars.foreground.name]: t.color.text.secondary.var,
            fontWeight: t.fontWeight.normal.var,
            boxShadow: 'none',
            transition: `color ${duration.fast} ${easing.standard}`,
            '&:hover': {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            },
            '&[data-selected], &[aria-pressed="true"]': {
              [vars.background.name]: 'transparent',
              [vars.border.name]: 'transparent',
              [vars.foreground.name]: t.color.text.primary.var,
              fontWeight: t.fontWeight.semibold.var,
              boxShadow: 'none',
              '&:hover': {
                [vars.background.name]: 'transparent',
                [vars.border.name]: 'transparent',
              },
            },
          },
          false: {},
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ToggleButtonVariantProps = RecipeVariants<typeof toggleButton>;
