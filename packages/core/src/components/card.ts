import { atProperty } from 'typestyles';
import { media, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from './focusRing';

export const card = typestyles.recipe({
  name: 'card',
  layer: 'components',
  slots: ['root', 'title', 'body', 'grid', 'linkRoot', 'linkTitle', 'linkDescription', 'linkHint'],
  vars: {
    border: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    background: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    titleColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    bodyColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    linkTitleColor: {
      ...atProperty.color,
      value: t.color.tone.accent.foreground.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[2].var,
          padding: t.space[4].var,
          borderRadius: t.radius.md.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
          backgroundColor: vars.background.var,
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        },
        title: {
          margin: 0,
          fontSize: t.fontSize.lg.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.titleColor.var,
          lineHeight: 1.3,
        },
        body: {
          margin: 0,
          fontSize: t.fontSize.md.var,
          color: vars.bodyColor.var,
          lineHeight: 1.55,
        },
        grid: {
          display: 'grid',
          gap: t.space[4].var,
          gridTemplateColumns: '1fr',
          ...media('sm', 'min', {
            gridTemplateColumns: 'repeat(2, 1fr)',
          }),
        },
        linkRoot: {
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer',
          '&:hover': {
            [vars.border.name]: t.color.border.strong.var,
            boxShadow: t.shadow.xs.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
        linkTitle: {
          color: vars.linkTitleColor.var,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        linkDescription: {
          margin: 0,
          fontSize: t.fontSize.md.var,
          color: vars.bodyColor.var,
          lineHeight: 1.55,
        },
        linkHint: {
          marginTop: 'auto',
          paddingTop: t.space[2].var,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.bodyColor.var,
        },
      },
    };
  },
});
