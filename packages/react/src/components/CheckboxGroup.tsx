import type {
  ChangeEventHandler,
  ComponentPropsWithRef,
  CSSProperties,
  JSX,
  ReactNode,
  Ref,
} from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as RACCheckboxGroupProps,
} from 'react-aria-components';
import { checkbox } from '@var-ui/core/components/checkbox';
import { field } from '@var-ui/core/components/field';
import { mergeProps } from 'typestyles';
import { racRenderWithExtras } from '../internal/racDomProps';
import { toRacProps, type Option } from '../internal/racProps';
import { RacFieldFrame, racInvalid } from './FieldFrame';

export type CheckboxGroupOption = Omit<Option, 'label'> & {
  /** Visible label beside the checkbox control. */
  label: string;
};

export type CheckboxGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style' | 'onChange' | 'defaultValue' | 'ref'
> & {
  /** Group label rendered above the option list. */
  label?: ReactNode;
  /** Helper text shown below the options. */
  description?: ReactNode;
  /** Validation message; when set, the group is shown in an error state. */
  errorMessage?: ReactNode;
  /** Options to render as checkboxes. */
  options: CheckboxGroupOption[];
  /** Controlled selected values. */
  value?: string[];
  /** Initially selected values when uncontrolled. */
  defaultValue?: string[];
  /** Called with the selected values. */
  onValueChange?: (value: string[]) => void;
  /**
   * Native change event from a checkbox input (`event.target` is the input). It is attached to
   * the group root in the capture phase, because react-aria stops `change` from bubbling, so
   * `event.currentTarget` is the group `<div>` and the handler runs before `onValueChange`.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Name submitted with the form for every checked option. */
  name?: string;
  /** Disables every option. */
  disabled?: boolean;
  /** Makes the group read-only (focusable, not toggleable). */
  readOnly?: boolean;
  /** Marks the group required for form validation. */
  required?: boolean;
  /** Shows the error state; defaults to `true` when `errorMessage` is set. */
  invalid?: boolean;
  /** Custom validation; return a message (or messages) to mark the group invalid. */
  validate?: RACCheckboxGroupProps['validate'];
  /** Whether to use native or ARIA validation. */
  validationBehavior?: 'native' | 'aria';
  /** Classes for the group root. */
  className?: string;
  /** Inline style for the group root. */
  style?: CSSProperties;
  /** Ref to the `role="group"` `<div>` (a group has no single native control). */
  ref?: Ref<HTMLDivElement>;
};

export function CheckboxGroup({
  label,
  description,
  errorMessage,
  options,
  className,
  onChange,
  value,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  required,
  invalid,
  ref,
  ...props
}: CheckboxGroupProps): JSX.Element {
  const r = checkbox();
  const f = field();
  const racProps = toRacProps({
    value,
    defaultValue,
    onValueChange,
    disabled,
    readOnly,
    required,
  });
  return (
    <AriaCheckboxGroup
      {...(props as RACCheckboxGroupProps)}
      {...racProps}
      isInvalid={racInvalid(invalid, errorMessage)}
      {...mergeProps(r.group, className)}
      render={racRenderWithExtras('div', onChange ? { onChangeCapture: onChange } : {}) as never}
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
            isDisabled={option.disabled}
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
