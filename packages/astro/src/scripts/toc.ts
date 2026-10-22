import { positionTocIndicator } from '@var-ui/core/components/indicators/toc';
import { createTocSpy, type TocHeading } from '@var-ui/core/components/toc/spy';
import { toc } from '@var-ui/core';
import { mergeProps } from '../utils';

const ROOT_SELECTOR = '[data-var-ui-toc]';
const INITIALIZED_ATTR = 'data-var-ui-toc-initialized';

const cleanups = new WeakMap<HTMLElement, () => void>();

function renderTocList(list: HTMLOListElement, headings: TocHeading[]): void {
  const s = toc();
  list.replaceChildren();

  for (const heading of headings) {
    const item = document.createElement('li');
    item.className = mergeProps(s.item).className;
    if (heading.level === 3) item.dataset.nested = '';

    const link = document.createElement('a');
    link.className = mergeProps(s.link).className;
    link.href = `#${heading.id}`;
    link.textContent = heading.text;
    link.dataset.tocLink = heading.id;

    item.append(link);
    list.append(item);
  }
}

export function setActive(list: HTMLOListElement, id: string | null): void {
  let activeLink: HTMLAnchorElement | null = null;

  for (const link of list.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')) {
    const isActive = link.dataset.tocLink === id;
    if (isActive) {
      link.setAttribute('data-selected', '');
      link.setAttribute('aria-current', 'location');
      activeLink = link;
    } else {
      link.removeAttribute('data-selected');
      link.removeAttribute('aria-current');
    }
  }

  positionTocIndicator(list, activeLink);
}

function disposeToc(root: HTMLElement): void {
  const cleanup = cleanups.get(root);
  if (!cleanup) return;
  cleanup();
  cleanups.delete(root);
  root.removeAttribute(INITIALIZED_ATTR);
}

export function initToc(root: HTMLElement): () => void {
  if (root.hasAttribute(INITIALIZED_ATTR)) return () => disposeToc(root);

  const isAuto = root.dataset.auto === 'true' || root.dataset.auto === '';
  if (!isAuto) return () => {};

  const contentSelector = root.dataset.contentSelector;
  const list = root.querySelector<HTMLOListElement>('[data-var-ui-toc-list]');
  if (!contentSelector || !list) return () => {};

  const contentRoot = document.querySelector(contentSelector);
  if (!contentRoot) return () => {};

  const minHeadings = Number.parseInt(root.dataset.minHeadings ?? '2', 10);
  const headerOffset = root.dataset.headerOffset
    ? Number.parseInt(root.dataset.headerOffset, 10)
    : undefined;
  const headingSelector = root.dataset.headingSelector;

  root.setAttribute(INITIALIZED_ATTR, '');

  const cleanup = createTocSpy({
    contentRoot,
    headingSelector,
    minHeadings,
    headerOffset,
    onHeadingsChange: (headings) => {
      if (headings.length < minHeadings) {
        root.hidden = true;
        list.replaceChildren();
        setActive(list, null);
        return;
      }

      root.hidden = false;
      renderTocList(list, headings);
    },
    onActiveChange: (activeId) => {
      setActive(list, activeId);
    },
  });

  cleanups.set(root, cleanup);

  return () => disposeToc(root);
}

export function initTocs(): void {
  document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
    if (root.hasAttribute(INITIALIZED_ATTR)) return;
    initToc(root);
  });
}
