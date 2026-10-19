import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { calendarGridChrome } from './fieldChrome';

export const calendar = typestyles.recipe(
  'calendar',
  (c) => {
    const v = c.vars({
      headingColor: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      navButtonColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      navButtonHoverBackground: {
        ...atProperty.color,
        value: t.color.background.subtle.var,
      },
      headerCellColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      cellColor: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      cellHoverBackground: {
        ...atProperty.color,
        value: t.color.background.subtle.var,
      },
      cellSelectedBackground: {
        ...atProperty.color,
        value: t.color.tone.accent.background.var,
      },
      cellSelectedColor: {
        ...atProperty.color,
        value: t.color.tone.accent.foregroundOnBackground.var,
      },
      cellDisabledColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
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
