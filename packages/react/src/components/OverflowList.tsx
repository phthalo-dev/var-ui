import type { CSSProperties, JSX, ReactElement, ReactNode, Ref } from 'react';
import { Children, createContext, useCallback, useContext, useMemo } from 'react';
import { overflowList as overflowListStyles } from '@var-ui/core/components/overflowList';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import type { OverflowListVariantProps } from '@var-ui/core';

const overflowListVars = recipeVars(overflowListStyles);
import { mergeProps } from 'typestyles';
import { useOverflow } from '../hooks/useOverflow';

type OverflowGapToken = NonNullable<OverflowListVariantProps['gap']>;

/** Mirrors the `space` primitive steps backing each named gap variant in the `overflowList` recipe. */
const GAP_PX: Record<OverflowGapToken, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 24,
  xl: 48,
};

export type OverflowListProps<T = unknown> = {
  items?: T[];
  children?: ReactNode;
  renderItem?: (item: T, index: number) => ReactNode;
  /** Required when overflow can occur — receives the hidden data items or hidden `Item` elements. */
  renderOverflow: (hidden: T[] | ReactElement[]) => ReactNode;
  /** Hard cap applied in addition to measure-to-fit. */
  maxVisible?: number;
  fillParent?: NonNullable<OverflowListVariantProps['fillParent']>;
  gap?: NonNullable<OverflowListVariantProps['gap']> | number;
  className?: string;
  /** Ref to the visible root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type OverflowListItemProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<span>` element. */
  ref?: Ref<HTMLSpanElement>;
};

type OverflowListStyleSlots = ReturnType<typeof overflowListStyles>;

type OverflowListContextValue = {
  styles: OverflowListStyleSlots;
};

const OverflowListContext = createContext<OverflowListContextValue | null>(null);

function useOverflowListContext(): OverflowListContextValue {
  const context = useContext(OverflowListContext);
  if (context == null) {
    throw new Error('OverflowList.Item must be used within OverflowList');
  }
  return context;
}

// Kept off-screen (not display:none) so widths are measurable; absolutely
// positioned + zero height so it never affects visible layout or scroll size.
const measureRowStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: 0,
  overflow: 'hidden',
  visibility: 'hidden',
  pointerEvents: 'none',
};

/** Row within an `OverflowList` — applies the recipe's `item` slot styling. */
export function OverflowListItem({ children, className, ref }: OverflowListItemProps): JSX.Element {
  const { styles: s } = useOverflowListContext();
  return (
    <span {...mergeProps(s.item, className)} ref={ref}>
      {children}
    </span>
  );
}

/**
 * Horizontal row that shows as many items/children as fit and collapses the
 * rest behind a caller-supplied overflow affordance. Supports compound
 * `OverflowList.Item` children or an `items` array with `renderItem`.
 *
 * ```tsx
 * <OverflowList renderOverflow={(hidden) => <Button>+{hidden.length}</Button>}>
 *   <OverflowList.Item>Alpha</OverflowList.Item>
 *   <OverflowList.Item>Beta</OverflowList.Item>
 * </OverflowList>
 * ```
 */
export function OverflowList<T = unknown>({
  items,
  children,
  renderItem,
  renderOverflow,
  maxVisible,
  fillParent = false,
  gap = 'md',
  className,
  ref,
}: OverflowListProps<T>): JSX.Element {
  const isItemsMode = items != null;
  const childArray = useMemo(
    () => (children != null ? (Children.toArray(children) as ReactElement[]) : []),
    [children],
  );
  const sourceItems = useMemo<(T | ReactElement)[]>(
    () => (isItemsMode ? items : childArray),
    [isItemsMode, items, childArray],
  );

  const gapPx = typeof gap === 'number' ? gap : GAP_PX[gap];
  const { containerRef, measureRef, visibleItems, hiddenItems } = useOverflow(sourceItems, {
    maxVisible,
    gapPx,
  });

  // The hook measures `containerRef`; mirror the node out to the caller's ref too.
  const setContainer = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [containerRef, ref],
  );

  const s = overflowListStyles({
    gap: typeof gap === 'number' ? 'none' : gap,
    fillParent: fillParent ? true : false,
  });
  const rootStyle =
    typeof gap === 'number' ? styleVars([[overflowListVars.gap, `${gap}px`]]) : undefined;

  const renderEntry = (entry: T | ReactElement, index: number): ReactNode => {
    if (isItemsMode) {
      return (
        <OverflowListItem key={index}>
          {renderItem ? renderItem(entry as T, index) : (entry as ReactNode)}
        </OverflowListItem>
      );
    }
    return entry as ReactElement;
  };

  const hiddenForCallback = hiddenItems as T[] | ReactElement[];
  // Worst-case hidden set (all items) reserves enough width for the widest indicator text (e.g. "+12").
  const worstCaseHidden = sourceItems as T[] | ReactElement[];

  return (
    <OverflowListContext.Provider value={{ styles: s }}>
      <div {...mergeProps(s.root, className)} style={rootStyle} ref={setContainer}>
        {visibleItems.map((entry, index) => renderEntry(entry, index))}
        {hiddenItems.length > 0 ? (
          <span {...mergeProps(s.overflow)}>{renderOverflow(hiddenForCallback)}</span>
        ) : null}
      </div>
      <div aria-hidden="true" style={measureRowStyle} ref={measureRef as Ref<HTMLDivElement>}>
        {sourceItems.map((entry, index) => renderEntry(entry, index))}
        <span {...mergeProps(s.overflow)}>{renderOverflow(worstCaseHidden)}</span>
      </div>
    </OverflowListContext.Provider>
  );
}

OverflowList.Item = OverflowListItem;
