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
import type { FieldMeta } from './Field';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { splitDataAttributes } from '../internal/dateFieldProps';
import { mergeRacClassName } from '../internal/racClassName';

export type TimeInputProps<T extends TimeValue = TimeValue> = Omit<
  RACTimeFieldProps<T>,
  'children'
> &
  FieldMeta & {
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
  const [rootProps, dataProps] = splitDataAttributes(props);
  return (
    <AriaTimeField
      {...rootProps}
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
