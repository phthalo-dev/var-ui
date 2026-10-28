import {
  filterCommandPaletteItems,
  flattenCommandPaletteGroups,
  groupCommandPaletteResults,
  moveCommandPaletteActiveIndex,
  type CommandPaletteItem,
} from './commandPaletteUtils';

const ROOT_SELECTOR = '[data-var-ui-command-palette-root]';
const INITIALIZED_ATTR = 'data-var-ui-command-palette-initialized';

function parseItems(root: HTMLElement): CommandPaletteItem[] {
  const script = root.querySelector<HTMLScriptElement>('script[data-var-ui-command-palette-items]');
  if (!script?.textContent) return [];
  try {
    const parsed: unknown = JSON.parse(script.textContent);
    return Array.isArray(parsed) ? (parsed as CommandPaletteItem[]) : [];
  } catch {
    return [];
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", '&#39;');
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export type CommandPaletteController = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const controllers = new WeakMap<HTMLElement, CommandPaletteController>();

export function getCommandPaletteController(element: Element): CommandPaletteController | null {
  const root = element.closest(ROOT_SELECTOR);
  if (!root) return null;
  return controllers.get(root as HTMLElement) ?? null;
}

export function initCommandPalette(root: HTMLElement): () => void {
  if (root.hasAttribute(INITIALIZED_ATTR)) {
    return () => {};
  }
  root.setAttribute(INITIALIZED_ATTR, '');

  const dialogEl = root.querySelector<HTMLDialogElement>('[data-var-ui-command-palette-dialog]');
  const panelEl = root.querySelector<HTMLElement>('[data-var-ui-command-palette-panel]');
  const inputEl = root.querySelector<HTMLInputElement>('[data-var-ui-command-palette-input]');
  const resultsEl = root.querySelector<HTMLElement>('[data-var-ui-command-palette-results]');
  if (!dialogEl || !panelEl || !inputEl || !resultsEl) {
    return () => {};
  }

  const dialog: HTMLDialogElement = dialogEl;
  const panel: HTMLElement = panelEl;
  const input: HTMLInputElement = inputEl;
  const results: HTMLElement = resultsEl;

  const index = parseItems(root);
  let activeIndex = -1;
  let flatItems: CommandPaletteItem[] = [];

  const resultLinkClass = root.dataset.classResultLink ?? 'var-ui-command-palette__resultLink';
  const resultLinkActiveClass =
    root.dataset.classResultLinkActive ?? 'var-ui-command-palette__resultLinkActive';
  const resultBodyClass = root.dataset.classResultBody ?? 'var-ui-command-palette__resultBody';
  const resultTitleClass = root.dataset.classResultTitle ?? 'var-ui-command-palette__resultTitle';
  const resultMetaClass = root.dataset.classResultMeta ?? 'var-ui-command-palette__resultMeta';
  const emptyClass = root.dataset.classEmpty ?? 'var-ui-command-palette__empty';
  const groupClass = root.dataset.classGroup ?? 'var-ui-command-palette__group';
  const groupLabelClass = root.dataset.classGroupLabel ?? 'var-ui-command-palette__groupLabel';
  const paletteId = root.id || root.dataset.commandPaletteId || '';

  function setOpen(open: boolean): void {
    if (open) {
      if (!dialog.open) dialog.showModal();
      panel.setAttribute('data-open', '');
      input.value = '';
      render('');
      queueMicrotask(() => input.focus());
      syncTriggerState(true);
    } else if (dialog.open) {
      panel.removeAttribute('data-open');
      dialog.close();
      syncTriggerState(false);
    }
  }

  function syncTriggerState(open: boolean): void {
    input.setAttribute('aria-expanded', String(open));
    if (!paletteId) return;
    document
      .querySelectorAll(`[data-command-palette="${paletteId}"] [data-var-ui-search-input-trigger]`)
      .forEach((trigger) => trigger.setAttribute('aria-expanded', String(open)));
  }

  function render(query: string): void {
    const filtered = filterCommandPaletteItems(index, query);
    const groups = groupCommandPaletteResults(filtered);
    flatItems = flattenCommandPaletteGroups(groups);
    activeIndex = flatItems.length > 0 ? 0 : -1;

    if (groups.length === 0 || flatItems.length === 0) {
      results.innerHTML = `<p class="${emptyClass}" data-var-ui-command-palette-empty>No results</p>`;
      return;
    }

    let flatIdx = 0;
    results.innerHTML = groups
      .map((group) => {
        const itemsHtml = group.items
          .map((item) => {
            const optionIndex = flatIdx++;
            const active = optionIndex === activeIndex ? ` ${resultLinkActiveClass}` : '';
            const meta = item.meta
              ? `<span class="${resultMetaClass}">${escapeHtml(item.meta)}</span>`
              : '';
            return `<a
                class="${resultLinkClass}${active}"
                href="${escapeAttr(item.id)}"
                role="option"
                data-var-ui-command-palette-item
                data-index="${optionIndex}"
                id="var-ui-command-palette-option-${paletteId || 'default'}-${optionIndex}"
              ><span class="${resultBodyClass}"><span class="${resultTitleClass}">${escapeHtml(item.title)}</span>${meta}</span></a>`;
          })
          .join('');

        if (!group.label) {
          return `<div class="${groupClass}" data-group="${escapeAttr(group.id)}">${itemsHtml}</div>`;
        }

        return `<section class="${groupClass}" data-group="${escapeAttr(group.id)}">
            <h2 class="${groupLabelClass}">${escapeHtml(group.label)}</h2>
            <div role="group" aria-label="${escapeAttr(group.label)}">${itemsHtml}</div>
          </section>`;
      })
      .join('');

    syncActive();
  }

  function syncActive(): void {
    results.querySelectorAll<HTMLElement>('[data-var-ui-command-palette-item]').forEach((el) => {
      const idx = Number(el.dataset.index);
      const isActive = idx === activeIndex;
      el.classList.toggle(resultLinkActiveClass, isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    input.setAttribute(
      'aria-activedescendant',
      activeIndex >= 0
        ? `var-ui-command-palette-option-${paletteId || 'default'}-${activeIndex}`
        : '',
    );
    results.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView?.({ block: 'nearest' });
  }

  function activate(direction: 'up' | 'down'): void {
    activeIndex = moveCommandPaletteActiveIndex(activeIndex, flatItems.length, direction);
    syncActive();
  }

  function selectActive(): void {
    const link = results.querySelector<HTMLAnchorElement>(`[data-index="${activeIndex}"]`);
    if (!link) return;
    setOpen(false);
    link.click();
  }

  const controller: CommandPaletteController = {
    get isOpen() {
      return dialog.open;
    },
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!dialog.open),
  };

  controllers.set(root, controller);

  dialog.addEventListener('close', () => {
    panel.removeAttribute('data-open');
    activeIndex = -1;
    flatItems = [];
    syncTriggerState(false);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) setOpen(false);
  });

  input.addEventListener('input', () => {
    render(input.value);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activate('down');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activate('up');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectActive();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  });

  results.addEventListener('mousemove', (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      '[data-var-ui-command-palette-item]',
    );
    if (!target || !results.contains(target)) return;
    const idx = Number(target.dataset.index);
    if (!Number.isFinite(idx) || idx === activeIndex) return;
    activeIndex = idx;
    syncActive();
  });

  const hotkey = root.dataset.hotkey !== 'false';
  if (hotkey) {
    const handleHotkey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        if (isEditableTarget(event.target) && !dialog.open) return;
        event.preventDefault();
        setOpen(!dialog.open);
      }
    };
    window.addEventListener('keydown', handleHotkey);
    return () => {
      controllers.delete(root);
      window.removeEventListener('keydown', handleHotkey);
    };
  }

  return () => {
    controllers.delete(root);
  };
}

export function initCommandPalettes(): void {
  document.querySelectorAll(ROOT_SELECTOR).forEach((node) => {
    if (node instanceof HTMLElement) initCommandPalette(node);
  });
}
