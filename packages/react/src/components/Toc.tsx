import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link as AriaLink } from 'react-aria-components';
import { positionTocIndicator } from '@var-ui/core/components/indicators/toc';
import type { TocHeading } from '@var-ui/core/components/toc/spy';
import { toc as tocStyles } from '@var-ui/core/components/toc';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';

const tocVars = recipeVars(tocStyles);
import { useTocSpy } from '../hooks/useTocSpy';
import { mergeProps } from 'typestyles';

export type TocItemProps = Omit<ComponentPropsWithRef<'li'>, 'children'> & {
  label: string;
  href: string;
  isSelected?: boolean;
  isNested?: boolean;
  /** Merged onto the anchor (the visible row), not the `<li>`. */
  className?: string;
};

/** Anchor row for one heading in a `Toc` list. */
export function TocItem({
  label,
  href,
  isSelected = false,
  isNested = false,
  className,
  ref,
  ...rest
}: TocItemProps): JSX.Element {
  const s = tocStyles();

  return (
    <li {...rest} {...mergeProps(s.item)} ref={ref} data-nested={isNested || undefined}>
      <AriaLink
        href={href}
        {...mergeProps(s.link, className)}
        {...(isSelected ? { 'data-selected': '' } : {})}
        aria-current={isSelected ? 'location' : undefined}
      >
        {label}
      </AriaLink>
    </li>
  );
}

export type TocProps = Omit<ComponentPropsWithRef<'nav'>, 'children' | 'title'> & {
  /** Visible section label above the list. @default 'On this page' */
  title?: ReactNode;
  /** Manual `Toc.Item` children. Omit when using `auto`. */
  children?: ReactNode;
  /** Scan a content root for `h2`/`h3` headings with ids. */
  auto?: boolean;
  contentSelector?: string;
  headingSelector?: string;
  minHeadings?: number;
  headerOffset?: number;
  /** Sets `--var-ui-toc-stickytop` on the root. */
  stickyTop?: string;
  /** Accessible name for the nav landmark. @default title or 'On this page' */
  label?: string;
};

function TocList({
  headings,
  activeId,
  children,
  listRef,
}: {
  headings?: TocHeading[];
  activeId?: string | null;
  children?: ReactNode;
  listRef: React.RefObject<HTMLOListElement | null>;
}): JSX.Element {
  const s = tocStyles();

  return (
    <ol ref={listRef} {...mergeProps(s.list)}>
      {children ??
        (headings ?? []).map((heading) => (
          <TocItem
            key={heading.id}
            label={heading.text}
            href={`#${heading.id}`}
            isNested={heading.level === 3}
            isSelected={heading.id === activeId}
          />
        ))}
    </ol>
  );
}

/**
 * In-page table of contents for long docs. Compose manual items or enable `auto`
 * to scan a content root for heading anchors.
 */
export function Toc({
  title = 'On this page',
  children,
  auto = false,
  contentSelector,
  headingSelector,
  minHeadings = 2,
  headerOffset,
  stickyTop,
  className,
  style,
  label,
  ref,
  ...rest
}: TocProps): JSX.Element | null {
  const listRef = useRef<HTMLOListElement>(null);
  const [contentRoot, setContentRoot] = useState<ParentNode | null>(null);

  useEffect(() => {
    if (!auto || !contentSelector) {
      setContentRoot(null);
      return;
    }
    setContentRoot(document.querySelector(contentSelector));
  }, [auto, contentSelector]);

  const { headings, activeId } = useTocSpy(auto ? contentRoot : null, {
    headingSelector,
    minHeadings,
    headerOffset,
  });

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const activeLink = list.querySelector<HTMLAnchorElement>('[data-selected]');
    positionTocIndicator(list, activeLink);
  }, [activeId, headings, children]);

  const s = tocStyles();
  const resolvedLabel = label ?? (typeof title === 'string' ? title : 'On this page');
  const rootStyle = stickyTop ? styleVars([[tocVars.stickyTop, stickyTop]]) : undefined;

  if (auto && headings.length < minHeadings) {
    return null;
  }

  return (
    <nav
      aria-label={resolvedLabel}
      {...rest}
      {...mergeProps(s.root, className)}
      style={rootStyle ? { ...style, ...rootStyle } : style}
      ref={ref}
    >
      {title != null ? <p {...mergeProps(s.title)}>{title}</p> : null}
      <TocList listRef={listRef} headings={auto ? headings : undefined} activeId={activeId}>
        {children}
      </TocList>
    </nav>
  );
}

Toc.Item = TocItem;
