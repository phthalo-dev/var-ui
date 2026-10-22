import type { JSX } from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  Label,
  type CheckboxGroupProps as RACCheckboxGroupProps,
} from 'react-aria-components';
import { checkbox } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type CheckboxGroupOption = {
  /** Value submitted with the form when this option is selected. */
  value: string;
  /** Visible label beside the checkbox control. */
  label: string;
};

export type CheckboxGroupProps = Omit<RACCheckboxGroupProps, 'children'> & {
  /** Group label rendered above the option list. */
  label?: string;
  /** Options to render as checkboxes. */
  options: CheckboxGroupOption[];
};

export function CheckboxGroup({ label, options, ...props }: CheckboxGroupProps): JSX.Element {
  const r = checkbox();
  return (
    <AriaCheckboxGroup {...props} {...mergeProps(r.group)}>
      {label ? <Label {...mergeProps(r.groupLabel)}>{label}</Label> : null}
      {options.map((option) => (
        <AriaCheckbox key={option.value} value={option.value} {...mergeProps(r.root)}>
          {({ isSelected }) => (
            <>
              <span {...mergeProps(r.box)} data-selected={isSelected || undefined}>
                {isSelected ? '✓' : ''}
              </span>
              <span {...mergeProps(r.label)}>{option.label}</span>
            </>
          )}
        </AriaCheckbox>
      ))}
    </AriaCheckboxGroup>
  );
}
