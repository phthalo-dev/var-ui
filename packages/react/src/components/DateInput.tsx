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
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
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
import { dateInput } from '@var-ui/core/components/dateInput';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type DateInputProps<T extends DateValue = DateValue> = Omit<
  RACDatePickerProps<T>,
  'children'
> & {
  /** Field label rendered above the segmented input. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  className?: string;
  /** Ref to the underlying picker `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Single-date field with segmented text entry (month/day/year as separate
 * focusable segments) plus a trigger button that opens a popover
 * month-calendar. Wraps RAC's `DatePicker`.
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
  return (
    <AriaDatePicker {...props} ref={ref} {...mergeProps(di.root, className)}>
      {label ? <Label {...mergeProps(di.label)}>{label}</Label> : null}
      <Group {...mergeProps(di.group)}>
        <AriaDateInput>
          {(segment) => <DateSegment segment={segment} {...mergeProps(di.segment)} />}
        </AriaDateInput>
        <Button {...mergeProps(di.trigger)}>
          <Icon name="chevronDown" size="sm" />
        </Button>
      </Group>
      {description ? (
        <Text slot="description" {...mergeProps(di.description)}>
          {description}
        </Text>
      ) : null}
      <FieldError {...mergeProps(di.error)}>{errorMessage ?? ''}</FieldError>
      <Popover {...mergeProps(di.popover)}>
        <Dialog>
          <AriaCalendar>
            <header {...mergeProps(di.calendarHeader)}>
              <Button slot="previous" {...mergeProps(di.calendarNavButton)}>
                <Icon name="chevronLeft" size="sm" />
              </Button>
              <Heading {...mergeProps(di.calendarHeading)} />
              <Button slot="next" {...mergeProps(di.calendarNavButton)}>
                <Icon name="chevronRight" size="sm" />
              </Button>
            </header>
            <CalendarGrid {...mergeProps(di.calendarGrid)}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell {...mergeProps(di.calendarHeaderCell)}>
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} {...mergeProps(di.calendarCell)} />}
              </CalendarGridBody>
            </CalendarGrid>
          </AriaCalendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
