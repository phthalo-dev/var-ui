import {
  observeSegmentedControlIndicator,
  syncSegmentedControlIndicator,
} from '@var-ui/core/components/indicators/segmented-control';

/**
 * Event dispatched (bubbling) from the control root after the selection changes.
 * `event.detail.id` holds the selected segment's `data-segment-id` value.
 */
export const SEGMENTED_CONTROL_CHANGE_EVENT = 'var-ui:segmented-control-change';

let nameCounter = 0;

/**
 * Unique radio-group `name` for a server-rendered segmented control. The random part keeps names
 * distinct across pages whose elements outlive a view transition (`transition:persist`).
 */
export function nextSegmentedControlName(): string {
  nameCounter += 1;
  return `var-ui-segmented-${Math.random().toString(36).slice(2, 8)}-${nameCounter}`;
}

function segmentsOf(root: Element): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(':scope > [data-segment-id]'));
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
    const selected = segment.getAttribute('data-segment-id') === value;
    segment.toggleAttribute('data-selected', selected);
    const radio = radioOf(segment);
    if (radio) radio.checked = selected;
  });
  if (root instanceof HTMLElement) {
    syncSegmentedControlIndicator(root);
  }
}

/** Current `data-segment-id` of the checked segment, or `null`. */
export function getSegmentedControlValue(root: Element): string | null {
  const checked = segmentsOf(root).find((segment) => radioOf(segment)?.checked);
  return checked?.getAttribute('data-segment-id') ?? null;
}

export function initSegmentedControl(root: Element): void {
  if (root.hasAttribute('data-var-ui-segmented-control-initialized')) return;
  root.setAttribute('data-var-ui-segmented-control-initialized', '');

  // Native radios own focus and keyboard (Tab to the checked one, arrows move and check);
  // mirror the checked radio onto `data-selected` for styling and the indicator.
  root.addEventListener('change', (event) => {
    const radio = event.target;
    if (!(radio instanceof HTMLInputElement) || radio.type !== 'radio') return;
    const segment = radio.closest('[data-segment-id]');
    if (!segment || segment.parentElement !== root) return;
    const id = segment.getAttribute('data-segment-id');
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
