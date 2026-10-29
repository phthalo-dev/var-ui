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
import { splitDataAttributes } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

export type DateRangeInputProps<T extends DateValue = DateValue> = Omit<
  RACDateRangePickerProps<T>,
  'children'
> &
  FieldMeta & {
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
 * <DateRangeInput label="Trip dates" value={value} onChange={setValue} />
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
      {...rootProps}
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
