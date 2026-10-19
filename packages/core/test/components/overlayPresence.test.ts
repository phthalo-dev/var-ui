import { describe, expect, it } from 'vite-plus/test';
import { overlayPresenceStyles } from '../../src/shared/overlayMotion';

describe('overlayPresenceStyles', () => {
  it('adds scale to popup starting and ending styles when requested', () => {
    const styles = overlayPresenceStyles({ scale: true });

    expect(styles['&[data-starting-style], &[data-ending-style]']).toEqual({
      opacity: 0,
      transform: 'scale(0.98)',
    });
  });
});
