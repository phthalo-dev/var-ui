import { isPopoverShowing } from '../overlays/usePopoverElement';

/**
 * Toast regions are `popover="manual"` and the top layer stacks by insertion order, so a modal
 * `<dialog>` opened after the region paints (and its backdrop covers) the toasts. Re-promoting a
 * region (`hidePopover(); showPopover()`) moves it to the top of the stack. One shared document
 * observer watches every dialog's `open` attribute (set by `showModal()`/`show()`) and re-promotes
 * every registered region when a dialog opens. Toasts end up above the modal but inert (not
 * clickable) while it is open, which is a platform limit of anything outside the dialog.
 */
const regions = new Set<HTMLElement>();
let observer: MutationObserver | null = null;

/** Moves a showing region to the top of the top layer. */
export function repromote(el: HTMLElement): void {
  if (!isPopoverShowing(el)) return;
  el.hidePopover();
  el.showPopover();
}

function onMutations(records: MutationRecord[]): void {
  const opened = records.some(
    (r) => r.target instanceof HTMLDialogElement && (r.target as HTMLDialogElement).open,
  );
  if (opened) regions.forEach(repromote);
}

/** Keeps `el` above any dialog that opens later. Returns the unsubscribe function. */
export function keepOnTop(el: HTMLElement): () => void {
  if (typeof MutationObserver === 'undefined') return () => {};
  regions.add(el);
  if (!observer) {
    observer = new MutationObserver(onMutations);
    observer.observe(document, { subtree: true, attributes: true, attributeFilter: ['open'] });
  }
  return () => {
    regions.delete(el);
    if (regions.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}
