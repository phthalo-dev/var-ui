import type { ComponentPropsWithRef, CSSProperties, JSX, ReactNode, Ref } from 'react';
import { inputGroup } from '@var-ui/core/components/inputGroup';
import type { InputGroupVariantProps } from '@var-ui/core';
import { ControlSizeContext, useControlSize } from '../internal/controlSizeContext';
import { mergeProps } from 'typestyles';
import { FieldFrame, useFieldFrame } from './FieldFrame';

export type InputGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'style' | 'children' | 'ref' | 'role' | 'aria-labelledby'
> & {
  /** Visible label rendered above the group. */
  label: string;
  /** Helper text shown below the group when there is no error. */
  description?: string;
  /** Validation message; when set, the group is shown in an error state. */
  errorMessage?: string;
  /** Marks the group invalid; defaults to whether `errorMessage` is set. */
  invalid?: boolean;
  /** Disables the whole group (visually and via `aria-disabled`). */
  isDisabled?: boolean;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Inline style for the root element. */
  style?: CSSProperties;
  /** Plain `<input>`s (see `InputGroupInput`) and `InputGroupText` addons. */
  children: ReactNode;
  /** Control density inherited by `InputGroupInput` and `InputGroupText`. Falls back to the surrounding control size, then `md`. */
  size?: NonNullable<InputGroupVariantProps['size']>;
  /** Ref to the `role="group"` element that wraps the inputs. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Connected-border group for bare inputs and text addons — e.g. a currency
 * symbol glued to the edge of a price input. Unlike `TextField`/`NumberInput`,
 * this owns its own field chrome rather than delegating to those components;
 * children are rendered verbatim inside a `role="group"` container.
 * `className`/`style` style the root; `ref`, `id` and other attributes
 * (`data-*`, `aria-*`) reach the `role="group"` element.
 *
 * ```tsx
 * <InputGroup label="Price">
 *   <InputGroupText>$</InputGroupText>
 *   <InputGroupInput aria-label="Price" value={price} onChange={onChange} />
 * </InputGroup>
 * ```
 */
export function InputGroup({
  label,
  description,
  errorMessage,
  invalid,
  isDisabled,
  className,
  style,
  size,
  children,
  ref,
  id,
  'aria-describedby': describedBy,
  ...rest
}: InputGroupProps): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize ?? 'md';
  const g = inputGroup({ size: resolvedSize });
  const frame = useFieldFrame({ description, errorMessage, invalid, id, describedBy });
  return (
    <ControlSizeContext.Provider value={resolvedSize}>
      <FieldFrame
        slots={g}
        frame={frame}
        label={label}
        labelAs="span"
        description={description}
        errorMessage={errorMessage}
        errorRole="alert"
        className={className}
        style={style}
      >
        <div
          role="group"
          aria-disabled={isDisabled || undefined}
          data-disabled={isDisabled || undefined}
          data-invalid={frame.invalid || undefined}
          {...rest}
          {...frame.controlProps}
          aria-labelledby={frame.labelId}
          ref={ref}
          {...mergeProps(g.group)}
        >
          {children}
        </div>
      </FieldFrame>
    </ControlSizeContext.Provider>
  );
}

export type InputGroupInputProps = ComponentPropsWithRef<'input'>;

/**
 * Thin `<input>` wrapper applying `InputGroup`'s bare-input chrome. Use it
 * (rather than a raw `<input>`) for form controls rendered inside
 * `InputGroup` so their border radius joins with sibling addons.
 */
export function InputGroupInput({ className, ref, ...props }: InputGroupInputProps): JSX.Element {
  const g = inputGroup({ size: useControlSize() });
  return <input {...props} ref={ref} {...mergeProps(g.input, className)} />;
}
