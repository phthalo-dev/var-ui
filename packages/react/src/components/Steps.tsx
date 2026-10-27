import type { JSX, ReactNode, Ref } from 'react';
import { steps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type StepsProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<ol>` element. */
  ref?: Ref<HTMLOListElement>;
};

/** Numbered steps list (`<ol>`). Children should be `<li>` elements. */
export function Steps({ children, className, ref }: StepsProps): JSX.Element {
  return (
    <ol {...mergeProps(steps().root, className)} ref={ref}>
      {children}
    </ol>
  );
}
