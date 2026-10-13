import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const layout = typestyles.recipe(
  'ds-layout',
  (c) => {
    const v = c.vars({
      foreground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      sectionBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      sectionBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        fontFamily: t.fontFamily.body.var,
        color: v.foreground.var,
      },
      stack: {
        display: 'grid',
        gap: t.space[5].var,
      },
      section: {
        display: 'grid',
        gap: t.space[3].var,
        padding: t.space[4].var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.sectionBorder.var,
        borderRadius: t.radius.lg.var,
        backgroundColor: v.sectionBackground.var,
        boxShadow: t.shadow.xs.var,
      },
      row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: t.space[3].var,
        alignItems: 'center',
      },
    };
  },
  { layer: 'utilities' },
);

export const text = typestyles.recipe(
  'ds-text',
  (c) => {
    const v = c.vars({
      foreground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      secondaryColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        margin: 0,
        color: v.foreground.var,
      },
      title: {
        fontSize: '28px',
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: '-0.02em',
      },
      subtitle: {
        fontSize: t.fontSize.lg.var,
        color: v.secondaryColor.var,
      },
      sectionTitle: {
        fontSize: '20px',
        fontWeight: t.fontWeight.semibold.var,
      },
      label: {
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
      },
      caption: {
        fontSize: t.fontSize.sm.var,
        color: v.secondaryColor.var,
      },
    };
  },
  { layer: 'utilities' },
);
