import { findTextMatch } from '@var-ui/core/shared/textMatch';
import {
  filterCommandPaletteItems,
  flattenCommandPaletteGroups,
  groupCommandPaletteResults,
  moveCommandPaletteActiveIndex,
  readRecentCommandPaletteIds,
  rememberCommandPaletteId,
  type CommandPaletteClientItem,
  type CommandPaletteGroup,
} from './commandPaletteUtils';
import { bindBackdropDismiss } from './backdropDismiss';

const ROOT_SELECTOR = '[data-var-ui-command-palette-root]';
const INITIALIZED_ATTR = 'data-var-ui-command-palette-initialized';

function parseItems(root: HTMLElement): CommandPaletteClientItem[] {
  const script = root.querySelector<HTMLScriptElement>('script[data-var-ui-command-palette-items]');
  if (!script?.textContent) return [];
  try {
    const parsed: unknown = JSON.parse(script.textContent);
    return Array.isArray(parsed) ? (parsed as CommandPaletteClientItem[]) : [];
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

/** Escaped `text` with the first match of `query` wrapped in `<mark class>`. */
export function highlightCommandPaletteText(
  text: string,
  query: string,
  markClass: string,
): string {
  const match = findTextMatch(text, query);
  if (!match) return escapeHtml(text);
  const [start, end] = match;
  return `${escapeHtml(text.slice(0, start))}<mark class="${markClass}">${escapeHtml(
    text.slice(start, end),
  )}</mark>${escapeHtml(text.slice(end))}`;
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
  const inputEl = root.querySelector<HTMLInputElement>('[data-var-ui-command-palette-input]');
  const resultsEl = root.querySelector<HTMLElement>('[data-var-ui-command-palette-results]');
  if (!dialogEl || !inputEl || !resultsEl) {
    return () => {};
  }

  const dialog: HTMLDialogElement = dialogEl;
  const input: HTMLInputElement = inputEl;
  const results: HTMLElement = resultsEl;

  const index = parseItems(root);
  let activeIndex = -1;
  let flatItems: CommandPaletteClientItem[] = [];

  const resultLinkClass = root.dataset.classResultLink ?? 'var-ui-command-palette__resultLink';
  const resultLinkActiveClass =
    root.dataset.classResultLinkActive ?? 'var-ui-command-palette__resultLinkActive';
  const resultBodyClass = root.dataset.classResultBody ?? 'var-ui-command-palette__resultBody';
  const resultTitleClass = root.dataset.classResultTitle ?? 'var-ui-command-palette__resultTitle';
  const resultMetaClass = root.dataset.classResultMeta ?? 'var-ui-command-palette__resultMeta';
  const emptyClass = root.dataset.classEmpty ?? 'var-ui-command-palette__empty';
  const emptyIconClass = root.dataset.classEmptyIcon ?? 'var-ui-command-palette__emptyIcon';
  const emptyTitleClass = root.dataset.classEmptyTitle ?? 'var-ui-command-palette__emptyTitle';
  const emptyHintClass = root.dataset.classEmptyHint ?? 'var-ui-command-palette__emptyHint';
  const emptyHint = root.dataset.emptyHint || '';
  const frame = results.parentElement;
  const searchIconSvg =
    root.querySelector('[data-var-ui-command-palette-input-icon]')?.innerHTML ?? '';
  const resultIconClass = root.dataset.classResultIcon ?? 'var-ui-command-palette__resultIcon';
  const markClass = root.dataset.classMark ?? 'var-ui-command-palette__mark';
  const highlight = root.dataset.highlightMatches !== 'false';
  const recentKey = root.dataset.recentKey || '';
  const recentLabel = root.dataset.recentLabel || 'Recent';
  const emptyLabel = root.dataset.emptyLabel || 'No results';
  const groupClass = root.dataset.classGroup ?? 'var-ui-command-palette__group';
  const groupHeadingClass =
    root.dataset.classGroupHeading ?? 'var-ui-command-palette__groupHeading';
  const paletteId = root.id || root.dataset.commandPaletteId || '';

  function setOpen(open: boolean): void {
    if (open) {
      if (!dialog.open) dialog.showModal();
      input.value = '';
      render('');
      queueMicrotask(() => input.focus());
      syncTriggerState(true);
    } else if (dialog.open) {
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

  function recentGroup(query: string): CommandPaletteGroup<CommandPaletteClientItem>[] {
    if (!recentKey || query.trim() !== '') return [];
    const recent = readRecentCommandPaletteIds(recentKey)
      .map((id) => index.find((item) => item.id === id))
      .filter((item): item is CommandPaletteClientItem => item !== undefined);
    // Out of their own section, titles can be ambiguous ("Overview"): the subtitle names it.
    const withSection = recent.map((item) =>
      item.group ? { ...item, meta: [item.group, item.meta].filter(Boolean).join(' · ') } : item,
    );
    return recent.length > 0 ? [{ id: 'recent', label: recentLabel, items: withSection }] : [];
  }

  function render(query: string): void {
    const filtered = filterCommandPaletteItems(index, query);
    const groups = [...recentGroup(query), ...groupCommandPaletteResults(filtered)];
    flatItems = flattenCommandPaletteGroups(groups);
    activeIndex = flatItems.length > 0 ? 0 : -1;

    const empty = groups.length === 0 || flatItems.length === 0;
    frame?.toggleAttribute('data-empty', empty);
    if (empty) {
      const trimmed = query.trim();
      const title = trimmed ? `${emptyLabel} for “${trimmed}”` : emptyLabel;
      const icon = searchIconSvg
        ? `<span class="${emptyIconClass}" aria-hidden="true">${searchIconSvg}</span>`
        : '';
      const hint = emptyHint ? `<p class="${emptyHintClass}">${escapeHtml(emptyHint)}</p>` : '';
      results.innerHTML = `<div class="${emptyClass}" role="status" data-var-ui-command-palette-empty>${icon}<p class="${emptyTitleClass}">${escapeHtml(title)}</p>${hint}</div>`;
      syncActive();
      return;
    }

    const text = (value: string) =>
      highlight ? highlightCommandPaletteText(value, query, markClass) : escapeHtml(value);

    let flatIdx = 0;
    results.innerHTML = groups
      .map((group) => {
        const itemsHtml = group.items
          .map((item) => {
            const optionIndex = flatIdx++;
            const active = optionIndex === activeIndex ? ` ${resultLinkActiveClass}` : '';
            const icon = item.iconSvg
              ? `<span class="${resultIconClass}" aria-hidden="true">${item.iconSvg}</span>`
              : '';
            const meta = item.meta
              ? `<span class="${resultMetaClass}">${text(item.meta)}</span>`
              : '';
            return `<a
                class="${resultLinkClass}${active}"
                href="${escapeAttr(item.id)}"
                role="option"
                data-var-ui-command-palette-item
                data-item-id="${escapeAttr(item.id)}"
                data-index="${optionIndex}"
                id="var-ui-command-palette-option-${paletteId || 'default'}-${optionIndex}"
              >${icon}<span class="${resultBodyClass}"><span class="${resultTitleClass}">${text(item.title)}</span>${meta}</span></a>`;
          })
          .join('');

        if (!group.label) {
          return `<div class="${groupClass}" data-group="${escapeAttr(group.id)}">${itemsHtml}</div>`;
        }

        // The heading is presentational: the group's `aria-label` names it for the listbox.
        return `<div class="${groupClass}" data-group="${escapeAttr(group.id)}">
            <div class="${groupHeadingClass}" role="presentation" aria-hidden="true">${escapeHtml(group.label)}</div>
            <div role="group" aria-label="${escapeAttr(group.label)}">${itemsHtml}</div>
          </div>`;
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
    // No option (e.g. "No results"): drop the reference instead of pointing at a removed node.
    if (activeIndex >= 0) {
      input.setAttribute(
        'aria-activedescendant',
        `var-ui-command-palette-option-${paletteId || 'default'}-${activeIndex}`,
      );
    } else {
      input.removeAttribute('aria-activedescendant');
    }
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

  // Remember chosen results (Enter clicks the link too) for the "Recent" group.
  results.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      '[data-var-ui-command-palette-item]',
    );
    const id = link?.dataset.itemId;
    if (recentKey && id) rememberCommandPaletteId(recentKey, id);
  });

  dialog.addEventListener('close', () => {
    activeIndex = -1;
    flatItems = [];
    syncTriggerState(false);
  });

  const unbindBackdrop = bindBackdropDismiss(dialog, () => setOpen(false));

  root.querySelector('[data-var-ui-command-palette-cancel]')?.addEventListener('click', () => {
    setOpen(false);
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
      unbindBackdrop();
      controllers.delete(root);
      window.removeEventListener('keydown', handleHotkey);
    };
  }

  return () => {
    unbindBackdrop();
    controllers.delete(root);
  };
}

export function initCommandPalettes(): void {
  document.querySelectorAll(ROOT_SELECTOR).forEach((node) => {
    if (node instanceof HTMLElement) initCommandPalette(node);
  });
}
