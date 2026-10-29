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
import type { FieldMeta } from './Field';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { CalendarPopover } from '../internal/CalendarBody';
import { splitDataAttributes } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

export type DateInputProps<T extends DateValue = DateValue> = Omit<
  RACDatePickerProps<T>,
  'children'
> &
  FieldMeta & {
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
 * <DateInput label="Appointment date" value={value} onChange={setValue} />
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
      {...rootProps}
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
