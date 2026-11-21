import type { ComponentPropsWithRef, JSX } from 'react';
import { TextArea, TextField as AriaTextField } from 'react-aria-components';
import { textAreaField } from '@var-ui/core/components/textAreaField';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import type { ControlSize } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import type { BaseTextFieldProps, RacTextFieldReplacedKeys } from './TextField';
import { mergeRacClassName } from '../internal/racClassName';
import { useResolvedControlSize } from '../internal/controlSizeContext';
import { splitRacFieldProps } from '../internal/racFieldProps';
import { uncontrolledDomRender } from '../internal/uncontrolledDom';

const areaVars = recipeVars(textAreaField);

export type TextAreaFieldProps = Omit<ComponentPropsWithRef<'textarea'>, RacTextFieldReplacedKeys> &
  BaseTextFieldProps & {
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: ControlSize;
    /**
     * Grow with the content (CSS `field-sizing: content`), between `minRows` and `maxRows`.
     * Browsers without `field-sizing` keep a fixed height and scroll. @default false
     */
    autosize?: boolean;
    /** Smallest height with `autosize`, in lines. @default 2 */
    minRows?: number;
    /** Largest height with `autosize`, in lines; it scrolls past that. No cap by default. */
    maxRows?: number;
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
  autosize = false,
  minRows,
  maxRows,
  className,
  style,
  ...props
}: TextAreaFieldProps): JSX.Element {
  const field = textAreaField({ size: useResolvedControlSize(size), autosize });
  const rowVars = autosize
    ? styleVars([
        [areaVars.minRows, minRows],
        [areaVars.maxRows, maxRows],
      ])
    : undefined;
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
          data-max-rows={autosize && maxRows === undefined ? 'none' : undefined}
          style={rowVars}
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
