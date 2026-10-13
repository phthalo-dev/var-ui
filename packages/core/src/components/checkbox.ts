import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const checkbox = typestyles.recipe(
  'checkbox',
  (c) => {
    const v = c.vars({
      boxBorder: {
        value: t.color.border.strong.var,
        syntax: '<color>',
      },
      boxBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      boxForeground: {
        value: t.color.tone.accent.foregroundOnBackground.var,
        syntax: '<color>',
      },
      groupLabelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'box', 'label', 'group', 'groupLabel'],
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
        borderColor: v.boxBorder.var,
        backgroundColor: v.boxBackground.var,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: t.fontWeight.semibold.var,
        color: v.boxForeground.var,
        '&[data-selected]': {
          [v.boxBackground.name]: t.color.tone.accent.background.var,
          [v.boxBorder.name]: t.color.tone.accent.background.var,
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
        color: v.groupLabelColor.var,
      },
    };
  },
  { layer: 'components' },
);
