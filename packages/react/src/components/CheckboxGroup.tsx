import type { JSX, ReactNode, Ref } from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as RACCheckboxGroupProps,
} from 'react-aria-components';
import { checkbox } from '@var-ui/core/components/checkbox';
import { field } from '@var-ui/core/components/field';
import { mergeProps } from 'typestyles';
import { mergeRacClassName } from '../internal/racClassName';
import { RacFieldFrame, racInvalid } from './FieldFrame';

export type CheckboxGroupOption = {
  /** Value submitted with the form when this option is selected. */
  value: string;
  /** Visible label beside the checkbox control. */
  label: string;
  /** Disables just this option. */
  isDisabled?: boolean;
};

export type CheckboxGroupProps = Omit<RACCheckboxGroupProps, 'children'> & {
  /** Group label rendered above the option list. */
  label?: ReactNode;
  /** Helper text shown below the options. */
  description?: ReactNode;
  /** Validation message; when set, the group is shown in an error state. */
  errorMessage?: ReactNode;
  /** Options to render as checkboxes. */
  options: CheckboxGroupOption[];
  /** Ref to the `role="group"` `<div>` (a group has no single native control). */
  ref?: Ref<HTMLDivElement>;
};

export function CheckboxGroup({
  label,
  description,
  errorMessage,
  options,
  className,
  ref,
  ...props
}: CheckboxGroupProps): JSX.Element {
  const r = checkbox();
  const f = field();
  return (
    <AriaCheckboxGroup
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
          <AriaCheckbox
            key={option.value}
            value={option.value}
            isDisabled={option.isDisabled}
            {...mergeProps(r.root)}
          >
            {({ isSelected, isIndeterminate }) => (
              <>
                <span
                  {...mergeProps(r.box)}
                  data-selected={isSelected || undefined}
                  data-indeterminate={isIndeterminate || undefined}
                >
                  {isIndeterminate ? '−' : isSelected ? '✓' : ''}
                </span>
                <span {...mergeProps(r.label)}>{option.label}</span>
              </>
            )}
          </AriaCheckbox>
        ))}
      </RacFieldFrame>
    </AriaCheckboxGroup>
  );
}
