import { designTokens as t, typestyles } from '@var-ui/core';

export const playgroundSidebarStyles = typestyles.recipe(
  'playground-sidebar',
  () => ({
    slots: ['root', 'controlGroup', 'controlLabel', 'editorTabs', 'navLinks'],
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[4].var,
      padding: t.space[4].var,
    },
    navLinks: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: t.space[3].var,
    },
    controlGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[2].var,
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
      gap: t.space[3].var,
    },
  }),
  { layer: 'components' },
);
