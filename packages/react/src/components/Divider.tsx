import type { HTMLAttributes, JSX } from 'react';
import { divider, type DividerVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  /** Layout direction of the separator line. @default horizontal */
  orientation?: NonNullable<DividerVariantProps['orientation']>;
};

/**
 * Hairline separator. Vertical orientation stretches inside flex rows and
 * exposes `aria-orientation`.
 */
export function Divider({
  orientation = 'horizontal',
  className,
  ...props
}: DividerProps): JSX.Element {
  return (
    <hr
      {...props}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      {...mergeProps(divider({ orientation }), className)}
    />
  );
}
