/**
 * Clipboard plumbing shared by `CopyButton` and `CodeBlock`: one write helper and one pair of
 * result events, so an app can toast or log every copy on the page with one listener.
 */

/** Fired on the copy button after a successful copy; bubbles. `detail: { value }`. */
export const COPIED_EVENT = 'var-ui:copied';
/** Fired on the copy button when the clipboard write fails; bubbles. `detail: { value }`. */
export const COPY_ERROR_EVENT = 'var-ui:copy-error';

export type CopyEventDetail = { value: string };

/** Milliseconds before a copy button returns to its idle state. Same as React's `useCopy`. */
export const DEFAULT_COPY_TIMEOUT_MS = 2000;

/** Writes `text` to the clipboard; `false` when the write is refused. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Dispatches {@link COPIED_EVENT} or {@link COPY_ERROR_EVENT} from `target`. */
export function dispatchCopyResult(target: EventTarget, ok: boolean, value: string): void {
  target.dispatchEvent(
    new CustomEvent<CopyEventDetail>(ok ? COPIED_EVENT : COPY_ERROR_EVENT, {
      bubbles: true,
      detail: { value },
    }),
  );
}

/** Reads a button's `data-timeout`, falling back to {@link DEFAULT_COPY_TIMEOUT_MS}. */
export function copyTimeout(btn: HTMLElement): number {
  return Number(btn.getAttribute('data-timeout')) || DEFAULT_COPY_TIMEOUT_MS;
}
