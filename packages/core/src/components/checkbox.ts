import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const checkbox = typestyles.recipe({
  name: 'checkbox',
  layer: 'components',
  slots: ['root', 'box', 'label', 'group', 'groupLabel'],
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
          gap: t.space[2].var,
          cursor: 'pointer',
        },
        box: {
          width: '18px',
          height: '18px',
          borderRadius: t.radius.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.boxBorder.var,
          backgroundColor: vars.boxBackground.var,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: t.fontWeight.semibold.var,
          color: vars.boxForeground.var,
          '&[data-selected]': {
            [vars.boxBackground.name]: t.color.tone.accent.background.var,
            [vars.boxBorder.name]: t.color.tone.accent.background.var,
          },
          ':focus-within > &': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
        },
        label: {
          fontSize: t.fontSize.md.var,
        },
        group: {
          display: 'grid',
          gap: t.space[1].var,
        },
        groupLabel: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.groupLabelColor.var,
        },
      },
    };
  },
});
