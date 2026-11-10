import type { ComponentPropsWithRef, JSX } from 'react';
import { card } from '@var-ui/core/components/card';
import { combine, mergeProps } from 'typestyles';

/** A `<div>` content surface: the default when no `href` is given. */
export type CardAsDivProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  href?: undefined;
  /** Optional heading rendered above the body. */
  title?: string;
  /** Semantic level of the title heading. @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

/** A whole-card link (navigation cards, doc tiles): rendered as an `<a>` when `href` is given. */
export type CardAsLinkProps = Omit<ComponentPropsWithRef<'a'>, 'title' | 'href'> & {
  /** Makes the whole card a link. */
  href: string;
  /** Card headline. */
  title: string;
  /** Supporting copy below the title. */
  description?: string;
  /** Trailing hint line (e.g. reading time, "Learn more →"). */
  hint?: string;
};

export type CardProps = CardAsDivProps | CardAsLinkProps;

/**
 * Content surface with an optional title. With `href` the whole card is a link, the same way
 * `Button` becomes an `<a>`.
 *
 * ```tsx
 * <Card title="Usage">1.2M requests this month.</Card>
 * <Card href="/docs/theming" title="Theming" description="Override any token." hint="5 min read" />
 * ```
 */
export function Card(props: CardProps): JSX.Element {
  const c = card();
  if (props.href !== undefined) {
    const { title, description, hint, className, children, ref, ...rest } = props;
    return (
      <a {...rest} {...combine(c.root, c.linkRoot, className)} ref={ref}>
        <span {...mergeProps(c.linkTitle)}>{title}</span>
        {description ? <p {...mergeProps(c.linkDescription)}>{description}</p> : null}
        {children}
        {hint ? <span {...mergeProps(c.linkHint)}>{hint}</span> : null}
      </a>
    );
  }
  const { title, headingLevel = 3, className, children, ref, ...rest } = props;
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...rest} {...mergeProps(c.root, className)} ref={ref}>
      {title ? <Heading {...mergeProps(c.title)}>{title}</Heading> : null}
      <div {...mergeProps(c.body)}>{children}</div>
    </div>
  );
}
