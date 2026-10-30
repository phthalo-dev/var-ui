'use client';

import {
  ResizeHandle,
  SearchInput,
  Table,
  Text,
  Toolbar,
  useColumnResize,
  useTableFilter,
  useTableSort,
  type SortDescriptor,
} from '@var-ui/react';
import { useMemo, type CSSProperties, type JSX } from 'react';
import type { TokenReferenceRow } from '@/lib/theme-css-variables';

const COLUMN_KEYS = [
  'namespace',
  'kind',
  'tokenPath',
  'cssVar',
  'defaultValue',
  'preview',
] as const;

const DEFAULT_WIDTHS: Record<string, string> = {
  namespace: '120px',
  kind: '96px',
  tokenPath: '280px',
  cssVar: '280px',
  defaultValue: '200px',
  preview: '120px',
};

const SEARCH_KEYS = ['namespace', 'kind', 'tokenPath', 'cssVar', 'defaultValue'] as const;

const monoStyle: CSSProperties = {
  fontFamily: 'var(--var-ui-fontFamily-mono)',
  fontSize: 'var(--var-ui-fontSize-sm)',
};

const previewSwatchStyle: CSSProperties = {
  display: 'inline-block',
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: 'var(--var-ui-radius-sm)',
  border: '1px solid var(--var-ui-color-border-default)',
  verticalAlign: 'middle',
};

const previewBarStyle: CSSProperties = {
  display: 'inline-block',
  height: '0.5rem',
  maxWidth: '100%',
  borderRadius: 'var(--var-ui-radius-sm)',
  backgroundColor: 'var(--var-ui-color-tone-accent-foreground)',
  verticalAlign: 'middle',
};

function TokenPreview({ row }: { row: TokenReferenceRow }): JSX.Element {
  const cssValue = `var(${row.cssVar})`;

  if (row.tokenPath.startsWith('color.') || row.namespace.toLowerCase().includes('color')) {
    return (
      <span
        aria-hidden="true"
        style={{
          ...previewSwatchStyle,
          background: row.defaultValue ?? cssValue,
        }}
      />
    );
  }

  if (row.tokenPath.startsWith('space.') || row.namespace === 'Space') {
    return <span aria-hidden="true" style={{ ...previewBarStyle, width: cssValue }} />;
  }

  if (row.tokenPath.startsWith('fontSize.') || row.namespace === 'Font size') {
    return <span style={{ fontSize: cssValue }}>Aa</span>;
  }

  if (row.tokenPath.startsWith('fontFamily.') || row.namespace === 'Font family') {
    return <span style={{ fontFamily: cssValue }}>Ag</span>;
  }

  if (row.tokenPath.startsWith('radius.')) {
    return (
      <span
        aria-hidden="true"
        style={{
          ...previewSwatchStyle,
          width: '1.5rem',
          background: 'var(--var-ui-color-background-muted)',
          borderRadius: cssValue,
        }}
      />
    );
  }

  return <span aria-hidden="true">—</span>;
}

function columnSort(
  column: string,
  sortDescriptor: SortDescriptor | undefined,
  onSortChange: (next: SortDescriptor) => void,
) {
  const direction =
    sortDescriptor?.column === column ? sortDescriptor.direction : ('none' as const);
  return {
    allowsSorting: true as const,
    sortDirection: direction,
    onSort: () =>
      onSortChange({
        column,
        direction:
          sortDescriptor?.column === column && sortDescriptor.direction === 'ascending'
            ? 'descending'
            : 'ascending',
      }),
  };
}

export type TokenReferenceTableProps = {
  rows: TokenReferenceRow[];
};

export default function TokenReferenceTable({ rows }: TokenReferenceTableProps): JSX.Element {
  const { query, onQueryChange, filteredData } = useTableFilter({
    data: rows,
    searchKeys: [...SEARCH_KEYS],
  });
  const { sortedData, sortDescriptor, onSortChange } = useTableSort({
    data: filteredData,
    defaultSort: { column: 'tokenPath', direction: 'ascending' },
  });
  const resize = useColumnResize({
    columns: [...COLUMN_KEYS],
    defaultWidths: DEFAULT_WIDTHS,
    autoSaveId: 'docs-token-table',
    minWidth: 72,
  });

  const columnWidths = useMemo(
    () => Object.fromEntries(COLUMN_KEYS.map((key) => [key, resize.getColumnProps(key).width])),
    [resize.columnWidths],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--var-ui-space-4)' }}>
      <Toolbar
        label="Token reference filters"
        startContent={
          <SearchInput
            value={query}
            onValueChange={onQueryChange}
            placeholder="Search tokens…"
            aria-label="Search design tokens"
            size="sm"
          />
        }
        endContent={
          <Text size="sm" tone="secondary">
            {sortedData.length} of {rows.length} tokens
          </Text>
        }
      />

      <Table
        density="compact"
        dividers="rows"
        hasHover
        stickyHeader
        layout="fixed"
        columnOrder={[...COLUMN_KEYS]}
        columnWidths={columnWidths}
      >
        <Table.Header>
          <Table.Row>
            <Table.Column
              {...columnSort('namespace', sortDescriptor, onSortChange)}
              {...resize.getColumnProps('namespace')}
              resizeHandle={<ResizeHandle {...resize.getResizeHandleProps('namespace')} />}
            >
              Namespace
            </Table.Column>
            <Table.Column
              {...columnSort('kind', sortDescriptor, onSortChange)}
              {...resize.getColumnProps('kind')}
              resizeHandle={<ResizeHandle {...resize.getResizeHandleProps('kind')} />}
            >
              Kind
            </Table.Column>
            <Table.Column
              rowHeader
              {...columnSort('tokenPath', sortDescriptor, onSortChange)}
              {...resize.getColumnProps('tokenPath')}
              resizeHandle={<ResizeHandle {...resize.getResizeHandleProps('tokenPath')} />}
            >
              Token
            </Table.Column>
            <Table.Column
              {...columnSort('cssVar', sortDescriptor, onSortChange)}
              {...resize.getColumnProps('cssVar')}
              resizeHandle={<ResizeHandle {...resize.getResizeHandleProps('cssVar')} />}
            >
              CSS variable
            </Table.Column>
            <Table.Column
              {...columnSort('defaultValue', sortDescriptor, onSortChange)}
              {...resize.getColumnProps('defaultValue')}
              resizeHandle={<ResizeHandle {...resize.getResizeHandleProps('defaultValue')} />}
            >
              Default
            </Table.Column>
            <Table.Column {...resize.getColumnProps('preview')}>Preview</Table.Column>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedData.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={COLUMN_KEYS.length}>
                <Text size="sm" tone="secondary">
                  No tokens match your search.
                </Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            sortedData.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.namespace}</Table.Cell>
                <Table.Cell>{row.kind}</Table.Cell>
                <Table.Cell rowHeader>
                  <span style={monoStyle}>{row.tokenPath}</span>
                </Table.Cell>
                <Table.Cell>
                  <span style={monoStyle}>{row.cssVar}</span>
                </Table.Cell>
                <Table.Cell>
                  <span style={monoStyle}>{row.defaultValue ?? '—'}</span>
                </Table.Cell>
                <Table.Cell>
                  <TokenPreview row={row} />
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
