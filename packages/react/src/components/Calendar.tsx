import type { JSX, Ref } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  type CalendarProps as RACCalendarProps,
} from 'react-aria-components';
import { calendar } from '@var-ui/core/components/calendar';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type CalendarProps<T extends DateValue = DateValue> = Omit<
  RACCalendarProps<T>,
  'children'
> & {
  className?: string;
  /** Ref to the underlying `<div>` element. */
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
    <AriaCalendar {...props} {...mergeProps(c.root, className)} ref={ref}>
      <header {...mergeProps(c.header)}>
        <Button slot="previous" {...mergeProps(c.navButton)}>
          <Icon name="chevronLeft" size="sm" />
        </Button>
        <Heading {...mergeProps(c.heading)} />
        <Button slot="next" {...mergeProps(c.navButton)}>
          <Icon name="chevronRight" size="sm" />
        </Button>
      </header>
      <CalendarGrid {...mergeProps(c.grid)}>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell {...mergeProps(c.headerCell)}>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} {...mergeProps(c.cell)} />}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  );
}
