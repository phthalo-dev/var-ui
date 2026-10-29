import type { HTMLAttributes, JSX, Ref } from 'react';
import { simpleGrid } from '@var-ui/core/components/simpleGrid';
import type { SimpleGridVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SimpleGridProps = HTMLAttributes<HTMLDivElement> & {
  /** Number of equal columns. @default 2 */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  /** Gap between grid items. @default md */
  spacing?: NonNullable<SimpleGridVariantProps['spacing']>;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

const colsVariant = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  8: 'eight',
} as const satisfies Record<
  NonNullable<SimpleGridProps['cols']>,
  NonNullable<SimpleGridVariantProps['cols']>
>;

/**
 * Equal-column grid layout. Mantine `SimpleGrid` equivalent.
 *
 * ```tsx
 * <SimpleGrid cols={3} spacing="sm">{items}</SimpleGrid>
 * ```
 */
export function SimpleGrid({
  cols = 2,
  spacing = 'md',
  className,
  ref,
  ...props
}: SimpleGridProps): JSX.Element {
  return (
    <div
      {...props}
      {...mergeProps(simpleGrid({ cols: colsVariant[cols], spacing }), className)}
      ref={ref}
    />
  );
}
