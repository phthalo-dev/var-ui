import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

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
          height: '24px',
          borderRadius: t.radius.full.var,
          backgroundColor: vars.trackBackground.var,
          transition: 'background-color 140ms ease',
          '&[data-selected]': {
            [vars.trackBackground.name]: t.color.tone.accent.background.var,
          },
        },
        thumb: {
          position: 'absolute',
          top: '3px',
          left: '3px',
          width: '18px',
          height: '18px',
          borderRadius: t.radius.full.var,
          backgroundColor: vars.thumbBackground.var,
          transition: 'transform 140ms ease',
          '&[data-selected]': {
            transform: 'translateX(16px)',
          },
        },
        label: {
          fontSize: t.fontSize.md.var,
        },
      },
    };
  },
});
