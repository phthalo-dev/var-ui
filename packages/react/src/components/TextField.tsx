import type { JSX, Ref } from 'react';
import {
  FieldError,
  Input,
  Label,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import { textField } from '@var-ui/core/components/textField';
import type { TextFieldVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import type { FieldMeta } from './Field';
import { mergeRacClassName } from '../internal/racClassName';

export type BaseTextFieldProps = Omit<AriaTextFieldProps, 'children'> &
  FieldMeta & {
    /** Ref to the underlying root `<div>` element. */
    ref?: Ref<HTMLDivElement>;
  };

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
  className,
  ref,
  ...props
}: TextFieldProps): JSX.Element {
  const tf = textField({ size });
  return (
    <AriaTextField {...props} className={mergeRacClassName(tf.root, className)} ref={ref}>
      {label ? <Label {...mergeProps(tf.label)}>{label}</Label> : null}
      <Input {...mergeProps(tf.input)} placeholder={placeholder} />
      {description ? <p {...mergeProps(tf.description)}>{description}</p> : null}
      <FieldError {...mergeProps(tf.error)}>{errorMessage ?? ''}</FieldError>
    </AriaTextField>
  );
}
