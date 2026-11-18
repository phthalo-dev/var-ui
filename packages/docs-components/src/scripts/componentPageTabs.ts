import { createTabsController } from '../../../astro/src/scripts/tabs';

const INITIALIZED_ATTR = 'data-component-doc-tabs-initialized';

function getTabIds(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[role="tab"]')).map((tab) =>
    tab.id.replace(/^tab-/, ''),
  );
}

function parseTab(value: string | null | undefined, available: string[]): string {
  const normalized = value?.trim().toLowerCase();
  return normalized && available.includes(normalized) ? normalized : 'documentation';
}

function tabIdFromLocation(root: HTMLElement): string {
  const available = getTabIds(root);
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('tab');
  if (fromQuery) return parseTab(fromQuery, available);
  const fromHash = window.location.hash.replace(/^#/, '');
  return parseTab(fromHash, available);
}

function selectTabById(root: HTMLElement, tabId: string): void {
  const tab = root.querySelector<HTMLElement>(`[role="tab"]#tab-${tabId}`);
  if (!tab) return;
  tab.click();
}

function syncLocation(tabId: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', tabId);
  url.hash = '';
  window.history.replaceState({}, '', url);
}

function syncTocVisibility(root: HTMLElement): void {
  const docPanel = root.querySelector<HTMLElement>('#panel-documentation');
  // The page TOC rail lives in the DocsPage frame; it only tracks the Documentation panel.
  const toc = document.querySelector<HTMLElement>('[data-docs-toc-slot]');
  if (!docPanel || !toc) return;

  if (docPanel.hasAttribute('hidden')) {
    toc.setAttribute('hidden', '');
  } else {
    toc.removeAttribute('hidden');
  }
}

export function initComponentDocTabs(): void {
  document.querySelectorAll<HTMLElement>('[data-component-doc-tabs]').forEach((root) => {
    if (root.hasAttribute(INITIALIZED_ATTR)) return;
    root.setAttribute(INITIALIZED_ATTR, '');

    createTabsController(root);

    const availableTabs = getTabIds(root);
    const initialTab = tabIdFromLocation(root);
    if (initialTab !== 'documentation') {
      requestAnimationFrame(() => {
        selectTabById(root, initialTab);
        syncTocVisibility(root);
      });
    } else {
      syncTocVisibility(root);
    }

    root.querySelectorAll<HTMLElement>('[role="tab"]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabId = tab.id.replace(/^tab-/, '');
        if (availableTabs.includes(tabId)) {
          syncLocation(tabId);
        }
        requestAnimationFrame(() => syncTocVisibility(root));
      });
    });

    const tablist = root.querySelector('[role="tablist"]');
    tablist?.addEventListener('keydown', () => {
      requestAnimationFrame(() => syncTocVisibility(root));
    });
  });
}

function onPageLoad(): void {
  initComponentDocTabs();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
