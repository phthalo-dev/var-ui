import type { ComponentPropsWithRef, JSX } from 'react';
import { skeleton } from '@var-ui/core/components/skeleton';
import type { SkeletonVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SkeletonProps = ComponentPropsWithRef<'div'> & {
  shape?: NonNullable<SkeletonVariantProps['shape']>;
};

/** Loading placeholder. Size with `style` width/height. */
export function Skeleton({ shape = 'text', className, ref, ...rest }: SkeletonProps): JSX.Element {
  return (
    <div aria-hidden="true" {...rest} {...mergeProps(skeleton({ shape }), className)} ref={ref} />
  );
}
