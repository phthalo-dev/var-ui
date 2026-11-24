export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** Offset from the top of the scroll container for the active heading zone. */
export const TOC_HEADER_OFFSET = 80;

export function collectArticleHeadings(
  root: ParentNode,
  selector = 'h2[id], h3[id]',
): TocHeading[] {
  const headings: TocHeading[] = [];

  for (const heading of root.querySelectorAll(selector)) {
    if (!(heading instanceof HTMLHeadingElement)) continue;
    const level = heading.tagName === 'H2' ? 2 : 3;
    const text = heading.textContent?.trim();
    if (!text) continue;
    headings.push({ id: heading.id, text, level });
  }

  return headings;
}

export function findScrollContainer(element: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = element.parentElement;

  while (current) {
    const { overflowY } = getComputedStyle(current);
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

function isScrolledToBottom(scrollContainer: HTMLElement | null): boolean {
  if (!scrollContainer) return false;
  const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
  return scrollTop + clientHeight >= scrollHeight - 4;
}

/** Pick the last heading that has scrolled past the active zone top. */
export function pickActiveHeadingByPosition(
  ids: readonly string[],
  scrollContainer: HTMLElement | null,
  offset = TOC_HEADER_OFFSET,
): string | null {
  if (ids.length === 0) return null;

  // At the bottom of the page the last heading may sit above the active zone,
  // so always select the final section once the reader has reached the end.
  if (isScrolledToBottom(scrollContainer)) {
    return ids[ids.length - 1] ?? null;
  }

  const containerTop = scrollContainer?.getBoundingClientRect().top ?? 0;
  const activeLine = containerTop + offset;

  let active = ids[0];

  for (const id of ids) {
    const element = document.getElementById(id);
    if (!element) continue;

    if (element.getBoundingClientRect().top <= activeLine) {
      active = id;
      continue;
    }

    break;
  }

  return active;
}

/** Resolve active heading from intersection state, falling back to scroll position. */
export function resolveActiveHeading(
  ids: readonly string[],
  intersecting: ReadonlyMap<string, boolean>,
  scrollContainer: HTMLElement | null,
): string | null {
  const visible = ids.filter((id) => intersecting.get(id));
  if (visible.length > 0) {
    return visible[visible.length - 1] ?? null;
  }

  return pickActiveHeadingByPosition(ids, scrollContainer);
}

export type TocSpyOptions = {
  contentRoot: ParentNode;
  headingSelector?: string;
  minHeadings?: number;
  headerOffset?: number;
  onHeadingsChange?: (headings: TocHeading[]) => void;
  onActiveChange?: (activeId: string | null) => void;
};

/** Observe headings inside a content root and report active section changes. */
export function createTocSpy({
  contentRoot,
  headingSelector = 'h2[id], h3[id]',
  minHeadings = 2,
  headerOffset = TOC_HEADER_OFFSET,
  onHeadingsChange,
  onActiveChange,
}: TocSpyOptions): () => void {
  const scrollContainer =
    contentRoot instanceof HTMLElement ? findScrollContainer(contentRoot) : null;

  let observer: IntersectionObserver | null = null;
  let removeScrollListener: (() => void) | null = null;
  let headingSignature = '';
  let activeId: string | null = null;
  let headings: TocHeading[] = [];

  const setActive = (id: string | null) => {
    if (activeId === id) return;
    activeId = id;
    onActiveChange?.(id);
  };

  const observeHeadings = (ids: string[]) => {
    observer?.disconnect();
    removeScrollListener?.();
    removeScrollListener = null;

    if (ids.length === 0) {
      setActive(null);
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (elements.length === 0) {
      setActive(null);
      return;
    }

    const intersecting = new Map<string, boolean>();
    for (const id of ids) intersecting.set(id, false);

    const updateActive = () => {
      setActive(resolveActiveHeading(ids, intersecting, scrollContainer));
    };

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          intersecting.set(entry.target.id, entry.isIntersecting);
        }
        updateActive();
      },
      {
        root: scrollContainer,
        rootMargin: `-${headerOffset}px 0px -70% 0px`,
        threshold: 0,
      },
    );

    for (const element of elements) observer.observe(element);

    const onScroll = () => updateActive();
    const scrollTarget = scrollContainer ?? document;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    removeScrollListener = () => scrollTarget.removeEventListener('scroll', onScroll);

    updateActive();
  };

  const rebuild = () => {
    headings = collectArticleHeadings(contentRoot, headingSelector);
    const signature = headings.map((heading) => heading.id).join('\0');

    if (headings.length < minHeadings) {
      if (headingSignature !== '') {
        headingSignature = '';
        onHeadingsChange?.([]);
        observer?.disconnect();
        removeScrollListener?.();
        removeScrollListener = null;
        setActive(null);
      }
      return;
    }

    if (signature !== headingSignature) {
      headingSignature = signature;
      onHeadingsChange?.(headings);
      observeHeadings(headings.map((heading) => heading.id));
    }
  };

  rebuild();

  const mutationObserver = new MutationObserver(() => rebuild());
  mutationObserver.observe(contentRoot, { childList: true, subtree: true });

  return () => {
    observer?.disconnect();
    removeScrollListener?.();
    mutationObserver.disconnect();
  };
}
