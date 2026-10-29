import type { ComponentPropsWithRef, JSX } from 'react';
import { surface } from '@var-ui/core/components/surface';
import type { SurfaceVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SurfaceProps = ComponentPropsWithRef<'div'> & {
  /** @default md */
  padding?: NonNullable<SurfaceVariantProps['padding']>;
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
