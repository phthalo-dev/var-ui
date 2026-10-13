import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const outline = typestyles.recipe(
  'outline',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>' },
      titleColor: { value: t.color.text.secondary.var, syntax: '<color>' },
      linkColor: { value: t.color.text.secondary.var, syntax: '<color>' },
      linkActiveColor: { value: t.color.text.primary.var, syntax: '<color>' },
    });
    return {
      slots: ['root', 'title', 'list', 'link', 'linkActive', 'linkNested'],
      root: {
        paddingInlineStart: t.space[2].var,
        borderInlineStartWidth: t.borderWidth.default.var,
        borderInlineStartStyle: 'solid',
        borderInlineStartColor: v.border.var,
      },
      title: {
        margin: 0,
        marginBottom: t.space[2].var,
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: v.titleColor.var,
      },
      list: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
      },
      link: {
        display: 'block',
        fontSize: t.fontSize.sm.var,
        color: v.linkColor.var,
        textDecoration: 'none',
        '&:hover': {
          color: v.linkActiveColor.var,
        },
      },
      linkActive: {
        display: 'block',
        fontSize: t.fontSize.sm.var,
        color: v.linkActiveColor.var,
        fontWeight: t.fontWeight.semibold.var,
        textDecoration: 'none',
      },
      linkNested: {
        paddingInlineStart: t.space[3].var,
      },
    };
  },
  { layer: 'components' },
);
