import {
  layoutBreakpointQueries,
  type LayoutBreakpoint,
} from '@var-ui/core/components/breakpoints';

/** Fired on the panel when its responsive open state changes (`event.detail.open`). */
export const LAYOUT_PANEL_OPEN_CHANGE_EVENT = 'var-ui:layout-panel-open-change';

type Controller = { readonly open: boolean; setOpen: (open: boolean) => void };
const controllers = new WeakMap<HTMLElement, Controller>();

/** The controller of a responsive `LayoutPanel` (the element with `data-var-ui-layout-panel`). */
function controllerFor(panel: Element | null): Controller | undefined {
  return panel instanceof HTMLElement ? controllers.get(panel) : undefined;
}

/**
 * Opens or closes a responsive `LayoutPanel` below its breakpoint: `hidden` mode shows it in
 * place, `overlay` mode moves it into its `<dialog>` drawer and opens that modally. Above the
 * breakpoint the panel is always shown inline and this only records the state.
 */
export function setLayoutPanelOpen(panel: Element, open: boolean): void {
  controllerFor(panel)?.setOpen(open);
}

/** Toggles a responsive `LayoutPanel`. */
export function toggleLayoutPanel(panel: Element): void {
  const controller = controllerFor(panel);
  controller?.setOpen(!controller.open);
}

export function initLayoutPanel(panel: HTMLElement): () => void {
  if (controllers.has(panel)) return () => {};
  const mode = panel.dataset.responsive;
  const below = panel.dataset.responsiveBelow as LayoutBreakpoint | undefined;
  if ((mode !== 'overlay' && mode !== 'hidden') || !below) return () => {};

  const mql = window.matchMedia(layoutBreakpointQueries[below]);
  const popup = mode === 'overlay' ? panel.nextElementSibling : null;
  const dialog = popup instanceof HTMLDialogElement ? popup : null;
  const body = dialog?.firstElementChild ?? null;
  // Where the panel goes back to when the drawer closes.
  const placeholder = document.createComment('layout-panel');
  let open = panel.hasAttribute('data-open');

  const syncToggles = () => {
    if (!panel.id) return;
    document
      .querySelectorAll<HTMLElement>(
        `[data-var-ui-layout-panel-toggle][aria-controls="${panel.id}"]`,
      )
      .forEach((toggle) => toggle.setAttribute('aria-expanded', String(open && mql.matches)));
  };

  const render = () => {
    panel.toggleAttribute('data-open', open);
    if (!dialog || !body) return;
    const inDrawer = open && mql.matches;
    if (inDrawer && panel.parentElement !== body) {
      panel.before(placeholder);
      body.append(panel);
      if (!dialog.open) dialog.showModal();
    } else if (!inDrawer && panel.parentElement === body) {
      if (dialog.open) dialog.close();
      placeholder.replaceWith(panel);
    }
  };

  const controller: Controller = {
    get open() {
      return open;
    },
    setOpen(next) {
      if (next === open) return;
      open = next;
      render();
      syncToggles();
      panel.dispatchEvent(
        new CustomEvent(LAYOUT_PANEL_OPEN_CHANGE_EVENT, { detail: { open }, bubbles: true }),
      );
    },
  };
  controllers.set(panel, controller);

  // Escape, the backdrop (light dismiss) and `form[method=dialog]` close the native dialog.
  const onDialogClose = () => controller.setOpen(false);
  const onBackdropClick = (event: MouseEvent) => {
    if (event.target === dialog) controller.setOpen(false);
  };
  // Crossing the breakpoint while open: put the panel back inline (or into the drawer).
  const onChange = () => {
    render();
    syncToggles();
  };
  dialog?.addEventListener('close', onDialogClose);
  dialog?.addEventListener('click', onBackdropClick);
  mql.addEventListener('change', onChange);
  render();
  syncToggles();

  return () => {
    controllers.delete(panel);
    dialog?.removeEventListener('close', onDialogClose);
    dialog?.removeEventListener('click', onBackdropClick);
    mql.removeEventListener('change', onChange);
  };
}

/** Buttons with `data-var-ui-layout-panel-toggle` and `aria-controls="<panel id>"`. */
function onToggleClick(event: MouseEvent): void {
  const toggle = (event.target as Element | null)?.closest?.('[data-var-ui-layout-panel-toggle]');
  const id = toggle?.getAttribute('aria-controls');
  if (!id) return;
  const panel = document.getElementById(id);
  if (panel) toggleLayoutPanel(panel);
}

let delegated = false;

export function initLayoutPanels(): void {
  document
    .querySelectorAll<HTMLElement>('[data-var-ui-layout-panel][data-responsive]')
    .forEach((panel) => initLayoutPanel(panel));
  if (!delegated) {
    delegated = true;
    document.addEventListener('click', onToggleClick);
  }
}
