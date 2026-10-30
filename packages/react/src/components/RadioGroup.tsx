import type {
  ChangeEventHandler,
  ComponentPropsWithRef,
  CSSProperties,
  JSX,
  ReactNode,
  Ref,
} from 'react';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
} from 'react-aria-components';
import { radio } from '@var-ui/core/components/radio';
import { field } from '@var-ui/core/components/field';
import { mergeProps } from 'typestyles';
import { racRenderWithExtras } from '../internal/racDomProps';
import { toRacProps, type Option } from '../internal/racProps';
import { RacFieldFrame, racInvalid } from './FieldFrame';

export type RadioGroupOption = Omit<Option, 'label'> & {
  /** Visible label beside the radio control. */
  label: string;
};

export type RadioGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style' | 'onChange' | 'defaultValue' | 'ref'
> & {
  /** Group label rendered above the option list. */
  label?: ReactNode;
  /** Helper text shown below the options. */
  description?: ReactNode;
  /** Validation message; when set, the group is shown in an error state. */
  errorMessage?: ReactNode;
  /** Options to render as radio buttons. */
  options: RadioGroupOption[];
  /** Controlled selected value (`null` = controlled, nothing selected). */
  value?: string | null;
  /** Initially selected value when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the selected value. */
  onValueChange?: (value: string | null) => void;
  /**
   * Native change event from a radio input (`event.target` is the input). It is attached to the
   * group root in the capture phase, because react-aria stops `change` from bubbling, so
   * `event.currentTarget` is the group `<div>` and the handler runs before `onValueChange`.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Name submitted with the form. */
  name?: string;
  /** Disables every option. */
  disabled?: boolean;
  /** Makes the group read-only (focusable, not changeable). */
  readOnly?: boolean;
  /** Marks the group required for form validation. */
  required?: boolean;
  /** Shows the error state; defaults to `true` when `errorMessage` is set. */
  invalid?: boolean;
  /** Custom validation; return a message (or messages) to mark the group invalid. */
  validate?: RACRadioGroupProps['validate'];
  /** Whether to use native or ARIA validation. */
  validationBehavior?: 'native' | 'aria';
  /** Layout direction of the options. */
  orientation?: 'horizontal' | 'vertical';
  /** Classes for the group root. */
  className?: string;
  /** Inline style for the group root. */
  style?: CSSProperties;
  /** Ref to the `role="radiogroup"` `<div>` (a group has no single native control). */
  ref?: Ref<HTMLDivElement>;
};

export function RadioGroup({
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
}: RadioGroupProps): JSX.Element {
  const r = radio();
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
    <AriaRadioGroup
      {...(props as RACRadioGroupProps)}
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
          <AriaRadio
            key={option.value}
            value={option.value}
            isDisabled={option.disabled}
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
