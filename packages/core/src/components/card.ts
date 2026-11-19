import { atProperty } from 'typestyles';
import { media, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';

export const card = typestyles.recipe({
  name: 'card',
  layer: 'components',
  slots: [
    'root',
    'media',
    'header',
    'title',
    'titleEnd',
    'action',
    'description',
    'body',
    'grid',
    'linkRoot',
    'linkTitle',
    'linkDescription',
    'linkHint',
  ],
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
          gap: t.space.xs.var,
          padding: t.space.lg.var,
          // Surfaces use the surface radius step; controls inside stay on `md`.
          borderRadius: t.radius.lg.var,
          ...border(vars.border.var),
          backgroundColor: vars.background.var,
          transition: t.transition.borderShadow.var,
          '&[data-pressable]': {
            position: 'relative',
            cursor: 'pointer',
            transition: `${t.transition.borderShadow.var}, transform ${t.duration.fast.var} ${t.easing.standard.var}`,
            '&:hover': {
              [vars.border.name]:
                `color-mix(in oklab, ${t.color.tone.accent.foreground.var} 45%, ${t.color.border.default.var})`,
              boxShadow: t.shadow.md.var,
            },
            '&:has([data-card-action]:focus-visible)': { ...focusRing },
            // Links, buttons and fields inside stay usable above the stretched action.
            '& :where(a, button, input, select, textarea):not([data-card-action])': {
              position: 'relative',
              zIndex: 1,
            },
          },
        },
        // Title row: the title plus trailing content (a status badge) on one line.
        header: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          minWidth: 0,
        },
        titleEnd: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
          flexShrink: 0,
          marginInlineStart: 'auto',
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.md.var,
          color: vars.bodyColor.var,
          lineHeight: 1.55,
        },
        // Pressable cards (`onClick`): the title is a real `<button>` whose `::after` covers the
        // whole card, so the card has button semantics without block content inside a button.
        action: {
          all: 'unset',
          cursor: 'pointer',
          '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit' },
          '&:focus-visible': { outline: 'none' },
        },
        title: {
          margin: 0,
          minWidth: 0,
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
          gap: t.space.md.var,
          gridTemplateColumns: '1fr',
          ...media('sm', 'min', {
            gridTemplateColumns: 'repeat(2, 1fr)',
          }),
        },
        // Full-bleed media (thumbnail, preview) above the card text; the card clips it.
        media: {
          marginBlockStart: `calc(-1 * ${t.space.lg.var})`,
          marginInline: `calc(-1 * ${t.space.lg.var})`,
          marginBlockEnd: t.space.xs.var,
          minHeight: 0,
          overflow: 'hidden',
          borderBlockEnd: `${t.borderWidth.default.var} solid ${vars.border.var}`,
          borderStartStartRadius: 'inherit',
          borderStartEndRadius: 'inherit',
        },
        linkRoot: {
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer',
          overflow: 'hidden',
          transition: `${t.transition.borderShadow.var}, transform ${t.duration.fast.var} ${t.easing.standard.var}`,
          '&:hover': {
            [vars.border.name]:
              `color-mix(in oklab, ${t.color.tone.accent.foreground.var} 45%, ${t.color.border.default.var})`,
            boxShadow: t.shadow.md.var,
            transform: 'translateY(-1px)',
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
          paddingTop: t.space.xs.var,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.bodyColor.var,
        },
      },
    };
  },
});
