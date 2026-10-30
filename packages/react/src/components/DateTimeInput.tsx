import type { JSX, Ref } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Button,
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  Group,
  type DatePickerProps as RACDatePickerProps,
} from 'react-aria-components';
import { dateTimeInput } from '@var-ui/core/components/dateTimeInput';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { CalendarPopover } from '../internal/CalendarBody';
import { splitDataAttributes, type DateFieldBaseProps } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

type DatePickerRac<T extends DateValue> = RACDatePickerProps<T>;

export type DateTimeInputProps<T extends DateValue = DateValue> = DateFieldBaseProps<
  DatePickerRac<T>
> & {
  /** Controlled date and time. `null` means controlled-empty. */
  value?: T | null;
  /** Initial date and time when uncontrolled. */
  defaultValue?: T | null;
  /** Called with the new value, or `null` when the field is cleared. */
  onValueChange?: NonNullable<DatePickerRac<T>['onChange']>;
  /** Earliest selectable date. */
  min?: DatePickerRac<T>['minValue'];
  /** Latest selectable date. */
  max?: DatePickerRac<T>['maxValue'];
  /** Marks dates as unavailable: they cannot be selected. */
  unavailable?: DatePickerRac<T>['isDateUnavailable'];
  placeholderValue?: DatePickerRac<T>['placeholderValue'];
  /**
   * Smallest unit of time rendered as an editable segment. The popover
   * calendar always operates at day granularity: time segments are edited
   * via the text field, not the calendar.
   *
   * @default 'minute'
   */
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  hourCycle?: DatePickerRac<T>['hourCycle'];
  hideTimeZone?: boolean;
  shouldForceLeadingZeros?: boolean;
  firstDayOfWeek?: DatePickerRac<T>['firstDayOfWeek'];
  /** Custom validation; return a message (or messages) to mark the field invalid. */
  validate?: DatePickerRac<T>['validate'];
  /** Controlled open state of the calendar popover. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the calendar popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Close the popover after a date is picked. @default true */
  shouldCloseOnSelect?: boolean;
  /** Ref to the segmented input element (the field's primary control). */
  ref?: Ref<HTMLDivElement>;
};

/**
 * A single field combining date AND time segments (month/day/year plus
 * hour/minute/AM-PM, each individually focusable) with a trigger button that
 * opens a popover month-calendar for picking the date portion. Wraps RAC's
 * `DatePicker` with `granularity` defaulted to `'minute'`. `className`/`style` style the
 * root; `ref` and `data-*` attributes reach the segmented input.
 *
 * ```tsx
 * <DateTimeInput label="Appointment" value={value} onValueChange={setValue} />
 * ```
 */
export function DateTimeInput<T extends DateValue = DateValue>({
  label,
  description,
  errorMessage,
  granularity = 'minute',
  className,
  ref,
  ...props
}: DateTimeInputProps<T>): JSX.Element {
  const dt = dateTimeInput();
  const [rootProps, dataProps] = splitDataAttributes(props);
  return (
    <AriaDatePicker
      {...(rootProps as RACDatePickerProps<T>)}
      granularity={granularity}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
      className={mergeRacClassName(dt.root, className)}
    >
      <RacFieldFrame slots={dt} label={label} description={description} errorMessage={errorMessage}>
        <Group {...mergeProps(dt.group)}>
          <AriaDateInput {...dataProps} ref={ref}>
            {(segment) => <DateSegment segment={segment} {...mergeProps(dt.segment)} />}
          </AriaDateInput>
          <Button {...mergeProps(dt.trigger)}>
            <Icon name="chevronDown" size="sm" />
          </Button>
        </Group>
      </RacFieldFrame>
      <CalendarPopover
        popover={dt.popover}
        slots={{
          header: dt.calendarHeader,
          navButton: dt.calendarNavButton,
          heading: dt.calendarHeading,
          grid: dt.calendarGrid,
          headerCell: dt.calendarHeaderCell,
          cell: dt.calendarCell,
        }}
      />
    </AriaDatePicker>
  );
}
