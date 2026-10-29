import type { JSX, ReactNode, Ref } from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as RACCheckboxProps,
} from 'react-aria-components';
import { checkbox } from '@var-ui/core/components/checkbox';
import { mergeProps } from 'typestyles';

export type CheckboxProps = Omit<RACCheckboxProps, 'children' | 'className'> & {
  /** Label rendered beside the checkbox control. */
  children?: ReactNode;
  className?: string;
  /** Ref to the underlying `<label>` element. */
  ref?: Ref<HTMLLabelElement>;
};

export function Checkbox({ children, className, ref, ...props }: CheckboxProps): JSX.Element {
  const cb = checkbox();
  return (
    <AriaCheckbox {...props} {...mergeProps(cb.root, className)} ref={ref}>
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
