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

/** Props that stay with the RAC `NumberField` root (it owns the number state and hidden form input). */
const NUMBER_ROOT_KEYS = [
  'minValue',
  'maxValue',
  'step',
  'formatOptions',
  'isWheelDisabled',
  'name',
  'form',
  'autoFocus',
  'onFocus',
  'onBlur',
  'onFocusChange',
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
  keyof RACNumberFieldProps | 'size' | 'disabled' | 'required' | 'readOnly' | 'type' | 'ref'
> &
  Omit<RACNumberFieldProps, 'children'> &
  FieldMeta & {
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
  const [rootProps, inputProps] = splitRacFieldProps(props, NUMBER_ROOT_KEYS);
  return (
    <AriaNumberField
      {...(rootProps as Partial<RACNumberFieldProps>)}
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
