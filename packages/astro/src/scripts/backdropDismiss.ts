/**
 * A backdrop press on a native `<dialog>`: `pointerdown` and `click` both land on the dialog
 * itself, outside its border box. Requiring both means a drag that starts in the content and
 * ends on the backdrop does not dismiss (padding and empty sheet space are content).
 */
export function isBackdropTarget(dialog: HTMLElement, event: Event): boolean {
  if (event.target !== dialog || !('clientX' in event)) return false;
  const { clientX, clientY } = event as MouseEvent;
  const rect = dialog.getBoundingClientRect();
  const inside =
    rect.width > 0 &&
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom;
  return !inside;
}

/** Listen for a backdrop press. Returns the cleanup. */
export function bindBackdropDismiss(dialog: HTMLElement, onDismiss: () => void): () => void {
  let pressedBackdrop = false;
  const onPointerDown = (event: PointerEvent) => {
    pressedBackdrop = isBackdropTarget(dialog, event);
  };
  const onClick = (event: MouseEvent) => {
    const pressed = pressedBackdrop;
    pressedBackdrop = false;
    if (pressed && isBackdropTarget(dialog, event)) onDismiss();
  };
  dialog.addEventListener('pointerdown', onPointerDown);
  dialog.addEventListener('click', onClick);
  return () => {
    dialog.removeEventListener('pointerdown', onPointerDown);
    dialog.removeEventListener('click', onClick);
  };
}
