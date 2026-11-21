import { positionTabsIndicator } from '@var-ui/core/components/indicators/tabs';

export function createTabsController(root: HTMLElement): void {
  if (root.hasAttribute('data-var-ui-tabs-initialized')) return;
  root.setAttribute('data-var-ui-tabs-initialized', '');

  const tablistEl = root.querySelector('[role="tablist"]');
  if (!(tablistEl instanceof HTMLElement)) return;
  const tablist = tablistEl;

  const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));

  /**
   * The panel a tab controls, by `aria-controls` anywhere in the document: panels may live in a
   * different layout region from the tab list (`<Tabs panels={false}>` + `<TabPanel>`, #197).
   */
  function getPanelForTab(tab: HTMLElement): HTMLElement | null {
    const panelId = tab.getAttribute('aria-controls');
    if (!panelId) return null;
    const panel = root.ownerDocument.getElementById(panelId);
    return panel?.getAttribute('role') === 'tabpanel' ? panel : null;
  }

  function positionIndicator(): void {
    const activeTab = tablist.querySelector('[role="tab"][aria-selected="true"]');
    if (!(activeTab instanceof HTMLElement)) return;
    positionTabsIndicator(tablist, activeTab);
  }

  function selectTab(tab: HTMLElement): void {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute('aria-selected', selected ? 'true' : 'false');
      candidate.tabIndex = selected ? 0 : -1;
      if (selected) {
        candidate.setAttribute('data-selected', '');
      } else {
        candidate.removeAttribute('data-selected');
      }

      const panel = getPanelForTab(candidate);
      if (!panel) return;
      if (selected) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    positionIndicator();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectTab(tab);
    });
  });

  tablist.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.getAttribute('role') !== 'tab') return;

    const currentIndex = tabs.indexOf(event.target);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    // Arrow keys follow the reading direction: in RTL, ArrowLeft moves to the next tab.
    const direction =
      getComputedStyle(tablist).direction || tablist.closest('[dir]')?.getAttribute('dir');
    const rtl = direction === 'rtl';
    const key =
      rtl && event.key === 'ArrowLeft'
        ? 'ArrowRight'
        : rtl && event.key === 'ArrowRight'
          ? 'ArrowLeft'
          : event.key;
    switch (key) {
      case 'ArrowLeft':
        nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    selectTab(nextTab);
    nextTab.focus();
  });

  positionIndicator();
}
