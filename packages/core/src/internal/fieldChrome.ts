import { designTokens as t } from '../tokens';
import { atForcedColors } from '../theme/conditions';
import { forced } from './forcedColors';
import { focusRing } from './focusRing';
import { anchored, popupMaxHeightVar } from '../shared/anchored';
import type { ControlSize } from '../shared/variantAxes';
import { controlSizeMetrics, controlSurfaceSize } from './controlSize';

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
      gap: t.space.xxs.var,
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
 * `popover` is the anchor-positioned `[popover]` element (listbox popups match the trigger width
 * through `anchor-size(width)`; see `shared/anchored`). Channel defaults are declared on it as well
 * as on the field root.
 */
export function dropdownPopoverChrome(v: DropdownPopoverVars) {
  return {
    popover: {
      [v.popoverBorder.name]: t.color.border.default.var,
      [v.popoverBackground.name]: t.color.background.surface.var,
      [v.itemFocusedBackground.name]: t.color.background.subtle.var,
      [v.itemSelectedColor.name]: t.color.tone.accent.foreground.var,
      ...anchored({ offset: t.space.xxs.var, maxHeight: '16rem', matchWidth: 'exact' }),
      overflow: 'hidden',
      borderWidth: t.borderWidth.default.var,
      borderStyle: 'solid',
      borderColor: v.popoverBorder.var,
      borderRadius: t.radius.md.var,
      backgroundColor: v.popoverBackground.var,
      boxShadow: t.shadow.md.var,
      padding: t.space.xxs.var,
      outline: 'none',
    },
    listbox: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space.xxs.var,
      maxHeight: `calc(min(var(${popupMaxHeightVar}, 16rem), 100dvh) - 2 * ${t.space.xxs.var})`,
      overflowY: 'auto',
      outline: 'none',
    },
    item: {
      fontSize: t.fontSize.md.var,
      padding: `${t.space.xs.var} ${t.space.sm.var}`,
      borderRadius: t.radius.sm.var,
      cursor: 'pointer',
      outline: 'none',
      '&[data-focused], &[data-hovered]': {
        backgroundColor: v.itemFocusedBackground.var,
        ...atForcedColors(forced.selected),
      },
      '&[data-selected]': {
        color: v.itemSelectedColor.var,
        fontWeight: t.fontWeight.semibold.var,
        ...atForcedColors(forced.selected),
      },
    },
  } as const;
}

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
      gap: t.space.xxs.var,
      borderWidth: t.borderWidth.default.var,
      borderStyle: 'solid',
      borderColor: colors.groupBorder,
      borderRadius: t.radius.md.var,
      backgroundColor: colors.groupBackground,
      width: 'fit-content',
      '&[data-focus-within]': {
        ...focusRing,
        [colors.groupFocusBorder]: t.color.border.focus.var,
      },
      '&[data-disabled]': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
    segment: {
      fontVariantNumeric: 'tabular-nums',
      color: colors.segmentColor,
      padding: '0 0.0625rem',
      '&[data-placeholder]': {
        color: colors.segmentPlaceholderColor,
      },
      '&[data-focused]': {
        outline: 'none',
        backgroundColor: t.color.background.subtle.var,
        borderRadius: t.radius.sm.var,
        ...atForcedColors(forced.selected),
      },
      '&[data-disabled]': {
        opacity: 0.6,
      },
    },
  } as const;
}

/**
 * `size` variant slots for {@link dateFieldChrome}: the segment group takes text-field's
 * fixed-height surface (height, inline inset, type) at each control size.
 */
export function dateFieldSize(size: ControlSize) {
  return {
    group: {
      ...controlSurfaceSize(size, { inset: 'compact' }),
      gap: t.space.xxs.var,
    },
    segment: {
      fontSize: controlSizeMetrics[size].fontSize,
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
      gap: t.space.xs.var,
      marginBottom: t.space.xs.var,
    },
    calendarHeading: {
      fontSize: t.fontSize.md.var,
      fontWeight: t.fontWeight.semibold.var,
      color: colors.headingColor,
    },
    calendarNavButton: {
      // Reset native <button> chrome (React Aria renders a real button).
      appearance: 'none',
      border: 'none',
      backgroundColor: 'transparent',
      font: 'inherit',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: t.size.control.sm.var,
      height: t.size.control.sm.var,
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
    // The day grid is a <table>: opt out of the element base styles (outer border, cell
    // borders, `th` fill, bottom margin) that are meant for prose tables.
    calendarGrid: {
      borderCollapse: 'collapse',
      width: '100%',
      margin: 0,
      border: 'none',
    },
    calendarHeaderCell: {
      border: 'none',
      backgroundColor: 'transparent',
      textAlign: 'center',
      fontSize: t.fontSize.sm.var,
      fontWeight: t.fontWeight.medium.var,
      color: colors.headerCellColor,
      padding: t.space.xxs.var,
    },
    // The cell slot is the focusable day element itself (RAC renders `td > div`), so the
    // day box, hover, selection, today and marked states all style it directly.
    calendarCell: {
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Fills its column up to the control size; never below the small control size, so
      // shrink-to-fit popovers keep a usable grid.
      width: '100%',
      minWidth: t.size.control.sm.var,
      maxWidth: t.size.control.md.var,
      aspectRatio: '1',
      margin: '0 auto',
      borderRadius: t.radius.md.var,
      border: 'none',
      backgroundColor: 'transparent',
      textAlign: 'center',
      fontSize: t.fontSize.md.var,
      fontVariantNumeric: 'tabular-nums',
      color: colors.cellColor,
      cursor: 'pointer',
      outline: 'none',
      '&[data-hovered]': {
        backgroundColor: colors.cellHoverBackground,
      },
      '&[data-focus-visible]': {
        boxShadow: `0 0 0 2px ${t.color.border.focus.var}`,
      },
      // Today: a ring in the selection color, so it reads without competing with selection.
      '&[data-today]': {
        fontWeight: t.fontWeight.semibold.var,
        boxShadow: `inset 0 0 0 1.5px ${colors.cellSelectedBackground}`,
      },
      '&[data-selected]': {
        backgroundColor: colors.cellSelectedBackground,
        color: colors.cellSelectedColor,
        boxShadow: 'none',
        ...atForcedColors(forced.selected),
      },
      // Marked days (`marked` prop): a dot under the number.
      '& [data-calendar-mark]': {
        position: 'absolute',
        bottom: '0.1875rem',
        left: '50%',
        width: '0.25rem',
        height: '0.25rem',
        marginLeft: '-0.125rem',
        borderRadius: t.radius.full.var,
        backgroundColor: colors.cellSelectedBackground,
      },
      '&[data-selected] [data-calendar-mark]': {
        backgroundColor: colors.cellSelectedColor,
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
