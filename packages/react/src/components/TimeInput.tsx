import type { JSX, Ref } from 'react';
import {
  DateInput as AriaDateInput,
  DateSegment,
  Group,
  TimeField as AriaTimeField,
  type TimeFieldProps as RACTimeFieldProps,
  type TimeValue,
} from 'react-aria-components';
import { timeInput } from '@var-ui/core/components/timeInput';
import { mergeProps } from 'typestyles';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { splitDataAttributes, type DateFieldBaseProps } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

type TimeFieldRac<T extends TimeValue> = RACTimeFieldProps<T>;

export type TimeInputProps<T extends TimeValue = TimeValue> = DateFieldBaseProps<
  TimeFieldRac<T>
> & {
  /** Controlled time. `null` means controlled-empty. */
  value?: T | null;
  /** Initial time when uncontrolled. */
  defaultValue?: T | null;
  /** Called with the new time, or `null` when the field is cleared. */
  onValueChange?: NonNullable<TimeFieldRac<T>['onChange']>;
  /** Earliest allowed time. */
  min?: TimeFieldRac<T>['minValue'];
  /** Latest allowed time. */
  max?: TimeFieldRac<T>['maxValue'];
  placeholderValue?: TimeFieldRac<T>['placeholderValue'];
  /** Smallest unit shown as an editable segment. @default minute */
  granularity?: TimeFieldRac<T>['granularity'];
  hourCycle?: TimeFieldRac<T>['hourCycle'];
  hideTimeZone?: boolean;
  shouldForceLeadingZeros?: boolean;
  /** Custom validation; return a message (or messages) to mark the field invalid. */
  validate?: TimeFieldRac<T>['validate'];
  /** Ref to the segmented input element (the field's primary control). */
  ref?: Ref<HTMLDivElement>;
};

/**
 * A time-only field with segmented text entry: hour, minute, and AM/PM are
 * each individually focusable segments. No popover, no calendar. Wraps RAC's
 * `TimeField`. `className`/`style` style the root; `ref` and `data-*`
 * attributes reach the segmented input.
 *
 * ```tsx
 * <TimeInput label="Start time" value={time} onValueChange={setTime} />
 * ```
 */
export function TimeInput<T extends TimeValue = TimeValue>({
  label,
  description,
  errorMessage,
  className,
  ref,
  ...props
}: TimeInputProps<T>): JSX.Element {
  const ti = timeInput();
  const [rootProps, dataProps] = splitDataAttributes(props);
  return (
    <AriaTimeField
      {...(rootProps as RACTimeFieldProps<T>)}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
      className={mergeRacClassName(ti.root, className)}
    >
      <RacFieldFrame slots={ti} label={label} description={description} errorMessage={errorMessage}>
        <Group {...mergeProps(ti.group)}>
          <AriaDateInput {...dataProps} ref={ref}>
            {(segment) => <DateSegment segment={segment} {...mergeProps(ti.segment)} />}
          </AriaDateInput>
        </Group>
      </RacFieldFrame>
    </AriaTimeField>
  );
}
