import type { ComponentPropsWithRef, JSX } from 'react';
import { TextArea, TextField as AriaTextField } from 'react-aria-components';
import { textAreaField } from '@var-ui/core/components/textAreaField';
import { mergeProps } from 'typestyles';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import type { BaseTextFieldProps, RacTextFieldReplacedKeys } from './TextField';
import { mergeRacClassName } from '../internal/racClassName';
import { splitRacFieldProps } from '../internal/racFieldProps';

export type TextAreaFieldProps = Omit<ComponentPropsWithRef<'textarea'>, RacTextFieldReplacedKeys> &
  BaseTextFieldProps;

/**
 * Multi-line text field with label, description and error. `className`/`style`
 * style the root; `ref` and every other native attribute reach the `<textarea>`.
 */
export function TextAreaField({
  label,
  description,
  errorMessage,
  className,
  style,
  ...props
}: TextAreaFieldProps): JSX.Element {
  const field = textAreaField();
  const [rootProps, textAreaProps] = splitRacFieldProps(props);
  return (
    <AriaTextField
      {...rootProps}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
      className={mergeRacClassName(field.root, className)}
      style={style}
    >
      <RacFieldFrame
        slots={field}
        label={label}
        description={description}
        errorMessage={errorMessage}
      >
        <TextArea {...textAreaProps} {...mergeProps(field.input)} />
      </RacFieldFrame>
    </AriaTextField>
  );
}
