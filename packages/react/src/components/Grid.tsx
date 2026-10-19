import type { HTMLAttributes, JSX } from 'react';
import { grid, type GridVariantProps } from '@var-ui/core';
import { mergeProps } from './utils';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  /** `auto` packs minmax(240px, 1fr) tracks; numbers give fixed equal tracks. @default auto */
  columns?: 'auto' | 1 | 2 | 3 | 4;
  /** Gap between grid items. @default md */
  gap?: NonNullable<GridVariantProps['gap']>;
};

const columnVariant = {
  auto: 'auto',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
} as const satisfies Record<
  NonNullable<GridProps['columns']>,
  NonNullable<GridVariantProps['columns']>
>;

/**
 * Responsive grid layout primitive.
 *
 * ```tsx
 * <Grid columns="auto" gap="lg">{cards}</Grid>
 * ```
 */
export function Grid({
  columns = 'auto',
  gap = 'md',
  className,
  ...props
}: GridProps): JSX.Element {
  return (
    <div {...props} {...mergeProps(grid({ columns: columnVariant[columns], gap }), className)} />
  );
}
