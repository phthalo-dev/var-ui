import { describe, expect, it } from 'vite-plus/test';
import { createOverlayChangeDetails, inferOverlayCloseReason } from './changeEvent';

describe('createOverlayChangeDetails', () => {
  it('starts uncanceled and cancel() flips isCanceled', () => {
    const details = createOverlayChangeDetails({
      reason: 'escape-key',
      event: null,
    });
    expect(details.isCanceled).toBe(false);
    details.cancel();
    expect(details.isCanceled).toBe(true);
  });
});

describe('inferOverlayCloseReason', () => {
  it('maps Escape keydown to escape-key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    expect(inferOverlayCloseReason(event)).toBe('escape-key');
  });

  it('maps pointerdown to outside-press', () => {
    const event = new MouseEvent('pointerdown');
    expect(inferOverlayCloseReason(event)).toBe('outside-press');
  });

  it('maps click/press to trigger-press', () => {
    const event = new MouseEvent('click');
    expect(inferOverlayCloseReason(event)).toBe('trigger-press');
  });

  it('maps hover and focus events', () => {
    expect(inferOverlayCloseReason(new Event('mouseenter'))).toBe('hover');
    expect(inferOverlayCloseReason(new Event('mouseleave'))).toBe('hover');
    expect(inferOverlayCloseReason(new Event('hover'))).toBe('hover');
    expect(inferOverlayCloseReason(new Event('focus'))).toBe('focus');
    expect(inferOverlayCloseReason(new Event('blur'))).toBe('focus');
  });

  it('returns unknown for unrelated events', () => {
    expect(inferOverlayCloseReason(null)).toBe('imperative');
  });
});
