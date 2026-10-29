import { useImperativeHandle, useRef, type JSX, type ReactNode, type Ref } from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as RACCheckboxProps,
} from 'react-aria-components';
import { checkbox } from '@var-ui/core/components/checkbox';
import { mergeProps } from 'typestyles';

export type CheckboxProps = Omit<RACCheckboxProps, 'children' | 'className' | 'inputRef'> & {
  /** Label rendered beside the checkbox control. */
  children?: ReactNode;
  className?: string;
  /**
   * Ref to the native `<input type="checkbox">`. react-aria-components sends the field attributes
   * it knows (`id`, `name`, `value`, `aria-*`, handlers) to the input and the rest to the `<label>`.
   */
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({ children, className, ref, ...props }: CheckboxProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  // RAC's `inputRef` only takes an object ref; this also serves callback refs.
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const cb = checkbox();
  return (
    <AriaCheckbox {...props} {...mergeProps(cb.root, className)} inputRef={inputRef}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <span
            {...mergeProps(cb.box)}
            data-selected={isSelected || undefined}
            data-indeterminate={isIndeterminate || undefined}
          >
            {isIndeterminate ? '−' : isSelected ? '✓' : ''}
          </span>
          <span {...mergeProps(cb.label)}>{children}</span>
        </>
      )}
    </AriaCheckbox>
  );
}
