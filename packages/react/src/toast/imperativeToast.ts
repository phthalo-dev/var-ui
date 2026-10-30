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

function showToast(content: ToastShowInput): string {
  if (!activeQueue) {
    warnNoProvider();
    return '';
  }
  const { durationMs = DEFAULT_TOAST_DURATION, ...data } = content;
  return activeQueue.add(data, {
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

export const toast: ImperativeToast & ((content: ToastShowInput) => string) = Object.assign(
  showToast,
  {
    show: showToast,
    dismiss: (id: string) => {
      activeQueue?.close(id);
    },
    hide: (id: string) => {
      activeQueue?.close(id);
    },
    dismissAll: () => {
      activeQueue?.clear();
    },
    update: (id: string, patch: Partial<ToastContentData>) =>
      activeQueue?.update(id, patch) ?? false,
  },
);
