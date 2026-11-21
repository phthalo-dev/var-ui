import type { ToastQueue } from './toastQueue';
import type { ToastContentData } from './types';

/** Auto-dismiss delay shared by `toast()` and `useToast().add`. */
export const DEFAULT_TOAST_DURATION = 4000;

// Module state is only written from `ToastProvider`'s effect, which never runs on the server, so
// server renders (and requests sharing a module instance) never see a queue.
let activeQueue: ToastQueue | null = null;

export function registerToastQueue(queue: ToastQueue): void {
  activeQueue = queue;
}

export function unregisterToastQueue(queue: ToastQueue): void {
  if (activeQueue === queue) {
    activeQueue = null;
  }
}

export type ToastShowInput = ToastContentData & {
  /** Auto-dismiss delay in ms. Pass `0` to disable. @default 4000 */
  durationMs?: number;
};

/**
 * Without a mounted `ToastProvider` (including during SSR) `toast()` does nothing and returns `''`;
 * in development it warns once so a missing provider is not silent. Calls are not queued.
 */
let warned = false;
function warnNoProvider() {
  if (warned || process.env.NODE_ENV === 'production') return;
  warned = true;
  console.warn('toast() was called but no <ToastProvider> is mounted; the toast was dropped.');
}

function showOn(queue: ToastQueue, content: ToastShowInput): string {
  const { durationMs = DEFAULT_TOAST_DURATION, ...data } = content;
  return queue.add(data, {
    timeout: durationMs === 0 ? undefined : durationMs,
  });
}

export type ImperativeToast = {
  /** Enqueues a toast and returns its id. */
  show: (content: ToastShowInput) => string;
  /** Dismisses a toast by id. */
  dismiss: (id: string) => void;
  /** Alias for `dismiss`. */
  hide: (id: string) => void;
  /** Dismisses every queued toast. */
  dismissAll: () => void;
  /** Merges fields into an existing toast. Returns false when the id is not found. */
  update: (id: string, patch: Partial<ToastContentData>) => boolean;
};

export type Toaster = ImperativeToast & ((content: ToastShowInput) => string);

function toaster(getQueue: () => ToastQueue | null): Toaster {
  const show = (content: ToastShowInput) => {
    const queue = getQueue();
    if (!queue) {
      warnNoProvider();
      return '';
    }
    return showOn(queue, content);
  };
  return Object.assign(show, {
    show,
    dismiss: (id: string) => getQueue()?.close(id),
    hide: (id: string) => getQueue()?.close(id),
    dismissAll: () => getQueue()?.clear(),
    update: (id: string, patch: Partial<ToastContentData>) =>
      getQueue()?.update(id, patch) ?? false,
  });
}

/** Imperative toasts on the mounted `ToastProvider`'s queue. */
export const toast: Toaster = toaster(() => activeQueue);

/**
 * The same imperative API bound to a queue you own, for apps that render their own
 * `<ToastRegion queue={…}>` (or several regions):
 *
 * ```ts
 * export const appToasts = new ToastQueue({ maxVisibleToasts: 3 });
 * export const notify = createToaster(appToasts);
 * notify({ title: 'Added to favorites', tone: 'success' });
 * ```
 */
export function createToaster(queue: ToastQueue): Toaster {
  return toaster(() => queue);
}
