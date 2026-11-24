import {
  observeSegmentedControlIndicator,
  syncSegmentedControlIndicator,
} from '@var-ui/core/components/indicators/segmented-control';

/**
 * Event dispatched (bubbling) from the control root after the user changes the selection.
 * `event.detail.id` holds the selected segment's `data-var-ui-segment-id` value (the option's
 * `value`). `setSegmentedControlValue` does not dispatch it.
 */
export const SEGMENTED_CONTROL_CHANGE_EVENT = 'var-ui:segmented-control-change';

const namesPerRender = new WeakMap<object, number>();

/** FNV-1a, base 36: a short stable tag for a page path. */
function pathTag(pathname: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < pathname.length; i += 1) {
    hash ^= pathname.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Default radio-group `name` for a server-rendered segmented control: a tag for the page path
 * plus the control's position in that render (`var-ui-segmented-<path>-<n>`). It is the same on
 * every build, so static HTML does not change between builds, and differs between pages, so
 * names stay distinct when elements outlive a view transition (`transition:persist`).
 *
 * `render` is any object unique to one page render (Astro's `Astro.request`).
 */
export function segmentedControlName(render: object, pathname: string): string {
  const index = (namesPerRender.get(render) ?? 0) + 1;
  namesPerRender.set(render, index);
  return `var-ui-segmented-${pathTag(pathname)}-${index}`;
}

function segmentsOf(root: Element): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(':scope > [data-var-ui-segment-id]'));
}

function radioOf(segment: Element): HTMLInputElement | null {
  return segment.querySelector<HTMLInputElement>('input[type="radio"]');
}

/**
 * Mark `value` as the checked segment (`data-selected` + the radio's `checked`) and move the
 * indicator. Does not dispatch the change event: use it to reflect state set elsewhere.
 */
export function setSegmentedControlValue(root: Element, value: string | null): void {
  segmentsOf(root).forEach((segment) => {
    const selected = segment.getAttribute('data-var-ui-segment-id') === value;
    segment.toggleAttribute('data-selected', selected);
    const radio = radioOf(segment);
    if (radio) radio.checked = selected;
  });
  if (root instanceof HTMLElement) {
    syncSegmentedControlIndicator(root);
  }
}

/** Current `data-var-ui-segment-id` of the checked segment, or `null`. */
export function getSegmentedControlValue(root: Element): string | null {
  const checked = segmentsOf(root).find((segment) => radioOf(segment)?.checked);
  return checked?.getAttribute('data-var-ui-segment-id') ?? null;
}

export function initSegmentedControl(root: Element): void {
  if (root.hasAttribute('data-var-ui-segmented-control-initialized')) return;
  root.setAttribute('data-var-ui-segmented-control-initialized', '');

  // Native radios own focus and keyboard (Tab to the checked one, arrows move and check);
  // mirror the checked radio onto `data-selected` for styling and the indicator.
  root.addEventListener('change', (event) => {
    const radio = event.target;
    if (!(radio instanceof HTMLInputElement) || radio.type !== 'radio') return;
    const segment = radio.closest('[data-var-ui-segment-id]');
    if (!segment || segment.parentElement !== root) return;
    const id = segment.getAttribute('data-var-ui-segment-id');
    setSegmentedControlValue(root, id);
    root.dispatchEvent(
      new CustomEvent(SEGMENTED_CONTROL_CHANGE_EVENT, {
        bubbles: true,
        detail: { id },
      }),
    );
  });

  if (root instanceof HTMLElement) {
    observeSegmentedControlIndicator(root);
  }
}

export function initSegmentedControls(root: ParentNode = document): void {
  root.querySelectorAll('[data-var-ui-segmented-control]').forEach((node) => {
    initSegmentedControl(node);
  });
}
