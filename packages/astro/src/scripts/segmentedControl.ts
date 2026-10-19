import {
  observeSegmentedControlIndicator,
  syncSegmentedControlIndicator,
} from '@var-ui/core/components/indicators/segmented-control';

/**
 * Event dispatched (bubbling) from the control root after the selection changes.
 * `event.detail.id` holds the selected segment's `data-segment-id` value.
 */
export const SEGMENTED_CONTROL_CHANGE_EVENT = 'var-ui:segmented-control-change';

export function initSegmentedControl(root: Element): void {
  if (root.hasAttribute('data-var-ui-segmented-control-initialized')) return;
  root.setAttribute('data-var-ui-segmented-control-initialized', '');

  const segments = Array.from(root.querySelectorAll<HTMLElement>('[data-segment-id]'));

  function select(segment: HTMLElement): void {
    segments.forEach((candidate) => {
      const selected = candidate === segment;
      candidate.setAttribute('aria-pressed', selected ? 'true' : 'false');
      if (selected) {
        candidate.setAttribute('data-selected', '');
      } else {
        candidate.removeAttribute('data-selected');
      }
    });
    if (root instanceof HTMLElement) {
      syncSegmentedControlIndicator(root);
    }
    root.dispatchEvent(
      new CustomEvent(SEGMENTED_CONTROL_CHANGE_EVENT, {
        bubbles: true,
        detail: { id: segment.getAttribute('data-segment-id') },
      }),
    );
  }

  segments.forEach((segment) => {
    segment.addEventListener('click', () => select(segment));
  });

  // Arrow keys move focus only; Enter/Space activate the focused button natively.
  root.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (!(event.target instanceof HTMLElement)) return;

    const currentIndex = segments.indexOf(event.target);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex === 0 ? segments.length - 1 : currentIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex === segments.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = segments.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    segments[nextIndex]?.focus();
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
