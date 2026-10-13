import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export type FieldChromeColors = {
  label: string;
  description: string;
  error: string;
};

/**
 * Shared label/description/error declarations composed by every field-shaped
 * recipe (textField, textAreaField, select, and the standalone `field`).
 * Each recipe passes its own `c.vars()` refs so per-component theming keeps
 * working; class names stay per-recipe (public API is untouched).
 */
export function fieldChrome(colors: FieldChromeColors) {
  return {
    root: {
      display: 'grid',
      gap: t.space[1].var,
    },
    label: {
      fontSize: t.fontSize.md.var,
      fontWeight: t.fontWeight.medium.var,
      color: colors.label,
    },
    description: {
      fontSize: t.fontSize.sm.var,
      color: colors.description,
    },
    error: {
      fontSize: t.fontSize.sm.var,
      color: colors.error,
    },
  } as const;
}

export type DropdownPopoverVarRef = {
  name: string;
  var: string;
};

export type DropdownPopoverVars = {
  popoverBorder: DropdownPopoverVarRef;
  popoverBackground: DropdownPopoverVarRef;
  itemFocusedBackground: DropdownPopoverVarRef;
  itemSelectedColor: DropdownPopoverVarRef;
};

/**
 * Shared popover panel, listbox, and option chrome for Select-like controls.
 * Channel defaults are declared on `popover` so portaled listboxes still resolve
 * component vars outside the field root (same pattern as `menu`).
 */
export function dropdownPopoverChrome(v: DropdownPopoverVars) {
  return {
    popover: {
      [v.popoverBorder.name]: t.color.border.default.var,
      [v.popoverBackground.name]: t.color.background.surface.var,
      [v.itemFocusedBackground.name]: t.color.background.subtle.var,
      [v.itemSelectedColor.name]: t.color.tone.accent.foreground.var,
      zIndex: t.zIndex.dropdown.var,
      boxSizing: 'border-box',
      width: 'var(--trigger-width)',
      minWidth: 'var(--trigger-width)',
      maxHeight: '16rem',
      overflow: 'hidden',
      borderWidth: t.borderWidth.default.var,
      borderStyle: 'solid',
      borderColor: v.popoverBorder.var,
      borderRadius: t.radius.md.var,
      backgroundColor: v.popoverBackground.var,
      boxShadow: t.shadow.md.var,
      padding: t.space[1].var,
      outline: 'none',
    },
    listbox: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[1].var,
      maxHeight: 'calc(16rem - 2 * var(--var-ui-space-1))',
      overflowY: 'auto',
      outline: 'none',
    },
    item: {
      fontSize: t.fontSize.md.var,
      padding: `${t.space[2].var} ${t.space[3].var}`,
      borderRadius: t.radius.sm.var,
      cursor: 'pointer',
      outline: 'none',
      '&[data-focused], &[data-hovered]': {
        backgroundColor: v.itemFocusedBackground.var,
      },
      '&[data-selected]': {
        color: v.itemSelectedColor.var,
        fontWeight: t.fontWeight.semibold.var,
      },
    },
  } as const;
}

/**
 * Standalone field chrome for custom inputs that aren't one of the built-in
 * field recipes — label, help text, and validation message around any control.
 *
 * ```tsx
 * const f = field();
 * <div className={f.root}>
 *   <label className={f.label}>Amount</label>
 *   <MyCustomInput />
 *   <p className={f.description}>Help text</p>
 * </div>
 * ```
 */
export type DateFieldChromeColors = FieldChromeColors & {
  groupBackground: string;
  groupBorder: string;
  groupFocusBorder: string;
  segmentColor: string;
  segmentPlaceholderColor: string;
};

/**
 * Shared chrome for segmented date/time inputs (DateInput, DateRangeInput,
 * DateTimeInput, TimeInput): the fieldChrome label/description/error plus a
 * bordered `group` wrapper around RAC's `DateSegment` spans. Kept separate
 * from `fieldChrome` since only date/time fields have segments.
 */
export function dateFieldChrome(colors: DateFieldChromeColors) {
  return {
    ...fieldChrome(colors),
    group: {
      display: 'flex',
      alignItems: 'center',
      gap: t.space[1].var,
      borderWidth: t.borderWidth.default.var,
      borderStyle: 'solid',
      borderColor: colors.groupBorder,
      borderRadius: t.radius.md.var,
      padding: `${t.space[2].var} ${t.space[3].var}`,
      backgroundColor: colors.groupBackground,
      width: 'fit-content',
      '&[data-focus-within]': {
        outline: `2px solid ${t.color.border.focus.var}`,
        outlineOffset: '1px',
        [colors.groupFocusBorder]: t.color.border.focus.var,
      },
      '&[data-disabled]': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
    segment: {
      fontSize: t.fontSize.md.var,
      fontVariantNumeric: 'tabular-nums',
      color: colors.segmentColor,
      padding: '0 1px',
      '&[data-placeholder]': {
        color: colors.segmentPlaceholderColor,
      },
      '&[data-focused]': {
        outline: 'none',
        backgroundColor: t.color.background.subtle.var,
        borderRadius: t.radius.sm.var,
      },
      '&[data-disabled]': {
        opacity: 0.6,
      },
    },
  } as const;
}

export type CalendarGridChromeColors = {
  headingColor: string;
  navButtonColor: string;
  navButtonHoverBackground: string;
  headerCellColor: string;
  cellColor: string;
  cellHoverBackground: string;
  cellSelectedBackground: string;
  cellSelectedColor: string;
  cellDisabledColor: string;
};

/**
 * Shared chrome for a month grid (RAC `CalendarGrid`/`CalendarCell`): reused
 * by the standalone `calendar` recipe and by the popover calendars embedded
 * in `dateInput`/`dateRangeInput`/`dateTimeInput`, so all four render the
 * same grid regardless of which recipe owns the surrounding chrome.
 */
export function calendarGridChrome(colors: CalendarGridChromeColors) {
  return {
    calendarHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: t.space[2].var,
      marginBottom: t.space[2].var,
    },
    calendarHeading: {
      fontSize: t.fontSize.md.var,
      fontWeight: t.fontWeight.semibold.var,
      color: colors.headingColor,
    },
    calendarNavButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.75rem',
      height: '1.75rem',
      borderRadius: t.radius.sm.var,
      color: colors.navButtonColor,
      cursor: 'pointer',
      '&[data-hovered]': {
        backgroundColor: colors.navButtonHoverBackground,
      },
      '&[data-disabled]': {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
    calendarGrid: {
      borderCollapse: 'collapse',
      width: '100%',
    },
    calendarHeaderCell: {
      fontSize: t.fontSize.sm.var,
      fontWeight: t.fontWeight.medium.var,
      color: colors.headerCellColor,
      padding: t.space[1].var,
    },
    calendarCell: {
      textAlign: 'center',
      fontSize: t.fontSize.md.var,
      color: colors.cellColor,
      padding: t.space[1].var,
      cursor: 'pointer',
      '& > *': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem',
        margin: '0 auto',
        borderRadius: t.radius.md.var,
      },
      '&[data-hovered] > *': {
        backgroundColor: colors.cellHoverBackground,
      },
      '&[data-selected] > *': {
        backgroundColor: colors.cellSelectedBackground,
        color: colors.cellSelectedColor,
      },
      '&[data-outside-month]': {
        opacity: 0.4,
      },
      '&[data-disabled]': {
        color: colors.cellDisabledColor,
        cursor: 'not-allowed',
      },
    },
  } as const;
}

export const field = typestyles.recipe(
  'field',
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
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: ['root', 'label', 'description', 'error'],
      ...chrome,
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
    };
  },
  { layer: 'components' },
);
