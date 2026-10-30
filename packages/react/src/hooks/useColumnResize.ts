import { useCallback, useMemo, useState } from 'react';
import type { ResizeHandleProps } from '../components/ResizeHandle';

export type ColumnWidths = Record<string, number>;

export type UseColumnResizeOptions = {
  /** Column keys in display order. */
  columns: string[];
  /** Initial widths as CSS lengths (`200px`, `30%`). Unspecified columns share remaining space. */
  defaultWidths?: Record<string, string>;
  /** Minimum width in px when dragging. @default 80 */
  minWidth?: number;
  /** Persist pixel widths to localStorage. */
  autoSaveId?: string;
  /** Controlled pixel widths. */
  widths?: ColumnWidths;
  onWidthsChange?: (widths: ColumnWidths) => void;
};

export type UseColumnResizeResult = {
  columnWidths: ColumnWidths;
  getColumnProps: (key: string) => { width: string };
  getResizeHandleProps: (key: string) => ResizeHandleProps;
};

const STORAGE_KEY_PREFIX = 'var-ui-column-resize:';
const DEFAULT_TABLE_WIDTH = 960;

function storageKey(autoSaveId: string): string {
  return `${STORAGE_KEY_PREFIX}${autoSaveId}`;
}

function readStoredWidths(autoSaveId: string | undefined): ColumnWidths | undefined {
  if (autoSaveId == null || typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(storageKey(autoSaveId));
    if (raw == null) return undefined;
    const parsed = JSON.parse(raw) as ColumnWidths;
    return parsed && typeof parsed === 'object' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredWidths(autoSaveId: string | undefined, widths: ColumnWidths): void {
  if (autoSaveId == null || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(autoSaveId), JSON.stringify(widths));
  } catch {
    // Storage disabled/full — width still tracked in memory for this session.
  }
}

function parseDefaultWidth(value: string | undefined, fallback: number): number {
  if (value == null) return fallback;
  if (value.endsWith('px')) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (value.endsWith('%')) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? (DEFAULT_TABLE_WIDTH * parsed) / 100 : fallback;
  }
  return fallback;
}

function buildDefaultWidths(
  columns: readonly string[],
  defaultWidths: Record<string, string>,
  minWidth: number,
): ColumnWidths {
  const specified = columns.reduce((sum, key) => sum + parseDefaultWidth(defaultWidths[key], 0), 0);
  const unspecified = columns.filter((key) => defaultWidths[key] == null);
  const remaining = Math.max(DEFAULT_TABLE_WIDTH - specified, minWidth * unspecified.length);
  const equal = unspecified.length > 0 ? remaining / unspecified.length : minWidth;

  return Object.fromEntries(
    columns.map((key) => [key, parseDefaultWidth(defaultWidths[key], equal)]),
  );
}

/**
 * Headless column width state for fixed-layout tables. Returns pixel widths,
 * `ResizeHandle` props per column boundary, and optional localStorage persistence.
 */
export function useColumnResize(options: UseColumnResizeOptions): UseColumnResizeResult {
  const {
    columns,
    defaultWidths = {},
    minWidth = 80,
    autoSaveId,
    widths,
    onWidthsChange,
  } = options;
  const isControlled = widths !== undefined;

  const initialWidths = useMemo(() => {
    const stored = readStoredWidths(autoSaveId);
    if (stored != null) {
      return Object.fromEntries(
        columns.map((key) => [key, stored[key] ?? minWidth]),
      ) satisfies ColumnWidths;
    }
    return buildDefaultWidths(columns, defaultWidths, minWidth);
  }, [autoSaveId, columns, defaultWidths, minWidth]);

  const [internalWidths, setInternalWidths] = useState<ColumnWidths>(initialWidths);
  const resolvedWidths = isControlled ? widths : internalWidths;

  const setWidths = useCallback(
    (next: ColumnWidths) => {
      if (!isControlled) setInternalWidths(next);
      writeStoredWidths(autoSaveId, next);
      onWidthsChange?.(next);
    },
    [autoSaveId, isControlled, onWidthsChange],
  );

  const getColumnProps = useCallback(
    (key: string) => ({
      width: `${resolvedWidths[key] ?? minWidth}px`,
    }),
    [minWidth, resolvedWidths],
  );

  const getResizeHandleProps = useCallback(
    (key: string): ResizeHandleProps => {
      const index = columns.indexOf(key);
      const nextKey = index >= 0 ? columns[index + 1] : undefined;
      const current = resolvedWidths[key] ?? minWidth;
      const nextWidth = nextKey != null ? (resolvedWidths[nextKey] ?? minWidth) : minWidth;

      return {
        direction: 'horizontal',
        value: current,
        minValue: minWidth,
        maxValue: nextKey != null ? current + nextWidth - minWidth : current + minWidth,
        onValueChange: (next: number) => {
          if (nextKey == null) {
            setWidths({ ...resolvedWidths, [key]: Math.max(next, minWidth) });
            return;
          }
          const delta = next - current;
          const adjustedNext = nextWidth - delta;
          if (next < minWidth || adjustedNext < minWidth) return;
          setWidths({
            ...resolvedWidths,
            [key]: next,
            [nextKey]: adjustedNext,
          });
        },
        'aria-label': `Resize ${key} column`,
      };
    },
    [columns, minWidth, resolvedWidths, setWidths],
  );

  return {
    columnWidths: resolvedWidths,
    getColumnProps,
    getResizeHandleProps,
  };
}
