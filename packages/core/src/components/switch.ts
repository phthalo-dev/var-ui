import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { controlSizeVariants, indicatorSize } from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';

const md = indicatorSize('md');

export const switchStyles = typestyles.recipe({
  name: 'switch',
  layer: 'components',
  slots: ['root', 'track', 'thumb', 'label'],
  variants: { size: controlSize },
  vars: {
    trackWidth: { ...atProperty.length, value: md.trackWidth },
    trackHeight: { ...atProperty.length, value: md.trackHeight },
    thumbSize: { ...atProperty.length, value: md.box },
    trackBackground: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    thumbBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
  },
  styles: ({ vars }) => {
    /** Gap between the track edge and the thumb. */
    const thumbInset = `calc((${vars.trackHeight.var} - ${vars.thumbSize.var}) / 2)`;
    /** The thumb travels the track width minus its own diameter and both insets, i.e. width minus height. */
    const thumbTravel = `calc(${vars.trackWidth.var} - ${vars.trackHeight.var})`;
    return {
      base: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
        },
        track: {
          position: 'relative',
          width: vars.trackWidth.var,
          flexShrink: 0,
          height: vars.trackHeight.var,
          borderRadius: t.radius.full.var,
          backgroundColor: vars.trackBackground.var,
          transition: t.transition.background.var,
          ...atForcedColors(forced.track),
          '&[data-selected]': {
            [vars.trackBackground.name]: t.color.tone.accent.background.var,
            ...atForcedColors(forced.fill),
          },
          ':focus-within > &': {
            ...focusRing,
          },
        },
        thumb: {
          position: 'absolute',
          top: thumbInset,
          insetInlineStart: thumbInset,
          width: vars.thumbSize.var,
          height: vars.thumbSize.var,
          borderRadius: t.radius.full.var,
          backgroundColor: vars.thumbBackground.var,
          transition: t.transition.transform.var,
          // Forced colors: the thumb is the only cue for state, so it contrasts with the track.
          ...atForcedColors({ backgroundColor: 'CanvasText' }),
          '&[data-selected]': {
            transform: `translateX(${thumbTravel})`,
            '[dir="rtl"] &': {
              transform: `translateX(calc(-1 * ${thumbTravel}))`,
            },
            ...atForcedColors(forced.mark),
          },
        },
        label: {},
      },
      variants: {
        size: controlSizeVariants((size) => {
          const m = indicatorSize(size);
          return {
            root: {
              gap: m.gap,
              [vars.trackWidth.name]: m.trackWidth,
              [vars.trackHeight.name]: m.trackHeight,
              [vars.thumbSize.name]: m.box,
            },
            label: { fontSize: m.labelFontSize },
          };
        }),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type SwitchVariantProps = RecipeVariants<typeof switchStyles>;
