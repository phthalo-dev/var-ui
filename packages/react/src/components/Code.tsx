import type { JSX, ReactNode, Ref } from 'react';
import { inlineCode } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type CodeProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<code>` element. */
  ref?: Ref<HTMLElement>;
};

/** Inline code snippet styling. */
export function Code({ children, className, ref }: CodeProps): JSX.Element {
  return (
    <code {...mergeProps(inlineCode(), className)} ref={ref}>
      {children}
    </code>
  );
}
