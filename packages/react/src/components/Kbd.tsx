import type { JSX, ReactNode, Ref } from 'react';
import { kbd } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type KbdProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<kbd>` element. */
  ref?: Ref<HTMLElement>;
};

/** Keyboard key cap for shortcut hints. */
export function Kbd({ children, className, ref }: KbdProps): JSX.Element {
  return (
    <kbd {...mergeProps(kbd(), className)} ref={ref}>
      {children}
    </kbd>
  );
}
