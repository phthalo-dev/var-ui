import type { HTMLAttributes, JSX, Ref } from 'react';
import { surface, type SurfaceVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  /** @default md */
  padding?: NonNullable<SurfaceVariantProps['padding']>;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/** Bordered content box without title/body slots. */
export function Surface({
  className,
  padding = 'md',
  children,
  ref,
  ...props
}: SurfaceProps): JSX.Element {
  return (
    <div {...props} {...mergeProps(surface({ padding }), className)} ref={ref}>
      {children}
    </div>
  );
}
