import type { JSX, ReactNode } from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as RACCheckboxProps,
} from 'react-aria-components';
import { checkbox } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type CheckboxProps = Omit<RACCheckboxProps, 'children' | 'className'> & {
  /** Label rendered beside the checkbox control. */
  children?: ReactNode;
  className?: string;
};

export function Checkbox({ children, className, ...props }: CheckboxProps): JSX.Element {
  const cb = checkbox();
  return (
    <AriaCheckbox {...props} {...mergeProps(cb.root, className)}>
      {({ isSelected }) => (
        <>
          <span {...mergeProps(cb.box)} data-selected={isSelected || undefined}>
            {isSelected ? '✓' : ''}
          </span>
          <span {...mergeProps(cb.label)}>{children}</span>
        </>
      )}
    </AriaCheckbox>
  );
}
