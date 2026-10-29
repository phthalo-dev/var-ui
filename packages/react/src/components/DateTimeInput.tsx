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
import type { FieldMeta } from './Field';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { CalendarPopover } from '../internal/CalendarBody';
import { splitDataAttributes } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

export type DateTimeInputProps<T extends DateValue = DateValue> = Omit<
  RACDatePickerProps<T>,
  'children' | 'granularity'
> &
  FieldMeta & {
    /**
     * Smallest unit of time rendered as an editable segment. The popover
     * calendar always operates at day granularity: time segments are edited
     * via the text field, not the calendar.
     *
     * @default 'minute'
     */
    granularity?: 'day' | 'hour' | 'minute' | 'second';
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
 * <DateTimeInput label="Appointment" value={value} onChange={setValue} />
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
      {...rootProps}
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
