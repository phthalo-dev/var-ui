import type { ComponentPropsWithRef, JSX } from 'react';
import {
  Input,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import { textField } from '@var-ui/core/components/textField';
import type { TextFieldVariantProps } from '@var-ui/core';
import type { FieldMeta } from './Field';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { mergeProps } from 'typestyles';
import { mergeRacClassName } from '../internal/racClassName';
import { useControlSize } from '../internal/controlSizeContext';
import { splitRacFieldProps } from '../internal/racFieldProps';

/** RAC-owned props shared by the text-like fields; their names stay RAC's until the vocabulary PR. */
export type RacTextFieldRootProps = Pick<
  AriaTextFieldProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'isDisabled'
  | 'isReadOnly'
  | 'isRequired'
  | 'isInvalid'
  | 'validate'
  | 'validationBehavior'
  | 'className'
  | 'style'
>;

/** Native `<input>`/`<textarea>` props that are replaced by the RAC equivalents above. */
export type RacTextFieldReplacedKeys =
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'className'
  | 'style'
  | 'children'
  | 'size'
  | 'disabled'
  | 'required'
  | 'readOnly';

export type BaseTextFieldProps = RacTextFieldRootProps & FieldMeta;

export type TextFieldProps = Omit<ComponentPropsWithRef<'input'>, RacTextFieldReplacedKeys> &
  BaseTextFieldProps & {
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: NonNullable<TextFieldVariantProps['size']>;
  };

/**
 * Text input with label, description and error. `className`/`style` style the
 * root; `ref` and every other native attribute reach the `<input>`.
 */
export function TextField({
  label,
  description,
  errorMessage,
  size,
  className,
  style,
  ...props
}: TextFieldProps): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize ?? 'md';
  const tf = textField({ size: resolvedSize });
  const [rootProps, inputProps] = splitRacFieldProps(props);
  return (
    <AriaTextField
      {...rootProps}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
      className={mergeRacClassName(tf.root, className)}
      style={style}
    >
      <RacFieldFrame slots={tf} label={label} description={description} errorMessage={errorMessage}>
        <Input {...inputProps} {...mergeProps(tf.input)} />
      </RacFieldFrame>
    </AriaTextField>
  );
}
