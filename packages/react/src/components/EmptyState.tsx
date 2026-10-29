import type { JSX, ReactNode, Ref } from 'react';
import { emptyState } from '@var-ui/core/components/emptyState';
import { mergeProps } from 'typestyles';

export type EmptyStateProps = {
  /** Decorative glyph or illustration; consumers pass `<Icon>` or a custom node. */
  icon?: ReactNode;
  /** Primary headline. */
  title: string;
  /** Supporting copy below the title. */
  description?: ReactNode;
  /** Call-to-action slot (typically a button or link). */
  action?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Empty-list placeholder: icon well, headline, supporting copy, call to
 * action.
 *
 * ```tsx
 * <EmptyState
 *   icon={<Icon name="search" size="lg" />}
 *   title="No results"
 *   description="Try a different filter."
 *   action={<Button>Clear filters</Button>}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ref,
}: EmptyStateProps): JSX.Element {
  const e = emptyState();
  return (
    <div {...mergeProps(e.root, className)} ref={ref}>
      {icon ? (
        <div {...mergeProps(e.icon)} data-empty-state-icon aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 {...mergeProps(e.title)}>{title}</h3>
      {description ? <p {...mergeProps(e.description)}>{description}</p> : null}
      {action ? <div {...mergeProps(e.action)}>{action}</div> : null}
    </div>
  );
}
