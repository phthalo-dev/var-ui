import type { JSX, ReactElement, ReactNode } from 'react';
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { outline } from '@var-ui/core';
import { cx, mergeProps } from 'typestyles';

export type OutlineItemData = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type OutlineProps = {
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
  className?: string;
};

export type OutlineItemProps = {
  id: string;
  /** @default 2 */
  level?: 2 | 3;
  children?: ReactNode;
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
function OutlineItem({ id, level = 2, children, className }: OutlineItemProps): JSX.Element {
  const { styles: o, activeId } = useOutlineContext();
  const isActive = activeId === id;
  return (
    <li>
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
    <nav aria-label={title} {...mergeProps(o.root, className)}>
      <p {...mergeProps(o.title)}>{title}</p>
      <OutlineContext.Provider value={{ styles: o, activeId: current }}>
        <ul {...mergeProps(o.list)}>{content}</ul>
      </OutlineContext.Provider>
    </nav>
  );
}

export const Outline = Object.assign(OutlineRoot, { Item: OutlineItem });
