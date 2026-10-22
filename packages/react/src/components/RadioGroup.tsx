import type { JSX } from 'react';
import {
  Label,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
} from 'react-aria-components';
import { radio } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type RadioGroupOption = {
  /** Value submitted with the form when this option is selected. */
  value: string;
  /** Visible label beside the radio control. */
  label: string;
};

export type RadioGroupProps = Omit<RACRadioGroupProps, 'children'> & {
  /** Group label rendered above the option list. */
  label?: string;
  /** Options to render as radio buttons. */
  options: RadioGroupOption[];
};

export function RadioGroup({ label, options, ...props }: RadioGroupProps): JSX.Element {
  const r = radio();
  return (
    <AriaRadioGroup {...props} {...mergeProps(r.group)}>
      {label ? <Label {...mergeProps(r.groupLabel)}>{label}</Label> : null}
      {options.map((option) => (
        <AriaRadio key={option.value} value={option.value} {...mergeProps(r.item)}>
          {({ isSelected }) => (
            <>
              <span {...mergeProps(r.control)} data-selected={isSelected || undefined} />
              <span {...mergeProps(r.label)}>{option.label}</span>
            </>
          )}
        </AriaRadio>
      ))}
    </AriaRadioGroup>
  );
}
