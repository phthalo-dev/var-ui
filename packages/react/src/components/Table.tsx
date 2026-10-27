import type { ComponentPropsWithoutRef, CSSProperties, JSX, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { table as tableStyles, designTokens as t, type TableVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import type { SortDescriptor, SortDirection } from '../hooks/useTableSort';

export type TableColumnAlign = 'start' | 'center' | 'end';

export type TableColumnDef<T extends Record<string, unknown> = Record<string, unknown>> = {
  key: Extract<keyof T, string>;
  header?: ReactNode;
  align?: TableColumnAlign;
  isRowHeader?: boolean;
  width?: string;
  allowsSorting?: boolean;
};

export type TableProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  density?: NonNullable<TableVariantProps['density']>;
  dividers?: NonNullable<TableVariantProps['dividers']>;
  isStriped?: NonNullable<TableVariantProps['isStriped']>;
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
  className?: string;
  caption?: ReactNode;
};

export type TableColumnProps = {
  children?: ReactNode;
  isRowHeader?: boolean;
  align?: TableColumnAlign;
  width?: string;
  allowsSorting?: boolean;
  sortDirection?: SortDirection | 'none';
  onSort?: () => void;
  resizeHandle?: ReactNode;
  className?: string;
};

export type TableHeaderProps = { children?: ReactNode; className?: string };
export type TableBodyProps = { children?: ReactNode; className?: string };
export type TableFooterProps = { children?: ReactNode; className?: string };
/** Remaining props (`onClick`, `onDoubleClick`, `data-*`, `aria-*`, `id`, …) are forwarded to the `<tr>`. */
export type TableRowProps = Omit<ComponentPropsWithoutRef<'tr'>, 'children' | 'className'> & {
  children?: ReactNode;
  isSelected?: boolean;
  className?: string;
};
/** Remaining props (`onClick`, `data-*`, `aria-*`, `headers`, …) are forwarded to the `<td>`/`<th>`. */
export type TableCellProps = Omit<
  ComponentPropsWithoutRef<'td'>,
  'children' | 'className' | 'align' | 'colSpan'
> & {
  children?: ReactNode;
  align?: TableColumnAlign;
  isRowHeader?: boolean;
  colSpan?: number;
  className?: string;
};
export type TableCaptionProps = { children?: ReactNode; className?: string };

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

const sortButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: String(t.space[1]),
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
};

function sortIconName(direction: SortDirection | 'none'): 'arrowUp' | 'arrowDown' | 'arrowsUpDown' {
  if (direction === 'ascending') return 'arrowUp';
  if (direction === 'descending') return 'arrowDown';
  return 'arrowsUpDown';
}

/** Header cell within a `Table` — sort chrome is wired by the caller from `useTableSort`. */
export function TableColumn({
  children,
  isRowHeader = false,
  align,
  width,
  allowsSorting = false,
  sortDirection = 'none',
  onSort,
  resizeHandle,
  className,
}: TableColumnProps): JSX.Element {
  const { styles: s } = useTableContext();
  const style: CSSProperties | undefined = width != null ? { width } : undefined;
  const label = allowsSorting ? (
    <button type="button" style={sortButtonStyle} onClick={onSort}>
      {children}
      <Icon name={sortIconName(sortDirection)} size="sm" />
    </button>
  ) : (
    children
  );

  return (
    <th
      scope="col"
      {...mergeProps(s.headerCell, className)}
      data-align={align !== 'start' ? align : undefined}
      data-row-header={isRowHeader ? '' : undefined}
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
  isRowHeader = false,
  colSpan,
  className,
  ...rest
}: TableCellProps): JSX.Element {
  const { styles: s } = useTableContext();
  const Tag = isRowHeader ? 'th' : 'td';
  return (
    <Tag
      {...rest}
      {...(isRowHeader ? { scope: 'row' } : {})}
      colSpan={colSpan}
      {...mergeProps(s.cell, className)}
      data-align={align !== 'start' ? align : undefined}
    >
      {children}
    </Tag>
  );
}

/** Row within a `Table` — pass `isSelected` when composing row selection. */
export function TableRow({ children, isSelected, className, ...rest }: TableRowProps): JSX.Element {
  const { styles: s } = useTableContext();
  return (
    <tr
      {...rest}
      {...mergeProps(s.row, className)}
      aria-selected={isSelected ?? rest['aria-selected']}
      data-selected={isSelected ? '' : undefined}
    >
      {children}
    </tr>
  );
}

/** `<thead>` within a `Table`. */
export function TableHeader({ children, className }: TableHeaderProps): JSX.Element {
  const { styles: s } = useTableContext();
  return <thead {...mergeProps(s.header, className)}>{children}</thead>;
}

/** `<tbody>` within a `Table`. */
export function TableBody({ children, className }: TableBodyProps): JSX.Element {
  const { styles: s } = useTableContext();
  return <tbody {...mergeProps(s.body, className)}>{children}</tbody>;
}

/** `<tfoot>` within a `Table`. */
export function TableFooter({ children, className }: TableFooterProps): JSX.Element {
  const { styles: s } = useTableContext();
  return <tfoot {...mergeProps(s.footer, className)}>{children}</tfoot>;
}

/** `<caption>` within a `Table`. */
export function TableCaption({ children, className }: TableCaptionProps): JSX.Element {
  const { styles: s } = useTableContext();
  return <caption {...mergeProps(s.caption, className)}>{children}</caption>;
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
 *   columns={[{ key: 'name', header: 'Name', isRowHeader: true }]}
 *   data={rows}
 *   getRowId={(r) => r.id}
 *   emptyContent={<EmptyState title="No rows" />}
 * />
 * ```
 */
export function Table<T extends Record<string, unknown> = Record<string, unknown>>({
  density = 'balanced',
  dividers = 'rows',
  isStriped = false,
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
  caption,
}: TableProps<T>): JSX.Element {
  const s = tableStyles({
    density,
    dividers,
    isStriped: isStriped ? true : false,
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
                  isRowHeader={column.isRowHeader}
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
                  <TableCell key={column.key} align={column.align} isRowHeader={column.isRowHeader}>
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
      <div {...mergeProps(s.root, className)}>
        <table {...mergeProps(s.table)}>
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
