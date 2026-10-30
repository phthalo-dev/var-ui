import type { ComponentPropsWithRef, CSSProperties, JSX, ReactNode, Ref } from 'react';
import { createContext, useContext } from 'react';
import { table as tableStyles } from '@var-ui/core/components/table';
import type { TableVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import type { SortDescriptor, SortDirection } from '../hooks/useTableSort';

export type TableColumnAlign = 'start' | 'center' | 'end';

export type TableColumnDef<T extends Record<string, unknown> = Record<string, unknown>> = {
  key: Extract<keyof T, string>;
  header?: ReactNode;
  align?: TableColumnAlign;
  rowHeader?: boolean;
  width?: string;
  allowsSorting?: boolean;
};

/**
 * `className`, `style` and `ref` target the root wrapper `<div>`; all other attributes are
 * forwarded to the `<table>` element.
 */
export type TableProps<T extends Record<string, unknown> = Record<string, unknown>> = Omit<
  ComponentPropsWithRef<'table'>,
  'children' | 'ref'
> & {
  density?: NonNullable<TableVariantProps['density']>;
  dividers?: NonNullable<TableVariantProps['dividers']>;
  striped?: NonNullable<TableVariantProps['striped']>;
  hasHover?: NonNullable<TableVariantProps['hasHover']>;
  stickyHeader?: NonNullable<TableVariantProps['stickyHeader']>;
  textOverflow?: NonNullable<TableVariantProps['textOverflow']>;
  /** @default 'auto' */
  layout?: NonNullable<TableVariantProps['layout']>;
  /** Column keys in display order — required with `columnWidths` for `<colgroup>`. */
  columnOrder?: string[];
  /** Explicit column widths keyed by column id. */
  columnWidths?: Record<string, string>;
  columns?: TableColumnDef<T>[];
  data?: T[];
  getRowId?: (row: T) => string;
  renderCell?: (column: TableColumnDef<T>, row: T) => ReactNode;
  emptyContent?: ReactNode;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (next: SortDescriptor) => void;
  children?: ReactNode;
  caption?: ReactNode;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type TableColumnProps = Omit<
  ComponentPropsWithRef<'th'>,
  'children' | 'align' | 'onSort'
> & {
  children?: ReactNode;
  rowHeader?: boolean;
  align?: TableColumnAlign;
  width?: string;
  allowsSorting?: boolean;
  sortDirection?: SortDirection | 'none';
  onSort?: () => void;
  resizeHandle?: ReactNode;
};

export type TableHeaderProps = ComponentPropsWithRef<'thead'>;
export type TableBodyProps = ComponentPropsWithRef<'tbody'>;
export type TableFooterProps = ComponentPropsWithRef<'tfoot'>;
/** Remaining props (`onClick`, `onDoubleClick`, `data-*`, `aria-*`, `id`, …) are forwarded to the `<tr>`. */
export type TableRowProps = ComponentPropsWithRef<'tr'> & {
  selected?: boolean;
};
/** Remaining props (`onClick`, `data-*`, `aria-*`, `headers`, …) are forwarded to the `<td>`/`<th>`. */
export type TableCellProps = Omit<ComponentPropsWithRef<'td'>, 'align'> & {
  align?: TableColumnAlign;
  rowHeader?: boolean;
};
export type TableCaptionProps = ComponentPropsWithRef<'caption'>;

type TableStyleSlots = ReturnType<typeof tableStyles>;

type TableContextValue = { styles: TableStyleSlots };

const TableContext = createContext<TableContextValue | null>(null);

function useTableContext(): TableContextValue {
  const context = useContext(TableContext);
  if (context == null) {
    throw new Error('Table parts must be used within Table');
  }
  return context;
}

function defaultRenderCell<T extends Record<string, unknown>>(
  column: TableColumnDef<T>,
  row: T,
): ReactNode {
  return row[column.key] as ReactNode;
}

function resolveSortDirection<T extends Record<string, unknown>>(
  column: TableColumnDef<T>,
  sortDescriptor: SortDescriptor | undefined,
): SortDirection | 'none' {
  if (sortDescriptor == null || sortDescriptor.column !== column.key) return 'none';
  return sortDescriptor.direction;
}

function nextSortDirection(current: SortDirection | 'none'): SortDirection {
  return current === 'ascending' ? 'descending' : 'ascending';
}

function sortIconName(direction: SortDirection | 'none'): 'arrowUp' | 'arrowDown' | 'arrowsUpDown' {
  if (direction === 'ascending') return 'arrowUp';
  if (direction === 'descending') return 'arrowDown';
  return 'arrowsUpDown';
}

/** Header cell within a `Table` — sort chrome is wired by the caller from `useTableSort`. */
export function TableColumn({
  children,
  rowHeader = false,
  align,
  width,
  allowsSorting = false,
  sortDirection = 'none',
  onSort,
  resizeHandle,
  className,
  style: styleProp,
  ref,
  ...rest
}: TableColumnProps): JSX.Element {
  const { styles: s } = useTableContext();
  const style: CSSProperties | undefined = width != null ? { ...styleProp, width } : styleProp;
  const label = allowsSorting ? (
    <button type="button" {...mergeProps(s.sortButton)} onClick={onSort}>
      {children}
      <Icon name={sortIconName(sortDirection)} size="sm" />
    </button>
  ) : (
    children
  );

  return (
    <th
      scope="col"
      {...rest}
      ref={ref}
      {...mergeProps(s.headerCell, className)}
      data-align={align !== 'start' ? align : undefined}
      data-row-header={rowHeader ? '' : undefined}
      aria-sort={allowsSorting ? sortDirection : undefined}
      style={style}
    >
      {label}
      {resizeHandle != null ? <span {...mergeProps(s.resizeHandle)}>{resizeHandle}</span> : null}
    </th>
  );
}

/** Body/header cell within a `Table` row. */
export function TableCell({
  children,
  align,
  rowHeader = false,
  colSpan,
  className,
  ref,
  ...rest
}: TableCellProps): JSX.Element {
  const { styles: s } = useTableContext();
  const Tag = rowHeader ? 'th' : 'td';
  return (
    <Tag
      {...rest}
      ref={ref}
      {...(rowHeader ? { scope: 'row' } : {})}
      colSpan={colSpan}
      {...mergeProps(s.cell, className)}
      data-align={align !== 'start' ? align : undefined}
    >
      {children}
    </Tag>
  );
}

/** Row within a `Table` — pass `selected` when composing row selection. */
export function TableRow({
  children,
  selected,
  className,
  ref,
  ...rest
}: TableRowProps): JSX.Element {
  const { styles: s } = useTableContext();
  return (
    <tr
      {...rest}
      ref={ref}
      {...mergeProps(s.row, className)}
      aria-selected={selected ?? rest['aria-selected']}
      data-selected={selected ? '' : undefined}
    >
      {children}
    </tr>
  );
}

/** `<thead>` within a `Table`. */
export function TableHeader({ className, ref, ...rest }: TableHeaderProps): JSX.Element {
  const { styles: s } = useTableContext();
  return <thead {...rest} {...mergeProps(s.header, className)} ref={ref} />;
}

/** `<tbody>` within a `Table`. */
export function TableBody({ className, ref, ...rest }: TableBodyProps): JSX.Element {
  const { styles: s } = useTableContext();
  return <tbody {...rest} {...mergeProps(s.body, className)} ref={ref} />;
}

/** `<tfoot>` within a `Table`. */
export function TableFooter({ className, ref, ...rest }: TableFooterProps): JSX.Element {
  const { styles: s } = useTableContext();
  return <tfoot {...rest} {...mergeProps(s.footer, className)} ref={ref} />;
}

/** `<caption>` within a `Table`. */
export function TableCaption({ className, ref, ...rest }: TableCaptionProps): JSX.Element {
  const { styles: s } = useTableContext();
  return <caption {...rest} {...mergeProps(s.caption, className)} ref={ref} />;
}

/**
 * Presentational semantic `<table>` for admin data grids. Supports compound
 * `Table.Header`/`Table.Body`/`Table.Row`/`Table.Column`/`Table.Cell` children
 * or a data-driven `columns` + `data` array. Sort, selection, and pagination are
 * caller-composed via `useTableSort` / `useTableSelection` / `useTablePagination`
 * — this component carries no interactive state of its own.
 *
 * ```tsx
 * <Table
 *   columns={[{ key: 'name', header: 'Name', rowHeader: true }]}
 *   data={rows}
 *   getRowId={(r) => r.id}
 *   emptyContent={<EmptyState title="No rows" />}
 * />
 * ```
 */
export function Table<T extends Record<string, unknown> = Record<string, unknown>>({
  density = 'balanced',
  dividers = 'rows',
  striped = false,
  hasHover = false,
  stickyHeader = false,
  textOverflow = 'wrap',
  layout = 'auto',
  columnOrder,
  columnWidths,
  columns,
  data,
  getRowId,
  renderCell = defaultRenderCell,
  emptyContent,
  sortDescriptor,
  onSortChange,
  children,
  className,
  style,
  caption,
  ref,
  ...rest
}: TableProps<T>): JSX.Element {
  const s = tableStyles({
    density,
    dividers,
    striped: striped ? true : false,
    hasHover: hasHover ? true : false,
    stickyHeader: stickyHeader ? true : false,
    textOverflow,
    layout,
  });
  const rows = data ?? [];

  const colgroup =
    layout === 'fixed' && columnOrder != null && columnWidths != null ? (
      <colgroup>
        {columnOrder.map((key) => (
          <col key={key} style={{ width: columnWidths[key] }} />
        ))}
      </colgroup>
    ) : null;

  function renderDataMode(dataColumns: TableColumnDef<T>[]): ReactNode {
    return (
      <>
        <TableHeader>
          <TableRow>
            {dataColumns.map((column) => {
              const direction = column.allowsSorting
                ? resolveSortDirection(column, sortDescriptor)
                : 'none';
              return (
                <TableColumn
                  key={column.key}
                  rowHeader={column.rowHeader}
                  align={column.align}
                  width={column.width}
                  allowsSorting={column.allowsSorting}
                  sortDirection={direction}
                  onSort={
                    column.allowsSorting
                      ? () =>
                          onSortChange?.({
                            column: column.key,
                            direction: nextSortDirection(direction),
                          })
                      : undefined
                  }
                >
                  {column.header ?? column.key}
                </TableColumn>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <tr>
              <td {...mergeProps(s.empty)} colSpan={dataColumns.length}>
                {emptyContent}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <TableRow key={getRowId ? getRowId(row) : index}>
                {dataColumns.map((column) => (
                  <TableCell key={column.key} align={column.align} rowHeader={column.rowHeader}>
                    {renderCell(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </>
    );
  }

  const content = children != null ? children : columns != null ? renderDataMode(columns) : null;

  return (
    <TableContext.Provider value={{ styles: s }}>
      <div {...mergeProps(s.root, className)} style={style} ref={ref}>
        <table {...rest} {...mergeProps(s.table)}>
          {caption != null ? <TableCaption>{caption}</TableCaption> : null}
          {colgroup}
          {content}
        </table>
      </div>
    </TableContext.Provider>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Column = TableColumn;
Table.Cell = TableCell;
Table.Caption = TableCaption;
