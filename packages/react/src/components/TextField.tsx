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

/**
 * Value, state and validation props shared by the text-like fields. VarUI names; the
 * components convert to RAC at the boundary (`splitRacFieldProps`).
 */
export type BaseTextFieldProps = FieldMeta & {
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the new string value. The native `onChange` event still reaches the `<input>`. */
  onValueChange?: (value: string) => void;
  /** Disables the control. */
  disabled?: boolean;
  /** Makes the value read-only (focusable, not editable). */
  readOnly?: boolean;
  /** Marks the field required. */
  required?: boolean;
  /** Shows the error state. Defaults to `Boolean(errorMessage)`. */
  invalid?: boolean;
  /** Custom validation; return a message (or messages) to mark the value invalid. */
  validate?: AriaTextFieldProps['validate'];
  /** `native` uses browser constraint validation; `aria` validates on the fly. @default native */
  validationBehavior?: 'native' | 'aria';
  /** Classes for the root element. A function receives RAC render state. */
  className?: AriaTextFieldProps['className'];
  /** Inline style for the root element. */
  style?: AriaTextFieldProps['style'];
};

/** Native `<input>`/`<textarea>` props that {@link BaseTextFieldProps} or the root replace. Native `onChange` is kept. */
export type RacTextFieldReplacedKeys =
  | 'value'
  | 'defaultValue'
  | 'className'
  | 'style'
  | 'children'
  | 'size'
  | 'disabled'
  | 'required'
  | 'readOnly';

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
