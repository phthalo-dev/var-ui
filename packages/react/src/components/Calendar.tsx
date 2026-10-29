import type { JSX, Ref } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Calendar as AriaCalendar,
  type CalendarProps as RACCalendarProps,
} from 'react-aria-components';
import { calendar } from '@var-ui/core/components/calendar';
import { CalendarBody } from '../internal/CalendarBody';
import { mergeRacClassName } from '../internal/racClassName';

export type CalendarProps<T extends DateValue = DateValue> = Omit<
  RACCalendarProps<T>,
  'children'
> & {
  /** Ref to the calendar's root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Standalone month-grid date picker — no popover, no text input. Composes
 * RAC's `Calendar` with the shared `calendarGridChrome` styling also used by
 * the popover calendars embedded in date-field components.
 *
 * ```tsx
 * <Calendar aria-label="Appointment date" value={value} onChange={setValue} />
 * ```
 */
export function Calendar<T extends DateValue = DateValue>({
  className,
  ref,
  ...props
}: CalendarProps<T>): JSX.Element {
  const c = calendar();
  return (
    <AriaCalendar {...props} className={mergeRacClassName(c.root, className)} ref={ref}>
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
