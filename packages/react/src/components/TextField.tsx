import type { JSX } from 'react';
import { FieldError, Input, Label, TextField as AriaTextField } from 'react-aria-components';
import { textField, type TextFieldVariantProps } from '@var-ui/core';
import type { BaseTextFieldProps } from './utils';
import { mergeProps } from './utils';

export type TextFieldProps = BaseTextFieldProps & {
  /** Placeholder text shown when the input is empty. */
  placeholder?: string;
  size?: NonNullable<TextFieldVariantProps['size']>;
};

export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  ...props
}: TextFieldProps): JSX.Element {
  const tf = textField({ size });
  return (
    <AriaTextField {...props} {...mergeProps(tf.root)}>
      {label ? <Label {...mergeProps(tf.label)}>{label}</Label> : null}
      <Input {...mergeProps(tf.input)} placeholder={placeholder} />
      {description ? <p {...mergeProps(tf.description)}>{description}</p> : null}
      <FieldError {...mergeProps(tf.error)}>{errorMessage ?? ''}</FieldError>
    </AriaTextField>
  );
}
