import type { Tone } from '@var-ui/core';
import { svg as closeSvg } from '@var-ui/icons/glyphs/close';
import { svg as errorSvg } from '@var-ui/icons/glyphs/error';
import { svg as infoSvg } from '@var-ui/icons/glyphs/info';
import { svg as successSvg } from '@var-ui/icons/glyphs/success';
import { svg as warningSvg } from '@var-ui/icons/glyphs/warning';

export type ToastShowInput = {
  title: string;
  description?: string;
  tone?: Tone;
  /** Auto-dismiss delay in ms. Pass `0` to disable. @default 4000 */
  durationMs?: number;
};

export type ToastController = {
  show: (content: ToastShowInput) => string;
  dismiss: (id: string) => void;
  hide: (id: string) => void;
  update: (id: string, patch: Partial<ToastShowInput>) => boolean;
  dismissAll: () => void;
};

type ToastEntry = {
  id: string;
  el: HTMLElement;
  timer?: ReturnType<typeof setTimeout>;
};

const ROOT_SELECTOR = '[data-var-ui-toast-region]';
const INITIALIZED_ATTR = 'data-var-ui-toast-region-initialized';
const DEFAULT_DURATION = 4000;

const toneIcon: Record<Tone, string> = {
  neutral: infoSvg,
  accent: infoSvg,
  info: infoSvg,
  success: successSvg,
  warning: warningSvg,
  danger: errorSvg,
};

const controllers = new WeakMap<HTMLElement, ToastController>();
let defaultRegion: HTMLElement | null = null;

function clearDefaultRegionIfDetached(): void {
  if (defaultRegion && !defaultRegion.isConnected) {
    defaultRegion = null;
  }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `_${Math.random().toString(36).slice(2)}`;
}

function applyDataTone(el: HTMLElement, tone: Tone, appearance = 'subtle'): void {
  el.setAttribute('data-tone', tone);
  el.setAttribute('data-appearance', appearance);
}

function createToastElement(
  id: string,
  content: ToastShowInput,
  onDismiss: (toastId: string) => void,
): HTMLElement {
  const tone = content.tone ?? 'info';
  const appearance = 'subtle';

  const item = document.createElement('div');
  item.className = 'var-ui-toast__item';
  applyDataTone(item, tone, appearance);
  item.setAttribute('role', 'status');
  item.setAttribute('data-toast-id', id);

  const icon = document.createElement('span');
  icon.className = 'var-ui-toast__icon';
  applyDataTone(icon, tone, appearance);
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = toneIcon[tone];

  const body = document.createElement('div');
  body.className = 'var-ui-toast__body';
  applyDataTone(body, tone, appearance);

  const title = document.createElement('div');
  title.className = 'var-ui-toast__title';
  applyDataTone(title, tone, appearance);
  title.textContent = content.title;

  body.append(title);

  if (content.description) {
    const description = document.createElement('div');
    description.className = 'var-ui-toast__description';
    applyDataTone(description, tone, appearance);
    description.textContent = content.description;
    body.append(description);
  }

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'var-ui-toast__close';
  applyDataTone(close, tone, appearance);
  close.setAttribute('aria-label', 'Dismiss');
  close.innerHTML = closeSvg;
  close.addEventListener('click', () => onDismiss(id));

  item.append(icon, body, close);
  return item;
}

function updateToastElement(el: HTMLElement, patch: Partial<ToastShowInput>): void {
  const tone = patch.tone ?? (el.getAttribute('data-tone') as Tone | null) ?? 'info';
  const appearance = 'subtle';

  applyDataTone(el, tone, appearance);
  el.querySelectorAll<HTMLElement>('[data-tone]').forEach((node) => {
    if (node !== el) applyDataTone(node, tone, appearance);
  });

  if (patch.tone) {
    const icon = el.querySelector<HTMLElement>('.var-ui-toast__icon');
    if (icon) icon.innerHTML = toneIcon[tone];
  }

  if (patch.title !== undefined) {
    const title = el.querySelector<HTMLElement>('.var-ui-toast__title');
    if (title) title.textContent = patch.title;
  }

  if (patch.description !== undefined) {
    const body = el.querySelector<HTMLElement>('.var-ui-toast__body');
    if (!body) return;

    let description = body.querySelector<HTMLElement>('.var-ui-toast__description');
    if (patch.description) {
      if (!description) {
        description = document.createElement('div');
        description.className = 'var-ui-toast__description';
        body.append(description);
      }
      applyDataTone(description, tone, appearance);
      description.textContent = patch.description;
    } else {
      description?.remove();
    }
  }
}

function createToastController(root: HTMLElement): ToastController {
  const maxVisible = Number(root.dataset.maxVisible ?? 3);
  const queue: ToastEntry[] = [];

  function render(): void {
    root.replaceChildren(...queue.slice(0, maxVisible).map((entry) => entry.el));
  }

  function dismiss(id: string): void {
    const index = queue.findIndex((entry) => entry.id === id);
    if (index === -1) return;
    const [removed] = queue.splice(index, 1);
    if (removed.timer) clearTimeout(removed.timer);
    render();
  }

  function show(content: ToastShowInput): string {
    const id = createId();
    const el = createToastElement(id, content, dismiss);
    const entry: ToastEntry = { id, el };
    const durationMs = content.durationMs ?? DEFAULT_DURATION;
    if (durationMs !== 0) {
      entry.timer = setTimeout(() => dismiss(id), durationMs);
    }
    queue.unshift(entry);
    render();
    return id;
  }

  function update(id: string, patch: Partial<ToastShowInput>): boolean {
    const entry = queue.find((item) => item.id === id);
    if (!entry) return false;
    updateToastElement(entry.el, patch);
    if (patch.durationMs !== undefined) {
      if (entry.timer) clearTimeout(entry.timer);
      if (patch.durationMs !== 0) {
        entry.timer = setTimeout(() => dismiss(id), patch.durationMs);
      } else {
        entry.timer = undefined;
      }
    }
    return true;
  }

  function dismissAll(): void {
    queue.splice(0).forEach((entry) => {
      if (entry.timer) clearTimeout(entry.timer);
    });
    render();
  }

  return {
    show,
    dismiss,
    hide: dismiss,
    update,
    dismissAll,
  };
}

export function initToastRegion(root: HTMLElement): ToastController {
  if (controllers.has(root)) {
    return controllers.get(root)!;
  }

  root.setAttribute(INITIALIZED_ATTR, '');
  const controller = createToastController(root);
  controllers.set(root, controller);
  if (!defaultRegion) {
    defaultRegion = root;
  }
  return controller;
}

export function initToastRegions(root: ParentNode = document): void {
  root.querySelectorAll(ROOT_SELECTOR).forEach((node) => {
    if (node instanceof HTMLElement) {
      initToastRegion(node);
    }
  });
}

export function getToastController(element: Element): ToastController | null {
  const region = element.closest(ROOT_SELECTOR);
  if (!(region instanceof HTMLElement)) return null;
  return controllers.get(region) ?? null;
}

function getDefaultController(): ToastController | null {
  clearDefaultRegionIfDetached();

  if (defaultRegion && controllers.has(defaultRegion)) {
    return controllers.get(defaultRegion)!;
  }

  const region = document.querySelector(ROOT_SELECTOR);
  if (region instanceof HTMLElement) {
    return initToastRegion(region);
  }

  return null;
}

function ensureDefaultRegion(): ToastController {
  clearDefaultRegionIfDetached();
  const existing = getDefaultController();
  if (existing) return existing;

  const region = document.createElement('div');
  region.className = 'var-ui-toast__region';
  region.setAttribute('data-var-ui-toast-region', '');
  region.setAttribute('data-placement', 'bottom-end');
  region.setAttribute('data-max-visible', '3');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-relevant', 'additions');
  document.body.append(region);
  return initToastRegion(region);
}

function showToast(content: ToastShowInput): string {
  return ensureDefaultRegion().show(content);
}

export const toast: ToastController & ((content: ToastShowInput) => string) = Object.assign(
  showToast,
  {
    show: showToast,
    dismiss: (id: string) => ensureDefaultRegion().dismiss(id),
    hide: (id: string) => ensureDefaultRegion().hide(id),
    update: (id: string, patch: Partial<ToastShowInput>) => ensureDefaultRegion().update(id, patch),
    dismissAll: () => ensureDefaultRegion().dismissAll(),
  },
);
