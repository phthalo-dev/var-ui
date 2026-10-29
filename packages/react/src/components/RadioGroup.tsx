import type { JSX, ReactNode, Ref } from 'react';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
} from 'react-aria-components';
import { radio } from '@var-ui/core/components/radio';
import { field } from '@var-ui/core/components/field';
import { mergeProps } from 'typestyles';
import { mergeRacClassName } from '../internal/racClassName';
import { RacFieldFrame, racInvalid } from './FieldFrame';

export type RadioGroupOption = {
  /** Value submitted with the form when this option is selected. */
  value: string;
  /** Visible label beside the radio control. */
  label: string;
  /** Disables just this option. */
  isDisabled?: boolean;
};

export type RadioGroupProps = Omit<RACRadioGroupProps, 'children'> & {
  /** Group label rendered above the option list. */
  label?: ReactNode;
  /** Helper text shown below the options. */
  description?: ReactNode;
  /** Validation message; when set, the group is shown in an error state. */
  errorMessage?: ReactNode;
  /** Options to render as radio buttons. */
  options: RadioGroupOption[];
  /** Ref to the `role="radiogroup"` `<div>` (a group has no single native control). */
  ref?: Ref<HTMLDivElement>;
};

export function RadioGroup({
  label,
  description,
  errorMessage,
  options,
  className,
  ref,
  ...props
}: RadioGroupProps): JSX.Element {
  const r = radio();
  const f = field();
  return (
    <AriaRadioGroup
      {...props}
      isInvalid={racInvalid(props.isInvalid, errorMessage)}
      className={mergeRacClassName(r.group, className)}
      ref={ref}
    >
      <RacFieldFrame
        slots={{ label: r.groupLabel, description: f.description, error: f.error }}
        label={label}
        description={description}
        errorMessage={errorMessage}
      >
        {options.map((option) => (
          <AriaRadio
            key={option.value}
            value={option.value}
            isDisabled={option.isDisabled}
            {...mergeProps(r.item)}
          >
            {({ isSelected }) => (
              <>
                <span {...mergeProps(r.control)} data-selected={isSelected || undefined} />
                <span {...mergeProps(r.label)}>{option.label}</span>
              </>
            )}
          </AriaRadio>
        ))}
      </RacFieldFrame>
    </AriaRadioGroup>
  );
}
