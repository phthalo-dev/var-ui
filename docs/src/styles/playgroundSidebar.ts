import { designTokens as t, typestyles } from '@var-ui/core';

export const playgroundSidebarStyles = typestyles.recipe({
  name: 'playground-sidebar',
  layer: 'components',
  slots: ['root', 'controlGroup', 'controlLabel', 'editorTabs', 'navLinks'],
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.md.var,
        padding: t.space.md.var,
      },
      navLinks: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: t.space.sm.var,
      },
      controlGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xs.var,
      },
      controlLabel: {
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.medium.var,
        color: t.color.text.secondary.var,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      },
      editorTabs: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.sm.var,
      },
    },
  }),
});
