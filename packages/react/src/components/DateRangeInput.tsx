import type { JSX, Ref } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Button,
  DateInput as AriaDateInput,
  DateRangePicker as AriaDateRangePicker,
  DateSegment,
  Group,
  type DateRangePickerProps as RACDateRangePickerProps,
} from 'react-aria-components';
import { dateRangeInput } from '@var-ui/core/components/dateRangeInput';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import type { FieldMeta } from './Field';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { CalendarPopover } from '../internal/CalendarBody';
import { splitDataAttributes, type DateFieldBaseProps } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

type DateRangePickerRac<T extends DateValue> = RACDateRangePickerProps<T>;

export type DateRangeInputProps<T extends DateValue = DateValue> = DateFieldBaseProps<
  DateRangePickerRac<T>
> & {
  /** Controlled range (`{ start, end }`). `null` means controlled-empty. */
  value?: DateRangePickerRac<T>['value'];
  /** Initial range when uncontrolled. */
  defaultValue?: DateRangePickerRac<T>['defaultValue'];
  /** Called with the new range, or `null` when the field is cleared. */
  onValueChange?: NonNullable<DateRangePickerRac<T>['onChange']>;
  /** Earliest selectable date. */
  min?: DateRangePickerRac<T>['minValue'];
  /** Latest selectable date. */
  max?: DateRangePickerRac<T>['maxValue'];
  /** Marks dates as unavailable: they cannot be selected. */
  unavailable?: DateRangePickerRac<T>['isDateUnavailable'];
  /** Whether a range may include unavailable dates. */
  allowsNonContiguousRanges?: boolean;
  placeholderValue?: DateRangePickerRac<T>['placeholderValue'];
  /** Smallest unit shown as an editable segment. */
  granularity?: DateRangePickerRac<T>['granularity'];
  hourCycle?: DateRangePickerRac<T>['hourCycle'];
  hideTimeZone?: boolean;
  shouldForceLeadingZeros?: boolean;
  firstDayOfWeek?: DateRangePickerRac<T>['firstDayOfWeek'];
  /** Custom validation; return a message (or messages) to mark the field invalid. */
  validate?: DateRangePickerRac<T>['validate'];
  /** Controlled open state of the calendar popover. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the calendar popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Close the popover after a range is picked. @default true */
  shouldCloseOnSelect?: boolean;
  /** Ref to the start-date segmented input (the field's primary control). */
  ref?: Ref<HTMLDivElement>;
};

/**
 * A start-date/end-date field with segmented text entry for both, plus a
 * trigger button that opens a popover range-calendar. Wraps RAC's
 * `DateRangePicker`. `className`/`style` style the root; `ref` and `data-*`
 * attributes reach the start segmented input.
 *
 * ```tsx
 * <DateRangeInput label="Trip dates" value={value} onValueChange={setValue} />
 * ```
 */
export function DateRangeInput<T extends DateValue = DateValue>({
  label,
  description,
  errorMessage,
  className,
  ref,
  ...props
}: DateRangeInputProps<T>): JSX.Element {
  const dr = dateRangeInput();
  const [rootProps, dataProps] = splitDataAttributes(props);
  return (
    <AriaDateRangePicker
      {...(rootProps as RACDateRangePickerProps<T>)}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
      className={mergeRacClassName(dr.root, className)}
    >
      <RacFieldFrame slots={dr} label={label} description={description} errorMessage={errorMessage}>
        <Group {...mergeProps(dr.group)}>
          <AriaDateInput slot="start" {...dataProps} ref={ref}>
            {(segment) => <DateSegment segment={segment} {...mergeProps(dr.segment)} />}
          </AriaDateInput>
          <span {...mergeProps(dr.separator)}>–</span>
          <AriaDateInput slot="end">
            {(segment) => <DateSegment segment={segment} {...mergeProps(dr.segment)} />}
          </AriaDateInput>
          <Button {...mergeProps(dr.trigger)}>
            <Icon name="chevronDown" size="sm" />
          </Button>
        </Group>
      </RacFieldFrame>
      <CalendarPopover
        range
        popover={dr.popover}
        slots={{
          header: dr.calendarHeader,
          navButton: dr.calendarNavButton,
          heading: dr.calendarHeading,
          grid: dr.calendarGrid,
          headerCell: dr.calendarHeaderCell,
          cell: dr.calendarCell,
        }}
      />
    </AriaDateRangePicker>
  );
}
