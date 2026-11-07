import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { border } from '../internal/border';
import { focusRing } from '../internal/focusRing';
import { forced } from '../internal/forcedColors';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { atForcedColors } from '../theme/conditions';
import { controlSize, orientation } from '../shared/variantAxes';
import { mapTone, semanticTone, toneWithDefault } from '../shared/semanticTone';

/**
 * `outline` and `subtle` connect the buttons into one bordered strip; `ghost` has no resting
 * border and spaces the buttons apart.
 */
const toggleGroupAppearance = variant.enum(['outline', 'subtle', 'ghost'], {
  default: 'outline',
});

/**
 * Grouped toggle buttons (text formatting, alignment, view switches): any number of buttons can
 * be pressed. Connected-strip styling uses logical properties, so it mirrors in RTL.
 * `root` is the `role="group"` wrapper; `item` is each `<button aria-pressed>`.
 */
export const toggleGroup = typestyles.recipe({
  name: 'toggle-group',
  layer: 'components',
  slots: ['root', 'item'],
  variants: {
    tone: toneWithDefault('accent'),
    appearance: toggleGroupAppearance,
    size: controlSize,
    orientation,
  },
  vars: {
    border: { ...atProperty.color, value: t.color.border.default.var },
    background: { ...atProperty.color, value: t.color.background.surface.var },
    foreground: { ...atProperty.color, value: t.color.text.primary.var },
    pressedBackground: {
      ...atProperty.color,
      value: t.color.tone.accent.background.var,
    },
    pressedForeground: {
      ...atProperty.color,
      value: t.color.tone.accent.foregroundOnBackground.var,
    },
    pressedBorder: {
      ...atProperty.color,
      value: t.color.tone.accent.background.var,
    },
  },
  styles: ({ vars }) => ({
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'stretch',
        boxSizing: 'border-box',
      },
      item: {
        appearance: 'none',
        ...border(vars.border.var),
        position: 'relative',
        borderRadius: 0,
        backgroundColor: vars.background.var,
        color: vars.foreground.var,
        fontWeight: t.fontWeight.medium.var,
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        transition: t.transition.controlSurface.var,
        '&:hover:not([disabled])': {
          backgroundColor: t.color.background.subtle.var,
        },
        '&:hover, &:focus-visible': {
          zIndex: t.zIndex.raised.var,
        },
        '&:focus-visible': {
          ...focusRing,
        },
        '&[data-selected]': {
          backgroundColor: vars.pressedBackground.var,
          borderColor: vars.pressedBorder.var,
          color: vars.pressedForeground.var,
          zIndex: t.zIndex.raised.var,
          '&:hover:not([disabled])': {
            backgroundColor: vars.pressedBackground.var,
          },
          ...atForcedColors({ ...forced.selected, ...forced.focus }),
        },
        '&[disabled]': {
          opacity: t.opacity.disabled.var,
          cursor: 'not-allowed',
          ...atForcedColors(forced.disabled),
        },
      },
    },
    variants: {
      tone: mapTone((key) => {
        const ch = key === 'neutral' ? null : semanticTone[key];
        return {
          root: {
            [vars.pressedBackground.name]: ch ? ch.background : t.color.text.primary.var,
            [vars.pressedBorder.name]: ch ? ch.background : t.color.text.primary.var,
            [vars.pressedForeground.name]: ch
              ? ch.foregroundOnBackground
              : t.color.background.surface.var,
          },
        };
      }),
      appearance: {
        outline: {},
        subtle: {
          root: {
            [vars.background.name]: t.color.background.subtle.var,
            [vars.border.name]: 'transparent',
          },
        },
        ghost: {
          root: {
            gap: t.space[1].var,
            [vars.background.name]: 'transparent',
            [vars.border.name]: 'transparent',
          },
          item: {
            borderRadius: t.radius.md.var,
            // Reset connected-strip margins from the orientation variants.
            '&:not(:first-child)': {
              marginInlineStart: 0,
              marginBlockStart: 0,
            },
            '&:hover:not([disabled])': {
              backgroundColor: t.color.background.subtle.var,
            },
          },
        },
      },
      size: controlSizeVariants((size) => {
        const surface = controlSurfaceSize(size);
        // Square minimum so icon-only items are as wide as they are tall.
        return { item: { ...surface, minInlineSize: surface.height } };
      }),
      orientation: {
        horizontal: {
          root: { flexDirection: 'row' },
          // outline/subtle share a connected strip; ghost resets these margins.
          item: {
            '&:not(:first-child)': { marginInlineStart: '-0.0625rem' },
            '&:first-child': {
              borderStartStartRadius: t.radius.md.var,
              borderEndStartRadius: t.radius.md.var,
            },
            '&:last-child': {
              borderStartEndRadius: t.radius.md.var,
              borderEndEndRadius: t.radius.md.var,
            },
          },
        },
        vertical: {
          root: { flexDirection: 'column' },
          item: {
            '&:not(:first-child)': { marginBlockStart: '-0.0625rem' },
            '&:first-child': {
              borderStartStartRadius: t.radius.md.var,
              borderStartEndRadius: t.radius.md.var,
            },
            '&:last-child': {
              borderEndStartRadius: t.radius.md.var,
              borderEndEndRadius: t.radius.md.var,
            },
          },
        },
      },
    },
  }),
});

/** Visual props derived from the schema. */
export type ToggleGroupVariantProps = RecipeVariants<typeof toggleGroup>;
