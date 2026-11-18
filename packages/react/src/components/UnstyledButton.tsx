import type { ComponentPropsWithRef, JSX } from 'react';
import { unstyledButton } from '@var-ui/core/components/unstyledButton';
import { mergeProps } from 'typestyles';

export type UnstyledButtonProps = ComponentPropsWithRef<'button'>;

/**
 * A native `<button>` without chrome: no background, border, padding or font of its own. It
 * keeps the pointer cursor, the shared focus ring and a disabled state. Use it for small inline
 * toggles and custom pressable regions; use `Button` or `IconButton` when it should look like a
 * button. `type` defaults to `button`, and every native attribute, handler and `ref` reach the
 * element.
 *
 * ```tsx
 * <UnstyledButton aria-expanded={open} onClick={() => setOpen(!open)}>
 *   <Icon name="chevronDown" size="sm" />
 *   <VisuallyHidden>Show details</VisuallyHidden>
 * </UnstyledButton>
 * ```
 */
export function UnstyledButton({
  type = 'button',
  className,
  ref,
  ...rest
}: UnstyledButtonProps): JSX.Element {
  return <button type={type} {...rest} {...mergeProps(unstyledButton(), className)} ref={ref} />;
}
