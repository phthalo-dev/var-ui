import type { HTMLAttributes, JSX } from 'react';
import { surface, type SurfaceVariantProps } from '@var-ui/core';
import { mergeProps } from './utils';

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  /** @default md */
  padding?: NonNullable<SurfaceVariantProps['padding']>;
};

/** Bordered content box without title/body slots. */
export function Surface({
  className,
  padding = 'md',
  children,
  ...props
}: SurfaceProps): JSX.Element {
  return (
    <div {...props} {...mergeProps(surface({ padding }), className)}>
      {children}
    </div>
  );
}
