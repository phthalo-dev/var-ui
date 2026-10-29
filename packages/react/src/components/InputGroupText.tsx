import type { JSX, ReactNode, Ref } from 'react';
import { inputGroup } from '@var-ui/core/components/inputGroup';
import { useControlSize } from './controlSizeContext';
import { mergeProps } from 'typestyles';

export type InputGroupTextProps = {
  /** Text or a small icon rendered inside the addon. */
  children: ReactNode;
  /** Additional CSS class names merged onto the addon element. */
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
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
export function InputGroupText({ children, className, ref }: InputGroupTextProps): JSX.Element {
  const g = inputGroup({ size: useControlSize() });
  return (
    <div {...mergeProps(g.text, className)} ref={ref}>
      {children}
    </div>
  );
}
