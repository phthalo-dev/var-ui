import { UNSTABLE_ToastQueue } from 'react-aria-components';
import type { ToastContentData } from './types';

type QueueItem = {
  key: string;
  content: ToastContentData;
};

type QueueInternals = {
  queue: QueueItem[];
  maxVisibleToasts: number;
  updateVisibleToasts: (action: string) => void;
};

/** Toast queue with `update()` support for imperative notifications. */
export class ToastQueue extends UNSTABLE_ToastQueue<ToastContentData> {
  /** Changes how many toasts are visible at once without dropping any queued toast. */
  setMaxVisible(max: number): void {
    const internal = this as unknown as QueueInternals;
    if (internal.maxVisibleToasts === max) return;
    internal.maxVisibleToasts = max;
    internal.updateVisibleToasts('update');
  }

  /** Merges `patch` into an existing toast and re-renders the region. Returns false when `id` is missing. */
  update(key: string, patch: Partial<ToastContentData>): boolean {
    const internal = this as unknown as QueueInternals;
    const item = internal.queue.find((toast) => toast.key === key);
    if (!item) return false;
    item.content = { ...item.content, ...patch };
    internal.updateVisibleToasts('update');
    return true;
  }
}

/**
 * A static, timer-free queue holding `toasts` as visible. Rendered by `ToastRegion` for the
 * duration of the exit transition after the live queue has emptied.
 */
export function frozenToastQueue(toasts: ToastQueue['visibleToasts']): ToastQueue {
  const frozen = new ToastQueue();
  const internal = frozen as unknown as QueueInternals & { visibleToasts: unknown };
  const copy = toasts.map((toast) => ({ ...toast, timer: undefined }));
  internal.queue = copy as unknown as QueueItem[];
  internal.visibleToasts = copy;
  return frozen;
}
