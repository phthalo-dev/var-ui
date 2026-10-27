import type { CSSProperties, JSX, Ref } from 'react';
import { skeleton, type SkeletonVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SkeletonProps = {
  shape?: NonNullable<SkeletonVariantProps['shape']>;
  className?: string;
  style?: CSSProperties;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/** Loading placeholder. Size with `style` width/height. */
export function Skeleton({ shape = 'text', className, style, ref }: SkeletonProps): JSX.Element {
  return (
    <div
      {...mergeProps(skeleton({ shape }), className)}
      aria-hidden="true"
      style={style}
      ref={ref}
    />
  );
}
