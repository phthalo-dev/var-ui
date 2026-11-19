import type { HTMLAttributes, JSX, Ref } from 'react';
import { grid, gridColumnsVars, type GridResponsiveColumns } from '@var-ui/core/components/grid';
import type { Gap, GridVariantProps } from '@var-ui/core';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { mergeProps } from 'typestyles';

const gridVars = recipeVars(grid);

export type GridColumns = 'auto' | number | GridResponsiveColumns;

const columnVariant = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
} as const satisfies Partial<Record<number, NonNullable<GridVariantProps['columns']>>>;

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  /** `auto` packs minmax(minColumnWidth, 1fr) tracks; a number gives 1–8 fixed equal tracks; a map gives per-breakpoint counts (`{ base: 2, lg: 7 }`). @default auto */
  columns?: GridColumns;
  /** Minimum track width for `columns="auto"`. Any CSS length. @default size.field.minWidth (15rem) */
  minColumnWidth?: string;
  /** Gap between grid items. @default md */
  gap?: Gap;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function resolveColumns(columns: GridColumns): {
  variant: NonNullable<GridVariantProps['columns']>;
  columnsStyle?: Record<string, string>;
} {
  if (typeof columns === 'number') {
    const word = columnVariant[columns as keyof typeof columnVariant];
    if (word) {
      return { variant: word };
    }
    if (!Number.isInteger(columns) || columns < 1) {
      throw new Error(
        '[var-ui] Grid columns must be a positive integer, "auto", or a per-breakpoint count map.',
      );
    }
    // Counts beyond the named variants go through the responsive track variables.
    return { variant: 'fixed', columnsStyle: gridColumnsVars({ base: columns }) };
  }
  if (typeof columns === 'object' && columns !== null) {
    // `fixed` reads the per-breakpoint tracks and falls back to `auto` before the first set one.
    return { variant: 'fixed', columnsStyle: gridColumnsVars(columns) };
  }
  return { variant: 'auto' };
}

/**
 * Responsive grid layout primitive.
 *
 * ```tsx
 * <Grid columns="auto" gap="lg">{cards}</Grid>
 * <Grid columns={{ base: 2, lg: 7 }} minColumnWidth="8rem">{stats}</Grid>
 * ```
 */
export function Grid({
  columns = 'auto',
  minColumnWidth,
  gap = 'md',
  className,
  style,
  ref,
  ...props
}: GridProps): JSX.Element {
  const { variant, columnsStyle } = resolveColumns(columns);
  const minColumnWidthStyle = minColumnWidth
    ? styleVars([[gridVars.minColumnWidth, minColumnWidth]])
    : undefined;
  const ownStyle =
    columnsStyle || minColumnWidthStyle ? { ...columnsStyle, ...minColumnWidthStyle } : undefined;
  return (
    <div
      {...props}
      {...mergeProps(grid({ columns: variant, gap }), className)}
      style={ownStyle ? { ...ownStyle, ...style } : style}
      ref={ref}
    />
  );
}
