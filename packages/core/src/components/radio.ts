import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const radio = typestyles.recipe({
  name: 'radio',
  layer: 'components',
  slots: ['group', 'item', 'control', 'label', 'groupLabel'],
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
          gap: t.space[1].var,
        },
        item: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[2].var,
          cursor: 'pointer',
        },
        control: {
          width: '18px',
          height: '18px',
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.controlBorder.var,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            width: '8px',
            height: '8px',
            borderRadius: t.radius.full.var,
            backgroundColor: vars.indicatorBackground.var,
            transition: 'background-color 120ms ease',
          },
          '&[data-selected]::before': {
            [vars.indicatorBackground.name]: t.color.tone.accent.background.var,
          },
          ':focus-within > &': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
        },
        label: {
          fontSize: t.fontSize.md.var,
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
