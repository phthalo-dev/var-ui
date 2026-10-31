import { describe, expect, it } from 'vite-plus/test';
import { dialog } from '../../src/components/dialog';

describe('dialog', () => {
  it('defaults to the dialog role', () => {
    const classes = dialog();
    const defaultClasses = dialog({ role: 'dialog' });
    expect(classes.popup.props).toEqual(defaultClasses.popup.props);
  });

  it('exposes the native dialog as `popup` and no overlay/modal parts', () => {
    const classes = dialog() as unknown as Record<string, { className?: string } | undefined>;

    expect(classes.popup?.className).toContain('var-ui-dialog__popup');
    expect(classes.overlay).toBeUndefined();
    expect(classes.modal).toBeUndefined();
  });
});
