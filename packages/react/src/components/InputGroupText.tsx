import type { JSX, ReactNode } from 'react';
import { inputGroup } from '@var-ui/core';
import { useControlSize } from './controlSizeContext';
import { mergeProps } from './utils';

export type InputGroupTextProps = {
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
export function InputGroupText({ children, className }: InputGroupTextProps): JSX.Element {
  const g = inputGroup({ size: useControlSize() });
  return <div {...mergeProps(g.text, className)}>{children}</div>;
}
