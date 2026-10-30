import { useCallback, useMemo, useState } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/** Shared shape SideNav (and later Phase 6 `Layout*`) consume for single-region resize. */
export type ResizableConfig = {
  /** @default 260 */
  defaultWidth?: number;
  /** @default 180 */
  minWidth?: number;
  /** @default 480 */
  maxWidth?: number;
  /** Persists width to `localStorage` under `var-ui-resizable:${autoSaveId}`. */
  autoSaveId?: string;
  onWidthChange?: (width: number) => void;
  /** Enables the drag-below-threshold collapse behavior. @default false */
  collapsible?: boolean;
  /** Drag threshold below which resizing collapses the region. @default 160 */
  collapsedSize?: number;
};

export type MultiResizableConfig = {
  regions: Record<string, ResizableConfig>;
  autoSaveId?: string;
};

export type UseResizableResult = {
  width: number;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  collapse: () => void;
  expand: () => void;
  resize: (width: number) => void;
  /** Bind to `ResizeHandle`. */
  handleProps: {
    direction: 'horizontal';
    value: number;
    minValue: number;
    maxValue: number;
    onValueChange: (next: number) => void;
    onCollapse?: () => void;
    collapsed: boolean;
    'aria-label'?: string;
  };
};

const STORAGE_KEY_PREFIX = 'var-ui-resizable:';
const DEFAULT_WIDTH = 260;
const DEFAULT_MIN_WIDTH = 180;
const DEFAULT_MAX_WIDTH = 480;
const DEFAULT_COLLAPSED_SIZE = 160;

function normalizeConfig(config: boolean | ResizableConfig | undefined): ResizableConfig {
  return config && config !== true ? config : {};
}

function storageKey(autoSaveId: string): string {
  return `${STORAGE_KEY_PREFIX}${autoSaveId}`;
}

function readStoredWidth(autoSaveId: string | undefined): number | undefined {
  if (!autoSaveId || typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(storageKey(autoSaveId));
    if (raw === null) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredWidth(autoSaveId: string | undefined, width: number): void {
  if (!autoSaveId || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(autoSaveId), String(width));
  } catch {
    // Storage disabled/full — width still tracked in memory for this session.
  }
}

function useResizableRegion(
  config: ResizableConfig,
  autoSaveIdOverride?: string,
): UseResizableResult {
  const {
    defaultWidth = DEFAULT_WIDTH,
    minWidth = DEFAULT_MIN_WIDTH,
    maxWidth = DEFAULT_MAX_WIDTH,
    autoSaveId: configAutoSaveId,
    onWidthChange,
    collapsible = false,
    collapsedSize = DEFAULT_COLLAPSED_SIZE,
  } = config;
  const autoSaveId = autoSaveIdOverride ?? configAutoSaveId;

  // Always starts at `defaultWidth` so the first client render matches the server render; the
  // persisted width is applied in a layout effect (client-only, before paint) to avoid a
  // hydration mismatch.
  const [width, setWidth] = useState<number>(defaultWidth);

  useIsomorphicLayoutEffect(() => {
    const stored = readStoredWidth(autoSaveId);
    if (stored !== undefined) setWidth(Math.min(Math.max(stored, minWidth), maxWidth));
    // Runs on mount and when the storage key changes; bounds are intentionally excluded so a
    // config change doesn't clobber a width the user has since dragged to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveId]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const resize = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, minWidth), maxWidth);
      setWidth(clamped);
      writeStoredWidth(autoSaveId, clamped);
      onWidthChange?.(clamped);
      if (collapsible) {
        setIsCollapsed(next < collapsedSize);
      }
    },
    [autoSaveId, collapsedSize, collapsible, maxWidth, minWidth, onWidthChange],
  );

  const collapse = useCallback(() => setIsCollapsed(true), []);
  const expand = useCallback(() => setIsCollapsed(false), []);
  const setCollapsed = useCallback((next: boolean) => setIsCollapsed(next), []);

  const handleProps = useMemo(
    () => ({
      direction: 'horizontal' as const,
      value: width,
      minValue: minWidth,
      maxValue: maxWidth,
      onValueChange: resize,
      onCollapse: collapsible ? collapse : undefined,
      collapsed: isCollapsed,
    }),
    [collapse, collapsible, isCollapsed, maxWidth, minWidth, resize, width],
  );

  return { width, isCollapsed, setCollapsed, collapse, expand, resize, handleProps };
}

/**
 * Single- or multi-region resize state: clamped width, drag-to-collapse,
 * keyboard/pointer handle bindings, and optional `localStorage` persistence.
 *
 * SSR-safe: the first render always uses `defaultWidth`; a persisted width (`autoSaveId`) is
 * applied in a layout effect after mount, so storage access never affects hydration.
 *
 * Multi-region callers must pass a stable `regions` key set across renders
 * (same contract as Astryx split layouts). Internally one hook is called per region key, so
 * adding or removing keys between renders violates the Rules of Hooks and will break React
 * state. Reordering is fine only if the key order itself stays the same.
 */
export function useResizable(config?: boolean | ResizableConfig): UseResizableResult;
export function useResizable(config: MultiResizableConfig): Record<string, UseResizableResult>;
export function useResizable(
  config?: boolean | ResizableConfig | MultiResizableConfig,
): UseResizableResult | Record<string, UseResizableResult> {
  if (config && typeof config === 'object' && 'regions' in config) {
    const { regions, autoSaveId } = config;
    const entries = Object.entries(regions);
    const results = entries.map(([key, regionConfig]) =>
      useResizableRegion(regionConfig, autoSaveId ? `${autoSaveId}:${key}` : undefined),
    );
    return Object.fromEntries(entries.map(([key], i) => [key, results[i]!]));
  }
  const normalized = normalizeConfig(config as boolean | ResizableConfig | undefined);
  return useResizableRegion(normalized);
}
