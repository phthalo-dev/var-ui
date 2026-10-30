import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';

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
          gap: t.space[2].var,
          cursor: 'pointer',
        },
        track: {
          position: 'relative',
          width: '40px',
          flexShrink: 0,
          height: '24px',
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
          top: '3px',
          insetInlineStart: '3px',
          width: '18px',
          height: '18px',
          borderRadius: t.radius.full.var,
          backgroundColor: vars.thumbBackground.var,
          transition: t.transition.transform.var,
          // Forced colors: the thumb is the only cue for state, so it contrasts with the track.
          ...atForcedColors({ backgroundColor: 'CanvasText' }),
          '&[data-selected]': {
            transform: 'translateX(16px)',
            '[dir="rtl"] &': { transform: 'translateX(-16px)' },
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
