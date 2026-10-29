import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { emptyState } from '@var-ui/core/components/emptyState';
import { mergeProps } from 'typestyles';

export type EmptyStateProps = Omit<ComponentPropsWithRef<'div'>, 'title' | 'children'> & {
  /** Decorative glyph or illustration; consumers pass `<Icon>` or a custom node. */
  icon?: ReactNode;
  /** Primary headline. */
  title: string;
  /** Supporting copy below the title. */
  description?: ReactNode;
  /** Call-to-action slot (typically a button or link). */
  action?: ReactNode;
  /** Semantic level of the title heading. @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
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
  headingLevel = 3,
  className,
  ref,
  ...rest
}: EmptyStateProps): JSX.Element {
  const e = emptyState();
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...rest} {...mergeProps(e.root, className)} ref={ref}>
      {icon ? (
        <div {...mergeProps(e.icon)} data-empty-state-icon aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <Heading {...mergeProps(e.title)}>{title}</Heading>
      {description ? <p {...mergeProps(e.description)}>{description}</p> : null}
      {action ? <div {...mergeProps(e.action)}>{action}</div> : null}
    </div>
  );
}
