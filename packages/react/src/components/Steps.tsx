import type { ComponentPropsWithRef, JSX } from 'react';
import { steps } from '@var-ui/core/components/steps';
import { mergeProps } from 'typestyles';

export type StepsProps = ComponentPropsWithRef<'ol'>;

/** Numbered steps list (`<ol>`). Children should be `<li>` elements. */
export function Steps({ className, ref, ...rest }: StepsProps): JSX.Element {
  return <ol {...rest} {...mergeProps(steps().root, className)} ref={ref} />;
}
