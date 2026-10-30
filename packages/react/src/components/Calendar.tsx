import type { CSSProperties, JSX, Ref } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Calendar as AriaCalendar,
  type CalendarProps as RACCalendarProps,
} from 'react-aria-components';
import { calendar } from '@var-ui/core/components/calendar';
import { CalendarBody } from '../internal/CalendarBody';
import { toRacDateProps } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

type CalendarRac<T extends DateValue> = RACCalendarProps<T>;

export type CalendarProps<T extends DateValue = DateValue> = {
  /** Called when the focused date changes. */
  onFocusChange?: CalendarRac<T>['onFocusChange'];
  /** Controlled selected date. `null` means controlled-empty. */
  value?: T | null;
  /** Initial selected date when uncontrolled. */
  defaultValue?: T | null;
  /** Called with the date the user picks. */
  onValueChange?: NonNullable<CalendarRac<T>['onChange']>;
  /** Earliest selectable date. */
  min?: CalendarRac<T>['minValue'];
  /** Latest selectable date. */
  max?: CalendarRac<T>['maxValue'];
  /** Marks dates as unavailable: they cannot be selected. */
  unavailable?: CalendarRac<T>['isDateUnavailable'];
  /** Controlled focused date. */
  focusedValue?: CalendarRac<T>['focusedValue'];
  /** Initial focused date when uncontrolled. */
  defaultFocusedValue?: CalendarRac<T>['defaultFocusedValue'];
  /** Number of months shown at once and how paging behaves. */
  visibleDuration?: CalendarRac<T>['visibleDuration'];
  pageBehavior?: CalendarRac<T>['pageBehavior'];
  firstDayOfWeek?: CalendarRac<T>['firstDayOfWeek'];
  /** Disables the whole calendar. */
  disabled?: boolean;
  /** Makes the calendar read-only: dates can be focused but not selected. */
  readOnly?: boolean;
  /** Shows the invalid state. */
  invalid?: boolean;
  autoFocus?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-details'?: string;
  /** Merged onto the root. */
  className?: string;
  /** Applied to the root. */
  style?: CSSProperties;
  /** Ref to the calendar's root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Standalone month-grid date picker — no popover, no text input. Composes
 * RAC's `Calendar` with the shared `calendarGridChrome` styling also used by
 * the popover calendars embedded in date-field components.
 *
 * ```tsx
 * <Calendar aria-label="Appointment date" value={value} onValueChange={setValue} />
 * ```
 */
export function Calendar<T extends DateValue = DateValue>({
  className,
  ref,
  ...props
}: CalendarProps<T>): JSX.Element {
  const c = calendar();
  return (
    <AriaCalendar
      {...(toRacDateProps(props) as RACCalendarProps<T>)}
      className={mergeRacClassName(c.root, className)}
      ref={ref}
    >
      <CalendarBody
        slots={{
          header: c.header,
          navButton: c.navButton,
          heading: c.heading,
          grid: c.grid,
          headerCell: c.headerCell,
          cell: c.cell,
        }}
      />
    </AriaCalendar>
  );
}
