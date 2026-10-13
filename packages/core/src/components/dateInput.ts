import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { calendarGridChrome, dateFieldChrome } from './field';

export const dateInput = typestyles.recipe(
  'dateInput',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      errorColor: {
        value: t.color.tone.danger.foreground.var,
        syntax: '<color>',
      },
      groupBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      groupBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      segmentColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      segmentPlaceholderColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      popoverBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      popoverBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
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

    const field = dateFieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
      groupBackground: v.groupBackground.var,
      groupBorder: v.groupBorder.var,
      groupFocusBorder: v.groupBorder.name,
      segmentColor: v.segmentColor.var,
      segmentPlaceholderColor: v.segmentPlaceholderColor.var,
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
      slots: [
        'root',
        'label',
        'description',
        'error',
        'group',
        'segment',
        'trigger',
        'popover',
        'calendarHeader',
        'calendarHeading',
        'calendarNavButton',
        'calendarGrid',
        'calendarHeaderCell',
        'calendarCell',
      ],
      root: {
        ...field.root,
        minWidth: '240px',
      },
      label: field.label,
      description: field.description,
      error: field.error,
      group: field.group,
      segment: field.segment,
      trigger: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radius.sm.var,
        color: v.navButtonColor.var,
        cursor: 'pointer',
        '&[data-hovered]': {
          backgroundColor: v.navButtonHoverBackground.var,
        },
        '&[data-disabled]': {
          opacity: 0.6,
          cursor: 'not-allowed',
        },
      },
      popover: {
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.popoverBorder.var,
        borderRadius: t.radius.md.var,
        backgroundColor: v.popoverBackground.var,
        boxShadow: t.shadow.md.var,
        padding: t.space[3].var,
        width: '280px',
      },
      calendarHeader: grid.calendarHeader,
      calendarHeading: grid.calendarHeading,
      calendarNavButton: grid.calendarNavButton,
      calendarGrid: grid.calendarGrid,
      calendarHeaderCell: grid.calendarHeaderCell,
      calendarCell: grid.calendarCell,
    };
  },
  { layer: 'components' },
);
