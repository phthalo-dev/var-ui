import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';

const { box, trackWidth, trackHeight } = t.size.indicator;
/** Gap between the track edge and the thumb. */
const thumbInset = `calc((${trackHeight.var} - ${box.var}) / 2)`;
/** The thumb travels the track width minus its own diameter and both insets, i.e. width minus height. */
const thumbTravel = `calc(${trackWidth.var} - ${trackHeight.var})`;

export const switchStyles = typestyles.recipe({
  name: 'switch',
  layer: 'components',
  slots: ['root', 'track', 'thumb', 'label'],
  vars: {
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
    return {
      base: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          cursor: 'pointer',
        },
        track: {
          position: 'relative',
          width: trackWidth.var,
          flexShrink: 0,
          height: trackHeight.var,
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
          width: box.var,
          height: box.var,
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
        label: {
          fontSize: t.fontSize.md.var,
        },
      },
    };
  },
});
