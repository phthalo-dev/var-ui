import type { ComponentPropsWithRef, JSX } from 'react';
import { card } from '@var-ui/core/components/card';
import { combine, mergeProps } from 'typestyles';

export type CardProps = ComponentPropsWithRef<'div'> & {
  /** Optional heading rendered above the body. */
  title?: string;
  /** Semantic level of the title heading. @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * Static content surface with an optional title.
 *
 * ```tsx
 * <Card title="Usage">1.2M requests this month.</Card>
 * ```
 */
export function Card({
  title,
  headingLevel = 3,
  className,
  children,
  ref,
  ...props
}: CardProps): JSX.Element {
  const c = card();
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...props} {...mergeProps(c.root, className)} ref={ref}>
      {title ? <Heading {...mergeProps(c.title)}>{title}</Heading> : null}
      <div {...mergeProps(c.body)}>{children}</div>
    </div>
  );
}

export type ClickableCardProps = ComponentPropsWithRef<'a'> & {
  /** Card headline. */
  title: string;
  /** Supporting copy below the title. */
  description?: string;
  /** Trailing hint line (e.g. reading time, "Learn more →"). */
  hint?: string;
};

/**
 * Whole-card link surface (navigation cards, doc tiles).
 *
 * ```tsx
 * <ClickableCard href="/docs/theming" title="Theming" description="Override any token." hint="5 min read" />
 * ```
 */
export function ClickableCard({
  title,
  description,
  hint,
  className,
  ref,
  ...props
}: ClickableCardProps): JSX.Element {
  const c = card();
  return (
    <a {...props} {...combine(c.root, c.linkRoot, className)} ref={ref}>
      <span {...mergeProps(c.linkTitle)}>{title}</span>
      {description ? <p {...mergeProps(c.linkDescription)}>{description}</p> : null}
      {hint ? <span {...mergeProps(c.linkHint)}>{hint}</span> : null}
    </a>
  );
}
