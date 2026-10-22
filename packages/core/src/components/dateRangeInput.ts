import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { dateFieldChrome, calendarGridChrome } from './fieldChrome';

export const dateRangeInput = typestyles.recipe({
  name: 'dateRangeInput',
  layer: 'components',
  slots: [
    'root',
    'label',
    'description',
    'error',
    'group',
    'segment',
    'separator',
    'trigger',
    'popover',
    'calendarHeader',
    'calendarHeading',
    'calendarNavButton',
    'calendarGrid',
    'calendarHeaderCell',
    'calendarCell',
  ],
  vars: {
    labelColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    descriptionColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    errorColor: {
      ...atProperty.color,
      value: t.color.tone.danger.foreground.var,
    },
    groupBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    groupBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    segmentColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    segmentPlaceholderColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    popoverBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    popoverBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
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
      value: t.color.background.surface.var,
    },
    cellDisabledColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
  },
  styles: ({ vars }) => {
    const fieldChromeSlots = dateFieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
      groupBackground: vars.groupBackground.var,
      groupBorder: vars.groupBorder.var,
      groupFocusBorder: vars.groupBorder.name,
      segmentColor: vars.segmentColor.var,
      segmentPlaceholderColor: vars.segmentPlaceholderColor.var,
    });
    const calendarChromeSlots = calendarGridChrome({
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
        ...fieldChromeSlots,
        root: {
          ...fieldChromeSlots.root,
          minWidth: '240px',
        },
        separator: {
          color: vars.descriptionColor.var,
          padding: `0 ${t.space[1].var}`,
        },
        trigger: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: '1.75rem',
          height: '1.75rem',
          borderRadius: t.radius.sm.var,
          color: vars.navButtonColor.var,
          cursor: 'pointer',
          '&[data-hovered]': {
            backgroundColor: vars.navButtonHoverBackground.var,
          },
          '&[data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        },
        popover: {
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.popoverBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.popoverBackground.var,
          boxShadow: t.shadow.md.var,
          padding: t.space[3].var,
        },
        ...calendarChromeSlots,
      },
    };
  },
});
