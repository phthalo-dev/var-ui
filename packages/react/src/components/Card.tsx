import type { AnchorHTMLAttributes, HTMLAttributes, JSX, Ref } from 'react';
import { card } from '@var-ui/core/components/card';
import { combine, mergeProps } from 'typestyles';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional heading rendered above the body. */
  title?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Static content surface with an optional title.
 *
 * ```tsx
 * <Card title="Usage">1.2M requests this month.</Card>
 * ```
 */
export function Card({ title, className, children, ref, ...props }: CardProps): JSX.Element {
  const c = card();
  return (
    <div {...props} {...mergeProps(c.root, className)} ref={ref}>
      {title ? <h3 {...mergeProps(c.title)}>{title}</h3> : null}
      <div {...mergeProps(c.body)}>{children}</div>
    </div>
  );
}

export type ClickableCardProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Card headline. */
  title: string;
  /** Supporting copy below the title. */
  description?: string;
  /** Trailing hint line (e.g. reading time, "Learn more →"). */
  hint?: string;
  /** Ref to the underlying `<a>` element. */
  ref?: Ref<HTMLAnchorElement>;
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
