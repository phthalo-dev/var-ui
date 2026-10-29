import type { JSX, Ref } from 'react';
import {
  DateInput as AriaDateInput,
  DateSegment,
  FieldError,
  Group,
  Label,
  Text,
  TimeField as AriaTimeField,
  type TimeFieldProps as RACTimeFieldProps,
  type TimeValue,
} from 'react-aria-components';
import { timeInput } from '@var-ui/core/components/timeInput';
import { mergeProps } from 'typestyles';

export type TimeInputProps<T extends TimeValue = TimeValue> = Omit<
  RACTimeFieldProps<T>,
  'children'
> & {
  /** Visible label rendered above the segmented input. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * A time-only field with segmented text entry — hour, minute, and AM/PM are
 * each individually focusable segments. No popover, no calendar; the
 * simplest of the date/time cluster. Wraps RAC's `TimeField`.
 *
 * ```tsx
 * <TimeInput label="Start time" value={time} onChange={setTime} />
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
  return (
    <AriaTimeField {...props} {...mergeProps(ti.root, className)} ref={ref}>
      {label ? <Label {...mergeProps(ti.label)}>{label}</Label> : null}
      <Group {...mergeProps(ti.group)}>
        <AriaDateInput>
          {(segment) => <DateSegment segment={segment} {...mergeProps(ti.segment)} />}
        </AriaDateInput>
      </Group>
      {description ? (
        <Text slot="description" {...mergeProps(ti.description)}>
          {description}
        </Text>
      ) : null}
      <FieldError {...mergeProps(ti.error)}>{errorMessage ?? ''}</FieldError>
    </AriaTimeField>
  );
}
