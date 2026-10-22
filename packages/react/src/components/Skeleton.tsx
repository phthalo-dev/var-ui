import type { CSSProperties, JSX } from 'react';
import { skeleton, type SkeletonVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SkeletonProps = {
  shape?: NonNullable<SkeletonVariantProps['shape']>;
  className?: string;
  style?: CSSProperties;
};

/** Loading placeholder. Size with `style` width/height. */
export function Skeleton({ shape = 'text', className, style }: SkeletonProps): JSX.Element {
  return <div {...mergeProps(skeleton({ shape }), className)} aria-hidden="true" style={style} />;
}
