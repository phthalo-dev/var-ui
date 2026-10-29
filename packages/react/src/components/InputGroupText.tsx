import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { inputGroup } from '@var-ui/core/components/inputGroup';
import { useControlSize } from '../internal/controlSizeContext';
import { mergeProps } from 'typestyles';

export type InputGroupTextProps = Omit<ComponentPropsWithRef<'div'>, 'className'> & {
  /** Text or a small icon rendered inside the addon. */
  children: ReactNode;
  /** Additional CSS class names merged onto the addon element. */
  className?: string;
};

/**
 * Non-focusable addon chrome for an `InputGroup` — a static label glued to
 * the edge of a bare `<input>` (e.g. a currency symbol or unit).
 *
 * ```tsx
 * <InputGroup label="Price">
 *   <InputGroupText>$</InputGroupText>
 *   <InputGroupInput aria-label="Price" />
 * </InputGroup>
 * ```
 */
export function InputGroupText({ children, className, ...rest }: InputGroupTextProps): JSX.Element {
  const g = inputGroup({ size: useControlSize() });
  return (
    <div {...rest} {...mergeProps(g.text, className)}>
      {children}
    </div>
  );
}
