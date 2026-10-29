import type { ComponentPropsWithRef, JSX, ReactElement, ReactNode } from 'react';
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { outline } from '@var-ui/core/components/outline';
import { cx, mergeProps } from 'typestyles';

export type OutlineItemData = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type OutlineProps = Omit<ComponentPropsWithRef<'nav'>, 'children' | 'title'> & {
  /** Flat list of headings to render as links — takes priority over `Outline.Item` children. */
  items?: OutlineItemData[];
  /** `Outline.Item` children, used when `items` is omitted. */
  children?: ReactNode;
  /** Accessible name for the `nav` landmark and the visible heading. @default 'On this page' */
  title?: string;
  /** Controlled active item id — disables scroll-spy when set. */
  activeId?: string;
  /** Observe heading elements and highlight the topmost visible one when `activeId` is omitted. @default true */
  scrollSpy?: boolean;
};

export type OutlineItemProps = Omit<ComponentPropsWithRef<'li'>, 'id' | 'children'> & {
  /** Heading id this item links to (`#id`). */
  id: string;
  /** @default 2 */
  level?: 2 | 3;
  children?: ReactNode;
  /** Merged onto the anchor (the visible row), not the `<li>`. */
  className?: string;
};

type OutlineStyleSlots = ReturnType<typeof outline>;

type OutlineContextValue = {
  styles: OutlineStyleSlots;
  activeId?: string;
};

const OutlineContext = createContext<OutlineContextValue | null>(null);

function useOutlineContext(): OutlineContextValue {
  const context = useContext(OutlineContext);
  return context ?? { styles: outline(), activeId: undefined };
}

/** In-page navigation link; highlights via the nearest `Outline`'s active/scroll-spy state. */
function OutlineItem({
  id,
  level = 2,
  children,
  className,
  ref,
  ...rest
}: OutlineItemProps): JSX.Element {
  const { styles: o, activeId } = useOutlineContext();
  const isActive = activeId === id;
  return (
    <li {...rest} ref={ref}>
      <a
        href={`#${id}`}
        data-active={isActive ? '' : undefined}
        className={cx(
          (isActive ? o.linkActive : o.link).className,
          level === 3 ? o.linkNested.className : undefined,
          className,
        )}
      >
        {children}
      </a>
    </li>
  );
}

function collectItemIds(children: ReactNode): string[] {
  return Children.toArray(children)
    .filter(
      (child): child is ReactElement<OutlineItemProps> =>
        isValidElement(child) && typeof (child.props as OutlineItemProps).id === 'string',
    )
    .map((child) => child.props.id);
}

/**
 * In-page table of contents: renders links to headings from an `items` array
 * or `Outline.Item` children, and highlights the active one — controlled via
 * `activeId`, or automatically via an `IntersectionObserver` scroll-spy.
 *
 * ```tsx
 * <Outline items={[{ id: 'intro', text: 'Intro', level: 2 }]} />
 * ```
 */
function OutlineRoot({
  items,
  children,
  title = 'On this page',
  activeId,
  scrollSpy = true,
  className,
  ref,
  ...rest
}: OutlineProps): JSX.Element {
  const o = outline();
  const itemIds = useMemo(
    () => items?.map((item) => item.id) ?? collectItemIds(children),
    [items, children],
  );
  const [spyId, setSpyId] = useState<string | undefined>(undefined);
  const current = activeId ?? spyId;

  useEffect(() => {
    if (activeId !== undefined || scrollSpy === false) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const elements = itemIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element != null);
    if (elements.length === 0) return;

    const visibility = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting);
        }
        const topmost = elements.find((element) => visibility.get(element.id));
        if (topmost) setSpyId(topmost.id);
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [itemIds, activeId, scrollSpy]);

  const content =
    items != null
      ? items.map((item) => (
          <OutlineItem key={item.id} id={item.id} level={item.level}>
            {item.text}
          </OutlineItem>
        ))
      : children;

  return (
    <nav aria-label={title} {...rest} {...mergeProps(o.root, className)} ref={ref}>
      <p {...mergeProps(o.title)}>{title}</p>
      <OutlineContext.Provider value={{ styles: o, activeId: current }}>
        <ul {...mergeProps(o.list)}>{content}</ul>
      </OutlineContext.Provider>
    </nav>
  );
}

export const Outline = Object.assign(OutlineRoot, { Item: OutlineItem });
