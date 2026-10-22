import type { JSX } from 'react';
import {
  Button as StepperButton,
  FieldError,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  type NumberFieldProps as RACNumberFieldProps,
} from 'react-aria-components';
import { numberInput, type NumberInputVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import type { FieldMeta } from './Field';

export type NumberInputProps = Omit<RACNumberFieldProps, 'className'> &
  FieldMeta & {
    className?: string;
    placeholder?: string;
    /** Control density. @default md */
    size?: NonNullable<NumberInputVariantProps['size']>;
  };

export function NumberInput({
  label,
  description,
  errorMessage,
  placeholder,
  size,
  className,
  ...props
}: NumberInputProps): JSX.Element {
  const n = numberInput({ size });
  return (
    <AriaNumberField {...props} {...mergeProps(n.root, className)}>
      {label ? <Label {...mergeProps(n.label)}>{label}</Label> : null}
      <Group {...mergeProps(n.group)}>
        <Input {...mergeProps(n.input)} placeholder={placeholder} />
        <div {...mergeProps(n.stepper)}>
          <StepperButton slot="decrement" aria-label="Decrease">
            −
          </StepperButton>
          <StepperButton slot="increment" aria-label="Increase">
            +
          </StepperButton>
        </div>
      </Group>
      {description ? <p {...mergeProps(n.description)}>{description}</p> : null}
      <FieldError {...mergeProps(n.error)}>{errorMessage ?? ''}</FieldError>
    </AriaNumberField>
  );
}
