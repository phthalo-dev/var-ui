import type { JSX, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { button } from '@var-ui/core/components/button';
import { pagination } from '@var-ui/core/components/pagination';
import type { PaginationVariantProps } from '@var-ui/core';
import { useDirection } from '../DirectionProvider';
import { IconButton } from './IconButton';
import { Select } from './Select';
import { cx, mergeProps } from 'typestyles';

export type PaginationVariant = 'pages' | 'count' | 'compact' | 'dots' | 'none';

export type PaginationProps = {
  /** Current page number (1-based). */
  page: number;
  onChange: (page: number) => void;
  /** Total item count — takes precedence over `totalPages` when both are set. */
  totalItems?: number;
  /** Total page count, when the item count isn't known. */
  totalPages?: number;
  /** Cursor-based pagination: whether a next page exists. Ignored once totalPages is computable. */
  hasMore?: boolean;
  /** @default 10 */
  pageSize?: number;
  /** Shows a page-size `Select` when provided. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  /** @default 'pages' */
  variant?: PaginationVariant;
  /** Page buttons shown on each side of the current page (`pages` variant only). @default 1 */
  siblingCount?: number;
  /** @default 'md' */
  size?: NonNullable<PaginationVariantProps['size']>;
  isDisabled?: boolean;
  /** Accessible name for the nav landmark. @default 'Pagination' */
  label?: string;
  className?: string;
  /** Ref to the underlying `<nav>` element. */
  ref?: Ref<HTMLElement>;
};

/**
 * Page numbers + optional leading/trailing ellipsis for a given current page
 * and total. Pure and independently testable.
 */
export function generatePageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): (number | '...')[] {
  const totalSlots = 5 + 2 * siblingCount;
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;
  // Number of leading/trailing page numbers shown before/after the single ellipsis in the
  // boundary (near-start / near-end) cases.
  const boundaryCount = 2 * siblingCount + 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const pages: (number | '...')[] = Array.from({ length: boundaryCount }, (_, i) => i + 1);
    pages.push('...', totalPages);
    return pages;
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const pages: (number | '...')[] = [1, '...'];
    for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  const pages: (number | '...')[] = [1, '...'];
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i);
  }
  pages.push('...', totalPages);
  return pages;
}

/**
 * Pagination controls with five display variants and an optional page-size
 * selector. Controlled component — the caller owns `page`.
 *
 * ```tsx
 * <Pagination page={page} onChange={setPage} totalItems={200} pageSize={20} />
 * ```
 */
export function Pagination({
  page,
  onChange,
  totalItems,
  totalPages: totalPagesProp,
  hasMore,
  pageSize: pageSizeProp = 10,
  pageSizeOptions,
  onPageSizeChange,
  variant = 'pages',
  siblingCount = 1,
  size = 'md',
  isDisabled = false,
  label = 'Pagination',
  className,
  ref,
}: PaginationProps): JSX.Element | null {
  const { isRtl } = useDirection();
  const p = pagination({ size });
  const pageSize = Number.isFinite(pageSizeProp) ? Math.max(1, Math.floor(pageSizeProp)) : 10;
  const totalPages =
    totalPagesProp ?? (totalItems != null ? Math.ceil(totalItems / pageSize) : undefined);

  if ((totalItems != null && totalItems <= 0) || (totalPages != null && totalPages <= 0)) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = totalPages != null ? page < totalPages : (hasMore ?? false);

  const goTo = (next: number) => {
    if (!isDisabled) {
      onChange(next);
    }
  };

  const handlePageSizeChange = (key: string) => {
    onPageSizeChange?.(Number(key));
    goTo(1);
  };

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = totalItems != null ? Math.min(page * pageSize, totalItems) : page * pageSize;

  function renderIndicator() {
    switch (variant) {
      case 'pages': {
        if (totalPages == null) {
          return null;
        }
        const range = generatePageRange(page, totalPages, siblingCount);
        return range.map((item, index) =>
          item === '...' ? (
            <span
              key={`ellipsis-${range[index - 1]}-${range[index + 1]}`}
              {...mergeProps(p.ellipsis)}
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <AriaButton
              key={item}
              {...mergeProps(
                button({
                  tone: item === page ? 'neutral' : 'accent',
                  appearance: item === page ? 'subtle' : 'ghost',
                  size,
                }),
              )}
              onPress={() => goTo(item)}
              isDisabled={isDisabled}
              aria-label={`Go to page ${item}`}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </AriaButton>
          ),
        );
      }

      case 'count':
        return totalItems == null ? null : (
          <span {...mergeProps(p.infoText)}>
            {rangeStart}–{rangeEnd} of {totalItems}
          </span>
        );

      case 'compact':
        return totalPages == null ? null : (
          <span {...mergeProps(p.infoText)}>
            Page {page} of {totalPages}
          </span>
        );

      case 'dots':
        return totalPages == null ? null : (
          <div {...mergeProps(p.dotsContainer)} role="group" aria-label="Page indicators">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                aria-current={i + 1 === page ? 'page' : undefined}
                onClick={() => goTo(i + 1)}
                disabled={isDisabled}
                {...mergeProps(p.dot, cx(i + 1 === page && p.dotActive))}
              />
            ))}
          </div>
        );

      case 'none':
      default:
        return null;
    }
  }

  return (
    <nav aria-label={label} {...mergeProps(p.root, className)} ref={ref}>
      {pageSizeOptions && pageSizeOptions.length > 0 ? (
        <div {...mergeProps(p.pageSizeGroup)}>
          <span>Rows per page</span>
          <Select
            aria-label="Items per page"
            options={pageSizeOptions.map((n) => ({ id: String(n), label: String(n) }))}
            selectedKey={String(pageSize)}
            onSelectionChange={(key) => handlePageSizeChange(String(key))}
            isDisabled={isDisabled}
          />
        </div>
      ) : null}
      <div {...mergeProps(p.controls)}>
        <IconButton
          name="chevronLeft"
          aria-label="Go to previous page"
          tone="accent"
          appearance="ghost"
          size={size}
          onPress={() => goTo(page - 1)}
          isDisabled={isDisabled || !hasPrevious}
          data-mirror={isRtl || undefined}
        />
        {renderIndicator()}
        <IconButton
          name="chevronRight"
          aria-label="Go to next page"
          tone="accent"
          appearance="ghost"
          size={size}
          onPress={() => goTo(page + 1)}
          isDisabled={isDisabled || !hasNext}
          data-mirror={isRtl || undefined}
        />
      </div>
    </nav>
  );
}
