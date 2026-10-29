import type { ComponentPropsWithRef, JSX } from 'react';
import { kbd } from '@var-ui/core/components/kbd';
import { mergeProps } from 'typestyles';

export type KbdProps = ComponentPropsWithRef<'kbd'>;

/** Keyboard key cap for shortcut hints. */
export function Kbd({ className, ref, ...rest }: KbdProps): JSX.Element {
  return <kbd {...rest} {...mergeProps(kbd(), className)} ref={ref} />;
}
