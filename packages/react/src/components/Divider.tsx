import type { HTMLAttributes, JSX, Ref } from 'react';
import { divider } from '@var-ui/core/components/divider';
import type { DividerVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  /** Layout direction of the separator line. @default horizontal */
  orientation?: NonNullable<DividerVariantProps['orientation']>;
  /** Ref to the underlying `<hr>` element. */
  ref?: Ref<HTMLHRElement>;
};

/**
 * Hairline separator. Vertical orientation stretches inside flex rows and
 * exposes `aria-orientation`.
 */
export function Divider({
  orientation = 'horizontal',
  className,
  ref,
  ...props
}: DividerProps): JSX.Element {
  return (
    <hr
      {...props}
      ref={ref}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      {...mergeProps(divider({ orientation }), className)}
    />
  );
}
