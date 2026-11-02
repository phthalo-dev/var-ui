export type OverlayOpenChangeReason =
  | 'trigger-press'
  | 'close-press'
  | 'escape-key'
  | 'outside-press'
  | 'imperative'
  | 'hover'
  | 'focus';

export type OverlayChangeEventDetails = {
  reason: OverlayOpenChangeReason;
  event: Event | null;
  cancel: () => void;
  isCanceled: boolean;
};

export type OverlayOpenChangeHandler = (open: boolean, details: OverlayChangeEventDetails) => void;

export function createOverlayChangeDetails(init: {
  reason: OverlayOpenChangeReason;
  event: Event | null;
}): OverlayChangeEventDetails {
  const details: OverlayChangeEventDetails = {
    reason: init.reason,
    event: init.event,
    isCanceled: false,
    cancel() {
      details.isCanceled = true;
    },
  };
  return details;
}

export function inferOverlayCloseReason(event: Event | null): OverlayOpenChangeReason {
  if (!event) return 'imperative';
  if (event.type === 'keydown' && 'key' in event && event.key === 'Escape') {
    return 'escape-key';
  }
  if (event.type === 'pointerdown' || event.type === 'mousedown') {
    return 'outside-press';
  }
  if (event.type === 'click' || event.type === 'press') {
    return 'trigger-press';
  }
  if (
    event.type === 'mouseenter' ||
    event.type === 'mouseleave' ||
    event.type === 'mouseover' ||
    event.type === 'mouseout' ||
    event.type === 'pointerover' ||
    event.type === 'pointerout' ||
    event.type === 'pointerenter' ||
    event.type === 'pointerleave' ||
    event.type === 'hover'
  ) {
    return 'hover';
  }
  if (
    event.type === 'focus' ||
    event.type === 'blur' ||
    event.type === 'focusin' ||
    event.type === 'focusout'
  ) {
    return 'focus';
  }
  return 'imperative';
}
