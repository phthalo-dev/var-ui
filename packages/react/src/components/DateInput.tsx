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
import { dateInput } from '@var-ui/core/components/dateInput';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { CalendarPopover } from '../internal/CalendarBody';
import { splitDataAttributes, type DateFieldBaseProps } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

type DatePickerRac<T extends DateValue> = RACDatePickerProps<T>;

export type DateInputProps<T extends DateValue = DateValue> = DateFieldBaseProps<
  DatePickerRac<T>
> & {
  /** Controlled date. `null` means controlled-empty. */
  value?: T | null;
  /** Initial date when uncontrolled. */
  defaultValue?: T | null;
  /** Called with the new date, or `null` when the field is cleared. */
  onValueChange?: NonNullable<DatePickerRac<T>['onChange']>;
  /** Earliest selectable date. */
  min?: DatePickerRac<T>['minValue'];
  /** Latest selectable date. */
  max?: DatePickerRac<T>['maxValue'];
  /** Marks dates as unavailable: they cannot be selected. */
  unavailable?: DatePickerRac<T>['isDateUnavailable'];
  placeholderValue?: DatePickerRac<T>['placeholderValue'];
  /** Smallest unit shown as an editable segment. */
  granularity?: DatePickerRac<T>['granularity'];
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
 * Single-date field with segmented text entry (month/day/year as separate
 * focusable segments) plus a trigger button that opens a popover
 * month-calendar. Wraps RAC's `DatePicker`. `className`/`style` style the
 * root; `ref` and `data-*` attributes reach the segmented input.
 *
 * ```tsx
 * <DateInput label="Appointment date" value={value} onValueChange={setValue} />
 * ```
 */
export function DateInput<T extends DateValue = DateValue>({
  label,
  description,
  errorMessage,
  className,
  ref,
  ...props
}: DateInputProps<T>): JSX.Element {
  const di = dateInput();
  const [rootProps, dataProps] = splitDataAttributes(props);
  return (
    <AriaDatePicker
      {...(rootProps as RACDatePickerProps<T>)}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
      className={mergeRacClassName(di.root, className)}
    >
      <RacFieldFrame slots={di} label={label} description={description} errorMessage={errorMessage}>
        <Group {...mergeProps(di.group)}>
          <AriaDateInput {...dataProps} ref={ref}>
            {(segment) => <DateSegment segment={segment} {...mergeProps(di.segment)} />}
          </AriaDateInput>
          <Button {...mergeProps(di.trigger)}>
            <Icon name="chevronDown" size="sm" />
          </Button>
        </Group>
      </RacFieldFrame>
      <CalendarPopover
        popover={di.popover}
        slots={{
          header: di.calendarHeader,
          navButton: di.calendarNavButton,
          heading: di.calendarHeading,
          grid: di.calendarGrid,
          headerCell: di.calendarHeaderCell,
          cell: di.calendarCell,
        }}
      />
    </AriaDatePicker>
  );
}
