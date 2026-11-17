import type { ComponentPropsWithRef, JSX } from 'react';
import { inlineCode } from '@var-ui/core/components/inlineCode';
import { mergeProps } from 'typestyles';

export type CodeProps = ComponentPropsWithRef<'code'> & {
  /** Keeps the snippet on one line, so a package name such as `@var-ui/react` never splits. */
  nowrap?: boolean;
};

/** Inline code snippet styling. */
export function Code({ className, nowrap = false, ref, ...rest }: CodeProps): JSX.Element {
  return <code {...rest} {...mergeProps(inlineCode({ nowrap }), className)} ref={ref} />;
}
