import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { calendarGridChrome } from './fieldChrome';

export const calendar = typestyles.recipe({
  name: 'calendar',
  layer: 'components',
  slots: ['root', 'header', 'heading', 'navButton', 'grid', 'headerCell', 'cell'],
  vars: {
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
  },
  styles: ({ vars }) => {
    const grid = calendarGridChrome({
      headingColor: vars.headingColor.var,
      navButtonColor: vars.navButtonColor.var,
      navButtonHoverBackground: vars.navButtonHoverBackground.var,
      headerCellColor: vars.headerCellColor.var,
      cellColor: vars.cellColor.var,
      cellHoverBackground: vars.cellHoverBackground.var,
      cellSelectedBackground: vars.cellSelectedBackground.var,
      cellSelectedColor: vars.cellSelectedColor.var,
      cellDisabledColor: vars.cellDisabledColor.var,
    });
    return {
      base: {
        root: { display: 'grid', gap: t.space[2].var, width: 'fit-content' },
        header: grid.calendarHeader,
        heading: grid.calendarHeading,
        navButton: grid.calendarNavButton,
        grid: grid.calendarGrid,
        headerCell: grid.calendarHeaderCell,
        cell: grid.calendarCell,
      },
    };
  },
});
