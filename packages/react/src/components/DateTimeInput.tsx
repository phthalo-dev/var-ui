import type { JSX } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DatePicker as AriaDatePicker,
  DateInput as AriaDateInput,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
  type DatePickerProps as RACDatePickerProps,
} from 'react-aria-components';
import { dateTimeInput } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type DateTimeInputProps<T extends DateValue = DateValue> = Omit<
  RACDatePickerProps<T>,
  'children' | 'granularity'
> & {
  /** Field label rendered above the segmented group. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  /**
   * Smallest unit of time rendered as an editable segment. The popover
   * calendar always operates at day granularity — time segments are edited
   * via the text field, not the calendar.
   *
   * @default 'minute'
   */
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  className?: string;
};

/**
 * A single field combining date AND time segments (month/day/year plus
 * hour/minute/AM-PM, each individually focusable) with a trigger button that
 * opens a popover month-calendar for picking the date portion. Wraps RAC's
 * `DatePicker` with `granularity` defaulted to `'minute'` so hour/minute/
 * dayPeriod segments render alongside the date segments.
 *
 * ```tsx
 * <DateTimeInput label="Appointment" value={value} onChange={setValue} />
 * ```
 */
export function DateTimeInput<T extends DateValue = DateValue>({
  label,
  description,
  errorMessage,
  granularity = 'minute',
  className,
  ...props
}: DateTimeInputProps<T>): JSX.Element {
  const dt = dateTimeInput();
  return (
    <AriaDatePicker {...props} granularity={granularity} {...mergeProps(dt.root, className)}>
      {label ? <Label {...mergeProps(dt.label)}>{label}</Label> : null}
      <Group {...mergeProps(dt.group)}>
        <AriaDateInput>
          {(segment) => <DateSegment segment={segment} {...mergeProps(dt.segment)} />}
        </AriaDateInput>
        <Button {...mergeProps(dt.trigger)}>
          <Icon name="chevronDown" size="sm" />
        </Button>
      </Group>
      {description ? (
        <Text slot="description" {...mergeProps(dt.description)}>
          {description}
        </Text>
      ) : null}
      <FieldError {...mergeProps(dt.error)}>{errorMessage ?? ''}</FieldError>
      <Popover {...mergeProps(dt.popover)}>
        <Dialog>
          <AriaCalendar>
            <header {...mergeProps(dt.calendarHeader)}>
              <Button slot="previous" {...mergeProps(dt.calendarNavButton)}>
                <Icon name="chevronLeft" size="sm" />
              </Button>
              <Heading {...mergeProps(dt.calendarHeading)} />
              <Button slot="next" {...mergeProps(dt.calendarNavButton)}>
                <Icon name="chevronRight" size="sm" />
              </Button>
            </header>
            <CalendarGrid {...mergeProps(dt.calendarGrid)}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell {...mergeProps(dt.calendarHeaderCell)}>
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} {...mergeProps(dt.calendarCell)} />}
              </CalendarGridBody>
            </CalendarGrid>
          </AriaCalendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
