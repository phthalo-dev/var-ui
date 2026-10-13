import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { calendarGridChrome } from './field';

export const calendar = typestyles.recipe(
  'calendar',
  (c) => {
    const v = c.vars({
      headingColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      navButtonColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      navButtonHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      headerCellColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      cellColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      cellHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      cellSelectedBackground: {
        value: t.color.tone.accent.background.var,
        syntax: '<color>',
      },
      cellSelectedColor: {
        value: t.color.tone.accent.foregroundOnBackground.var,
        syntax: '<color>',
      },
      cellDisabledColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    const grid = calendarGridChrome({
      headingColor: v.headingColor.var,
      navButtonColor: v.navButtonColor.var,
      navButtonHoverBackground: v.navButtonHoverBackground.var,
      headerCellColor: v.headerCellColor.var,
      cellColor: v.cellColor.var,
      cellHoverBackground: v.cellHoverBackground.var,
      cellSelectedBackground: v.cellSelectedBackground.var,
      cellSelectedColor: v.cellSelectedColor.var,
      cellDisabledColor: v.cellDisabledColor.var,
    });
    return {
      slots: ['root', 'header', 'heading', 'navButton', 'grid', 'headerCell', 'cell'],
      root: { display: 'grid', gap: t.space[2].var, width: 'fit-content' },
      header: grid.calendarHeader,
      heading: grid.calendarHeading,
      navButton: grid.calendarNavButton,
      grid: grid.calendarGrid,
      headerCell: grid.calendarHeaderCell,
      cell: grid.calendarCell,
    };
  },
  { layer: 'components' },
);
