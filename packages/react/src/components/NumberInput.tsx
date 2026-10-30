import type { ComponentPropsWithRef, JSX } from 'react';
import {
  Button as StepperButton,
  Group,
  Input,
  NumberField as AriaNumberField,
  type NumberFieldProps as RACNumberFieldProps,
} from 'react-aria-components';
import { numberInput } from '@var-ui/core/components/numberInput';
import type { NumberInputVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import type { FieldMeta } from './Field';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import { mergeRacClassName } from '../internal/racClassName';
import { useControlSize } from '../internal/controlSizeContext';
import { splitRacFieldProps } from '../internal/racFieldProps';

/** VarUI-named props that stay with the RAC `NumberField` root (it owns the number state and hidden form input). */
const NUMBER_ROOT_KEYS = [
  'min',
  'max',
  'step',
  'formatOptions',
  'wheelDisabled',
  'name',
  'form',
  'autoFocus',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onKeyUp',
  'onCopy',
  'onCut',
  'onPaste',
  'onCompositionStart',
  'onCompositionEnd',
  'onCompositionUpdate',
  'onSelect',
  'onBeforeInput',
  'onInput',
  'slot',
] as const;

export type NumberInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'value'
  | 'defaultValue'
  | 'className'
  | 'style'
  | 'children'
  | 'size'
  | 'disabled'
  | 'required'
  | 'readOnly'
  | 'type'
  | 'min'
  | 'max'
  | 'step'
  | 'ref'
> &
  FieldMeta & {
    /** Controlled value. `NaN` when the field is empty. */
    value?: number;
    /** Initial value when uncontrolled. */
    defaultValue?: number;
    /** Called with the parsed number (`NaN` when cleared). The native `onChange` event still reaches the `<input>`. */
    onValueChange?: (value: number) => void;
    /** Smallest allowed value. */
    min?: number;
    /** Largest allowed value. */
    max?: number;
    /** Amount the stepper buttons and arrow keys change the value by. @default 1 */
    step?: number;
    /** Number formatting (currency, percent, units, ...). */
    formatOptions?: Intl.NumberFormatOptions;
    /** Disables changing the value with the mouse wheel while focused. */
    wheelDisabled?: boolean;
    /** Disables the control. */
    disabled?: boolean;
    /** Makes the value read-only (focusable, not editable). */
    readOnly?: boolean;
    /** Marks the field required. */
    required?: boolean;
    /** Shows the error state. Defaults to `Boolean(errorMessage)`. */
    invalid?: boolean;
    /** Custom validation; return a message (or messages) to mark the value invalid. */
    validate?: RACNumberFieldProps['validate'];
    /** `native` uses browser constraint validation; `aria` validates on the fly. @default native */
    validationBehavior?: 'native' | 'aria';
    /** Classes for the root element. A function receives RAC render state. */
    className?: RACNumberFieldProps['className'];
    /** Inline style for the root element. */
    style?: RACNumberFieldProps['style'];
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: NonNullable<NumberInputVariantProps['size']>;
    /**
     * Accessible name of the decrement button.
     * @default 'Decrease'
     */
    decrementLabel?: string;
    /**
     * Accessible name of the increment button.
     * @default 'Increase'
     */
    incrementLabel?: string;
    /** Ref to the underlying `<input>` element. */
    ref?: ComponentPropsWithRef<'input'>['ref'];
  };

/**
 * Number field with stepper buttons. `className`/`style` style the root; `ref`
 * and native attributes (`data-*`, `placeholder`, `autoComplete`, ...) reach
 * the `<input>`. `name`/`form` go to the RAC root, which submits the numeric
 * value through a hidden input.
 */
export function NumberInput({
  label,
  description,
  errorMessage,
  size,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  className,
  style,
  ...props
}: NumberInputProps): JSX.Element {
  const contextSize = useControlSize();
  const n = numberInput({ size: size ?? contextSize ?? 'md' });
  const [{ min, max, ...rootProps }, inputProps] = splitRacFieldProps(props, NUMBER_ROOT_KEYS);
  return (
    <AriaNumberField
      {...(rootProps as unknown as Partial<RACNumberFieldProps>)}
      minValue={min as number | undefined}
      maxValue={max as number | undefined}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
      className={mergeRacClassName(n.root, className)}
      style={style}
    >
      <RacFieldFrame slots={n} label={label} description={description} errorMessage={errorMessage}>
        <Group {...mergeProps(n.group)}>
          <Input {...(inputProps as object)} {...mergeProps(n.input)} />
          <div {...mergeProps(n.stepper)}>
            <StepperButton slot="decrement" aria-label={decrementLabel}>
              −
            </StepperButton>
            <StepperButton slot="increment" aria-label={incrementLabel}>
              +
            </StepperButton>
          </div>
        </Group>
      </RacFieldFrame>
    </AriaNumberField>
  );
}
