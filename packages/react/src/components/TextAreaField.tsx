import type { ComponentPropsWithRef, JSX } from 'react';
import { TextArea, TextField as AriaTextField } from 'react-aria-components';
import { textAreaField } from '@var-ui/core/components/textAreaField';
import type { ControlSize } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import type { BaseTextFieldProps, RacTextFieldReplacedKeys } from './TextField';
import { mergeRacClassName } from '../internal/racClassName';
import { useResolvedControlSize } from '../internal/controlSizeContext';
import { splitRacFieldProps } from '../internal/racFieldProps';
import { uncontrolledDomRender } from '../internal/uncontrolledDom';

export type TextAreaFieldProps = Omit<ComponentPropsWithRef<'textarea'>, RacTextFieldReplacedKeys> &
  BaseTextFieldProps & {
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: ControlSize;
  };

/**
 * Multi-line text field with label, description and error. `className`/`style`
 * style the root; `ref` and every other native attribute reach the `<textarea>`.
 */
export function TextAreaField({
  label,
  description,
  errorMessage,
  size,
  className,
  style,
  ...props
}: TextAreaFieldProps): JSX.Element {
  const field = textAreaField({ size: useResolvedControlSize(size) });
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
        <TextArea
          {...textAreaProps}
          {...mergeProps(field.input)}
          render={
            uncontrolledDomRender(
              'textarea',
              props.value !== undefined,
              props.defaultValue,
            ) as never
          }
        />
      </RacFieldFrame>
    </AriaTextField>
  );
}
