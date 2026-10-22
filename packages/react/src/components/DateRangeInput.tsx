import type { JSX } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput as AriaDateInput,
  DateRangePicker as AriaDateRangePicker,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
  Text,
  type DateRangePickerProps as RACDateRangePickerProps,
} from 'react-aria-components';
import { dateRangeInput } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type DateRangeInputProps<T extends DateValue = DateValue> = Omit<
  RACDateRangePickerProps<T>,
  'children'
> & {
  /** Field label rendered above the segmented start/end groups. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  className?: string;
};

/**
 * A start-date/end-date field with segmented text entry for both, plus a
 * trigger button that opens a popover range-calendar. Wraps RAC's
 * `DateRangePicker` + `RangeCalendar`.
 *
 * ```tsx
 * <DateRangeInput
 *   label="Trip dates"
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export function DateRangeInput<T extends DateValue = DateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: DateRangeInputProps<T>): JSX.Element {
  const dr = dateRangeInput();
  return (
    <AriaDateRangePicker {...props} {...mergeProps(dr.root, className)}>
      {label ? <Label {...mergeProps(dr.label)}>{label}</Label> : null}
      <Group {...mergeProps(dr.group)}>
        <AriaDateInput slot="start">
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
      {description ? (
        <Text slot="description" {...mergeProps(dr.description)}>
          {description}
        </Text>
      ) : null}
      <FieldError {...mergeProps(dr.error)}>{errorMessage ?? ''}</FieldError>
      <Popover {...mergeProps(dr.popover)}>
        <Dialog>
          <RangeCalendar>
            <header {...mergeProps(dr.calendarHeader)}>
              <Button slot="previous" {...mergeProps(dr.calendarNavButton)}>
                <Icon name="chevronLeft" size="sm" />
              </Button>
              <Heading {...mergeProps(dr.calendarHeading)} />
              <Button slot="next" {...mergeProps(dr.calendarNavButton)}>
                <Icon name="chevronRight" size="sm" />
              </Button>
            </header>
            <CalendarGrid {...mergeProps(dr.calendarGrid)}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell {...mergeProps(dr.calendarHeaderCell)}>
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} {...mergeProps(dr.calendarCell)} />}
              </CalendarGridBody>
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}
