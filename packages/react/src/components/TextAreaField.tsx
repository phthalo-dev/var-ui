import type { JSX } from 'react';
import { FieldError, Label, TextArea, TextField as AriaTextField } from 'react-aria-components';
import { textAreaField } from '@var-ui/core';
import type { BaseTextFieldProps } from './TextField';
import { mergeProps } from 'typestyles';
import { mergeRacClassName } from './racClassName';

export type TextAreaFieldProps = BaseTextFieldProps & {
  /** Placeholder text shown when the textarea is empty. */
  placeholder?: string;
};

export function TextAreaField({
  label,
  description,
  errorMessage,
  placeholder,
  className,
  ref,
  ...props
}: TextAreaFieldProps): JSX.Element {
  const field = textAreaField();
  return (
    <AriaTextField {...props} className={mergeRacClassName(field.root, className)} ref={ref}>
      {label ? <Label {...mergeProps(field.label)}>{label}</Label> : null}
      <TextArea {...mergeProps(field.input)} placeholder={placeholder} />
      {description ? <p {...mergeProps(field.description)}>{description}</p> : null}
      <FieldError {...mergeProps(field.error)}>{errorMessage ?? ''}</FieldError>
    </AriaTextField>
  );
}
