import type { JSX, ReactNode } from 'react';
import { inlineCode } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type CodeProps = {
  children: ReactNode;
  className?: string;
};

/** Inline code snippet styling. */
export function Code({ children, className }: CodeProps): JSX.Element {
  return <code {...mergeProps(inlineCode(), className)}>{children}</code>;
}
