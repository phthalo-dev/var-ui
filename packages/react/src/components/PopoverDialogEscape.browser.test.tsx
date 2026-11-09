import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { raf, settled } from '../test/browser';
import { Dialog } from './Dialog';
import { Popover } from './Popover';

// Own file on purpose: the grouping below depends on the page's user-activation history, which
// earlier clicks in a shared page (other tests in the same file) change.
const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const shown = (el: Element) => el.matches(':popover-open');
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);

describe('Escape with a popover inside a modal dialog', () => {
  test.each(Array.from({ length: 50 }, (_, i) => i))(
    'a popover opened without a user activation: one Escape closes only the popover (%i of 50)',
    async (i) => {
      // Chromium groups the close watcher of a popover shown outside a user activation (a timer, a
      // controlled `open`, `showPopover()`) with the modal dialog's: one Escape then fires the
      // dialog's `cancel` right after the popover's hide. The dialog must stay open.
      const dialogChange = vi.fn<OverlayOpenChangeHandler>();
      const popChange = vi.fn<OverlayOpenChangeHandler>();
      const view = render(
        <DesignSystemProvider applyToDocument>
          <IconProvider icons={{}}>
            <Dialog.Root defaultOpen onOpenChange={dialogChange}>
              <Dialog.Popup data-testid="dialog">
                <Dialog.Title>Modal</Dialog.Title>
                <Popover.Root onOpenChange={popChange}>
                  <Popover.Trigger>
                    <button type="button" data-testid="trigger">
                      Open
                    </button>
                  </Popover.Trigger>
                  <Popover.Popup data-testid="popup" aria-label="Inner">
                    <button type="button" data-testid="inner">
                      Inner
                    </button>
                  </Popover.Popup>
                </Popover.Root>
              </Dialog.Popup>
            </Dialog.Root>
          </IconProvider>
        </DesignSystemProvider>,
      );
      await settled(q('dialog'));
      q('popup').showPopover();
      await expect.poll(() => shown(q('popup'))).toBe(true);
      q('inner').focus();
      await userEvent.keyboard('{Escape}');
      await expect.poll(() => shown(q('popup')), { message: `iteration ${i}` }).toBe(false);
      await raf();
      expect((q('dialog') as HTMLDialogElement).open, `iteration ${i}`).toBe(true);
      expect(dialogChange).not.toHaveBeenCalled();
      expect(reasons(popChange).slice(-1)[0]).toEqual([false, 'escape-key']);
      view.unmount();
    },
  );
});
