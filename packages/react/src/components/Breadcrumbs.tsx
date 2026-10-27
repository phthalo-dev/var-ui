import type { CSSProperties, JSX, ReactNode, Ref } from 'react';
import { useState } from 'react';
import { Breadcrumb, Breadcrumbs as AriaBreadcrumbs, Link } from 'react-aria-components';
import { breadcrumbs as breadcrumbsStyles } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type BreadcrumbItemData = {
  /** Stable identifier, passed to `onAction` when the item is pressed. */
  id: string;
  label: ReactNode;
  /** Omit for items that only act via `onAction` (no navigation). */
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItemData[];
  /** Collapse to an ellipsis once `items.length` exceeds this. */
  maxItems?: number;
  /** Leading items kept visible before the collapse point. @default 1 */
  itemsBeforeCollapse?: number;
  /** Trailing items kept visible after the collapse point. @default 1 */
  itemsAfterCollapse?: number;
  /** Separator string rendered between items via CSS `content`. @default '/' */
  separator?: string;
  /** Accessible name for the nav landmark. @default 'Breadcrumb' */
  label?: string;
  /** Fires with the pressed item's `id` (not called for the current item). */
  onAction?: (id: string) => void;
  className?: string;
  /** Ref to the underlying `<nav>` element. */
  ref?: Ref<HTMLElement>;
};

const ELLIPSIS_ID = '__ellipsis__';

type VisibleItem = BreadcrumbItemData & { isEllipsis?: boolean };

function getVisibleItems(
  items: BreadcrumbItemData[],
  maxItems: number | undefined,
  itemsBeforeCollapse: number,
  itemsAfterCollapse: number,
  expanded: boolean,
): VisibleItem[] {
  if (expanded || maxItems == null || items.length <= maxItems) {
    return items;
  }
  // Clamp so the leading/trailing windows never overlap (and never exceed
  // items.length), which would otherwise emit a duplicate item `id` into the
  // rendered array passed to RAC's `<Breadcrumbs items={...}>`.
  const before = Math.max(0, Math.min(itemsBeforeCollapse, items.length));
  const after = Math.max(0, Math.min(itemsAfterCollapse, items.length - before));
  const leading = items.slice(0, before);
  const trailing = items.slice(items.length - after);
  return [...leading, { id: ELLIPSIS_ID, label: '…', isEllipsis: true }, ...trailing];
}

/**
 * Navigation breadcrumb trail on RAC `Breadcrumbs`/`Breadcrumb`/`Link`.
 * Collapses long trails to a click-to-expand ellipsis.
 *
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { id: 'home', label: 'Home', href: '/' },
 *     { id: 'current', label: 'My Project' },
 *   ]}
 * />
 * ```
 */
export function Breadcrumbs({
  items,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  separator,
  label = 'Breadcrumb',
  onAction,
  className,
  ref,
}: BreadcrumbsProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const b = breadcrumbsStyles();
  const visibleItems = getVisibleItems(
    items,
    maxItems,
    itemsBeforeCollapse,
    itemsAfterCollapse,
    expanded,
  );
  const style = separator
    ? ({ '--var-ui-breadcrumbs-separator': `"${separator}"` } as CSSProperties)
    : undefined;

  return (
    <nav aria-label={label} {...mergeProps(b.root, className)} style={style} ref={ref}>
      <AriaBreadcrumbs
        items={visibleItems}
        onAction={onAction ? (key) => onAction(String(key)) : undefined}
        aria-label={label}
        {...mergeProps(b.list)}
      >
        {(item: VisibleItem) =>
          item.isEllipsis ? (
            <Breadcrumb id={item.id} {...mergeProps(b.ellipsisItem)}>
              <button
                type="button"
                {...mergeProps(b.link)}
                onClick={() => setExpanded(true)}
                aria-label="Show all breadcrumbs"
              >
                {item.label}
              </button>
            </Breadcrumb>
          ) : (
            <Breadcrumb id={item.id} {...mergeProps(b.item)}>
              {/*
                Spread `href` conditionally: RAC's Link treats `href` as present whenever the
                key exists on props (even set to `undefined`), resolving it to `''` and warning
                when downgraded to a `<span>` for the current item. Omitting the key entirely
                for href-less items avoids that without reintroducing manual current-item logic.
              */}
              <Link {...(item.href ? { href: item.href } : {})} {...mergeProps(b.link)}>
                {item.label}
              </Link>
            </Breadcrumb>
          )
        }
      </AriaBreadcrumbs>
    </nav>
  );
}
