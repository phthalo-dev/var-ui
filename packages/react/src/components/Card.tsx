import type { ComponentPropsWithRef, JSX, MouseEventHandler, ReactNode } from 'react';
import { card } from '@var-ui/core/components/card';
import { combine, mergeProps } from 'typestyles';

type CardText = {
  /** Supporting copy below the title. */
  description?: ReactNode;
  /** Content at the end of the title row, e.g. a status `Badge`. */
  titleEnd?: ReactNode;
};

/** A `<div>` content surface: the default when no `href` is given. */
export type CardAsDivProps = Omit<ComponentPropsWithRef<'div'>, 'title' | 'onClick'> &
  CardText & {
    href?: undefined;
    /** Heading rendered above the body. Required with `onClick` (it names the action). */
    title?: ReactNode;
    /** Semantic level of the title heading. @default 3 */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * Makes the whole card pressable (opens a dialog, selects a row). The title becomes a
     * `<button>` that covers the card, so it gets button semantics, focus and Enter/Space.
     * Links and buttons inside the card keep working.
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;
  };

/** A whole-card link (navigation cards, doc tiles): rendered as an `<a>` when `href` is given. */
export type CardAsLinkProps = Omit<ComponentPropsWithRef<'a'>, 'title' | 'href'> &
  CardText & {
    /** Makes the whole card a link. */
    href: string;
    /** Card headline. */
    title: ReactNode;
    /** Trailing hint line (e.g. reading time, "Learn more →"). */
    hint?: string;
    /** Full-bleed media (thumbnail, preview) above the title. */
    media?: ReactNode;
  };

export type CardProps = CardAsDivProps | CardAsLinkProps;

/**
 * Content surface with an optional title. With `href` the whole card is a link, the same way
 * `Button` becomes an `<a>`; with `onClick` it is pressable.
 *
 * ```tsx
 * <Card title="Usage" description="This month">1.2M requests.</Card>
 * <Card title="Memory" titleEnd={<Badge>New</Badge>} onClick={openDialog}>…</Card>
 * <Card href="/docs/theming" title="Theming" description="Override any token." hint="5 min read" />
 * ```
 */
export function Card(props: CardProps): JSX.Element {
  const c = card();
  if (props.href !== undefined) {
    const { title, description, titleEnd, hint, media, className, children, ref, ...rest } = props;
    return (
      <a {...rest} {...combine(c.root, c.linkRoot, className)} ref={ref}>
        {media ? <div {...mergeProps(c.media)}>{media}</div> : null}
        {titleEnd != null ? (
          <span {...mergeProps(c.header)}>
            <span {...mergeProps(c.linkTitle)}>{title}</span>
            <span {...mergeProps(c.titleEnd)}>{titleEnd}</span>
          </span>
        ) : (
          <span {...mergeProps(c.linkTitle)}>{title}</span>
        )}
        {description ? <p {...mergeProps(c.linkDescription)}>{description}</p> : null}
        {children}
        {hint ? <span {...mergeProps(c.linkHint)}>{hint}</span> : null}
      </a>
    );
  }
  const {
    title,
    description,
    titleEnd,
    headingLevel = 3,
    onClick,
    className,
    children,
    ref,
    ...rest
  } = props;
  const Heading = `h${headingLevel}` as const;
  const titleContent =
    onClick && title != null ? (
      <button type="button" {...mergeProps(c.action)} data-card-action="" onClick={onClick}>
        {title}
      </button>
    ) : (
      title
    );
  const heading = title != null ? <Heading {...mergeProps(c.title)}>{titleContent}</Heading> : null;
  return (
    <div
      {...rest}
      {...mergeProps(c.root, className)}
      data-pressable={onClick ? '' : undefined}
      ref={ref}
    >
      {titleEnd != null ? (
        <div {...mergeProps(c.header)}>
          {heading}
          <div {...mergeProps(c.titleEnd)}>{titleEnd}</div>
        </div>
      ) : (
        heading
      )}
      {description ? <p {...mergeProps(c.description)}>{description}</p> : null}
      {children != null ? <div {...mergeProps(c.body)}>{children}</div> : null}
    </div>
  );
}
