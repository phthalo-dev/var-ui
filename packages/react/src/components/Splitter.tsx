import {
  Children,
  createContext,
  isValidElement,
  use,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type JSX,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { splitter } from '@var-ui/core/components/splitter';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { mergeProps } from 'typestyles';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { ResizeHandle, type ResizeHandleProps } from './ResizeHandle';

const STORAGE_KEY_PREFIX = 'var-ui-resizable:';
const splitterVars = recipeVars(splitter);

type PanelContextValue = { id: string; size: number; collapsed: boolean };
const PanelContext = createContext<PanelContextValue | null>(null);

export type SplitterPanelProps = ComponentPropsWithRef<'div'> & {
  /** Smallest size, as a percentage of the panel space. Overrides `Splitter`'s `minSizes[i]`. @default 0 */
  minSize?: number;
  /** Largest size, as a percentage. Overrides `Splitter`'s `maxSizes[i]`. @default 100 */
  maxSize?: number;
  /**
   * The panel can be collapsed to zero: by `Enter` on its divider, or by dragging or arrowing
   * below `minSize`. Overrides `Splitter`'s `collapsible`. @default false
   */
  collapsible?: boolean;
};

/**
 * One resizable region. Must be a direct child of `Splitter` (it is read for its size limits, and
 * the dividers are rendered between consecutive panels). It clips or scrolls its content.
 */
export function SplitterPanel({
  minSize: _minSize,
  maxSize: _maxSize,
  collapsible: _collapsible,
  className,
  style,
  id,
  ref,
  ...rest
}: SplitterPanelProps): JSX.Element {
  const ctx = use(PanelContext);
  const s = splitter();
  return (
    <div
      {...rest}
      {...mergeProps(s.panel, className)}
      ref={ref}
      id={ctx?.id ?? id}
      data-splitter-panel=""
      data-collapsed={ctx?.collapsed ? '' : undefined}
      style={{ ...(ctx ? styleVars([[splitterVars.size, ctx.size]]) : undefined), ...style }}
    />
  );
}

export type SplitterHandleProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'onChange' | 'role' | 'tabIndex'
>;

/**
 * Optional: place between two `Splitter.Panel`s to customise that divider (`className`, `style`,
 * `aria-label`, `id`, `ref`, handlers). Dividers are rendered automatically without it. This
 * element renders nothing itself; `Splitter` reads its props and applies them to the real
 * `role="separator"` element.
 */
export function SplitterHandle(_props: SplitterHandleProps): null {
  return null;
}

export type SplitterProps = Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> & {
  /**
   * Layout direction. `horizontal` puts panels side by side (vertical dividers); `vertical`
   * stacks them. @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Panel sizes (controlled), one per `Splitter.Panel`, as percentages of the combined panel space
   * (the container minus the dividers; platform-free, never pixels). Sums to 100.
   */
  sizes?: number[];
  /** Initial sizes (uncontrolled). @default an equal split */
  defaultSizes?: number[];
  /** Fires with the next sizes while dragging or using the keyboard. */
  onSizesChange?: (sizes: number[]) => void;
  /** Smallest size per panel, in percent. A `Splitter.Panel`'s `minSize` wins. */
  minSizes?: number[];
  /** Largest size per panel, in percent. A `Splitter.Panel`'s `maxSize` wins. */
  maxSizes?: number[];
  /** Panels that may collapse to zero: `true` for all, or one flag per panel. @default false */
  collapsible?: boolean | boolean[];
  /**
   * Persist sizes in `localStorage` (`var-ui-resizable:<id>`). The first render always uses
   * `defaultSizes`; stored sizes are applied right after mount.
   */
  autoSaveId?: string;
  /** Arrow-key step, in percent. @default 5 */
  step?: number;
  /** Arrow-key step with Shift held, in percent. @default 20 */
  largeStep?: number;
  /** Accessible name of the dividers, unless a `Splitter.Handle` sets `aria-label`. @default 'Resize panels' */
  handleLabel?: string;
  /** Two or more `Splitter.Panel`s, optionally with `Splitter.Handle`s between them. */
  children?: ReactNode;
};

const round = (n: number): number => Math.round(n * 100) / 100;

function equalSizes(n: number): number[] {
  return Array.from({ length: n }, () => round(100 / n));
}

function normalize(input: readonly number[] | undefined, n: number): number[] {
  if (!input || input.length !== n || input.some((v) => !Number.isFinite(v) || v < 0)) {
    return equalSizes(n);
  }
  const sum = input.reduce((a, b) => a + b, 0);
  if (sum <= 0) return equalSizes(n);
  return Math.abs(sum - 100) < 0.01 ? [...input] : input.map((v) => round((v / sum) * 100));
}

function readStored(autoSaveId: string | undefined, n: number): number[] | undefined {
  if (!autoSaveId || typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + autoSaveId);
    if (raw === null) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== n) return undefined;
    if (!parsed.every((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0)) {
      return undefined;
    }
    return normalize(parsed as number[], n);
  } catch {
    return undefined;
  }
}

function writeStored(autoSaveId: string | undefined, sizes: number[]): void {
  if (!autoSaveId || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + autoSaveId, JSON.stringify(sizes));
  } catch {
    // Storage disabled or full: sizes still live in memory for this session.
  }
}

type PanelConfig = { min: number; max: number; collapsible: boolean };

/**
 * Resizable split panels (the APG window splitter pattern), built on `ResizeHandle` for the
 * divider: pointer drag with capture, arrow keys (Shift for a larger step), `Home`/`End`, and
 * `Enter` to collapse. Sizes are percentages of the combined panel space.
 *
 * ```tsx
 * <Splitter defaultSizes={[30, 70]} style={{ height: 320 }}>
 *   <Splitter.Panel minSize={15}>Sidebar</Splitter.Panel>
 *   <Splitter.Panel>Content</Splitter.Panel>
 * </Splitter>
 * ```
 *
 * `onChange` stays the native `change` event bubbling from form controls inside the panels; use
 * `onSizesChange` for sizes.
 */
function SplitterRoot({
  orientation = 'horizontal',
  sizes: sizesProp,
  defaultSizes,
  onSizesChange,
  minSizes,
  maxSizes,
  collapsible = false,
  autoSaveId,
  step = 5,
  largeStep = 20,
  handleLabel = 'Resize panels',
  className,
  children,
  ref,
  ...rest
}: SplitterProps): JSX.Element {
  const s = splitter({ orientation });
  const baseId = useId();
  const rootEl = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const lastExpanded = useRef<Record<number, number>>({});
  const horizontal = orientation === 'horizontal';

  const panels: ReactElement<SplitterPanelProps>[] = [];
  const handles: Array<ReactElement<SplitterHandleProps> | undefined> = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === SplitterPanel) panels.push(child as ReactElement<SplitterPanelProps>);
    else if (child.type === SplitterHandle && panels.length > 0) {
      handles[panels.length - 1] = child as ReactElement<SplitterHandleProps>;
    }
  });
  const count = panels.length;

  const controlled = sizesProp !== undefined;
  const [initialSizes] = useState(() => normalize(defaultSizes, count));
  const [inner, setInner] = useState<number[]>(initialSizes);
  const sizes = normalize(controlled ? sizesProp : inner, count);
  const [rtl, setRtl] = useState(false);

  const config: PanelConfig[] = panels.map((panel, i) => ({
    min: panel.props.minSize ?? minSizes?.[i] ?? 0,
    max: panel.props.maxSize ?? maxSizes?.[i] ?? 100,
    collapsible:
      panel.props.collapsible ?? (Array.isArray(collapsible) ? !!collapsible[i] : collapsible),
  }));

  useIsomorphicLayoutEffect(() => {
    const el = rootEl.current;
    if (el) setRtl(getComputedStyle(el).direction === 'rtl');
  });

  // Persisted sizes are applied after mount so the first render matches the server render.
  useIsomorphicLayoutEffect(() => {
    const stored = readStored(autoSaveId, count);
    if (!stored) return;
    if (controlled) onSizesChange?.(stored);
    else setInner(stored);
    // Only when the storage key (or panel count) changes, not on every callback identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveId, count]);

  const commit = (next: number[]): void => {
    const rounded = next.map(round);
    rounded.forEach((size, i) => {
      if (size === 0 && sizes[i]! > 0) lastExpanded.current[i] = sizes[i]!;
    });
    if (!controlled) setInner(rounded);
    writeStored(autoSaveId, rounded);
    onSizesChange?.(rounded);
  };

  const place = (i: number, nextA: number): void => {
    const pair = sizes[i]! + sizes[i + 1]!;
    const next = [...sizes];
    next[i] = nextA;
    next[i + 1] = pair - nextA;
    commit(next);
  };

  /** Clamp and collapse-snap a requested size for the panel before divider `i`. */
  const resolve = (i: number, requested: number): number => {
    const a = config[i]!;
    const b = config[i + 1]!;
    const current = sizes[i]!;
    const pair = current + sizes[i + 1]!;
    let next = requested;
    const fromDrag = dragging.current;
    if (a.collapsible && a.min > 0 && next < a.min) {
      const collapse = next < current && (fromDrag ? next < a.min / 2 : true);
      next = collapse ? 0 : a.min;
    }
    const nextB = pair - next;
    if (b.collapsible && b.min > 0 && nextB < b.min) {
      const collapse = nextB < sizes[i + 1]! && (fromDrag ? nextB < b.min / 2 : true);
      next = collapse ? pair : pair - b.min;
    }
    if (next === 0 && a.collapsible) return 0;
    if (next === pair && b.collapsible) return pair;
    const lo = Math.max(a.min, pair - b.max, 0);
    const hi = Math.min(a.max, pair - b.min, pair);
    return Math.min(Math.max(next, lo), Math.max(lo, hi));
  };

  const toggleCollapse = (i: number): void => {
    const a = config[i]!;
    const b = config[i + 1]!;
    const target = a.collapsible ? i : b.collapsible ? i + 1 : -1;
    if (target < 0) return;
    const pair = sizes[i]! + sizes[i + 1]!;
    if (sizes[target]! > 0) {
      place(i, target === i ? 0 : pair);
      return;
    }
    const other = config[target === i ? i + 1 : i]!;
    const wanted = lastExpanded.current[target] ?? Math.max(config[target]!.min, pair / 2);
    const restored = Math.min(Math.max(wanted, config[target]!.min), pair - other.min);
    place(i, target === i ? restored : pair - restored);
  };

  const reset = (i: number): void => {
    const pair = sizes[i]! + sizes[i + 1]!;
    const defaults = initialSizes[i]! + initialSizes[i + 1]!;
    if (defaults <= 0) return;
    place(i, resolve(i, (pair * initialSizes[i]!) / defaults));
  };

  const unitsPerPixel = (): number => {
    const el = rootEl.current;
    if (!el) return 1;
    let pixels = 0;
    for (const panel of el.querySelectorAll<HTMLElement>(':scope > [data-splitter-panel]')) {
      const rect = panel.getBoundingClientRect();
      pixels += horizontal ? rect.width : rect.height;
    }
    return pixels > 0 ? sizes.reduce((a, b) => a + b, 0) / pixels : 1;
  };

  const panelId = (i: number): string => panels[i]!.props.id ?? `${baseId}-panel-${i}`;

  const body: ReactNode[] = [];
  panels.forEach((panel, i) => {
    body.push(
      <PanelContext.Provider
        key={panel.key ?? `panel-${i}`}
        value={{ id: panelId(i), size: sizes[i]!, collapsed: sizes[i] === 0 }}
      >
        {panel}
      </PanelContext.Provider>,
    );
    if (i === count - 1) return;

    const a = config[i]!;
    const b = config[i + 1]!;
    const pair = sizes[i]! + sizes[i + 1]!;
    const custom = handles[i]?.props ?? {};
    const {
      className: handleClass,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onDoubleClick,
      ref: handleRef,
      ...handleRest
    } = custom;
    const minValue = Math.max(a.collapsible ? 0 : a.min, pair - b.max, 0);
    const maxValue = Math.min(a.max, b.collapsible ? pair : pair - b.min, pair);
    const handleProps: ResizeHandleProps = {
      'aria-label': handleLabel,
      ...handleRest,
      ref: handleRef,
      direction: orientation,
      'aria-orientation': horizontal ? 'vertical' : 'horizontal',
      'aria-controls': panelId(i),
      value: round(sizes[i]!),
      minValue: round(minValue),
      maxValue: round(Math.max(minValue, maxValue)),
      step,
      largeStep,
      unitsPerPixel,
      reversed: horizontal && rtl,
      onValueChange: (next) => place(i, resolve(i, next)),
      onCollapse: a.collapsible || b.collapsible ? () => toggleCollapse(i) : undefined,
      onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (!event.defaultPrevented) dragging.current = true;
      },
      onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => {
        dragging.current = false;
        onPointerUp?.(event);
      },
      onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => {
        dragging.current = false;
        onPointerCancel?.(event);
      },
      onDoubleClick: (event) => {
        onDoubleClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        reset(i);
      },
      className: handleClass ? mergeProps(s.handle, handleClass).className : s.handle.className,
    };
    body.push(<ResizeHandle key={handles[i]?.key ?? `handle-${i}`} {...handleProps} />);
  });

  return (
    <div
      {...rest}
      {...mergeProps(s.root, className)}
      ref={(node) => {
        rootEl.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      data-orientation={orientation}
    >
      {body}
    </div>
  );
}

export const Splitter = Object.assign(SplitterRoot, {
  Panel: SplitterPanel,
  Handle: SplitterHandle,
});
