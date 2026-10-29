import type { ComponentPropsWithRef, JSX } from 'react';
import { inlineCode } from '@var-ui/core/components/inlineCode';
import { mergeProps } from 'typestyles';

export type CodeProps = ComponentPropsWithRef<'code'>;

/** Inline code snippet styling. */
export function Code({ className, ref, ...rest }: CodeProps): JSX.Element {
  return <code {...rest} {...mergeProps(inlineCode(), className)} ref={ref} />;
}
