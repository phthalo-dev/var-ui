import { expect, type Locator } from '@playwright/test';
import type { HarnessScoper } from '../core/types';

export interface DialogOptions {
  /** Accessible name of the trigger button (its text). Narrow the case of several dialogs on one page. */
  triggerName?: string | RegExp;
  /** Title text of the dialog (`Dialog.Title` or `aria-label`); narrows the popup element. */
  title?: string | RegExp;
}

/**
 * Harness for `@var-ui/react`'s natively modal `Dialog` (`Dialog.Popup` *is* a native
 * `<dialog>` opened with `showModal()`, no portal).
 */
export class DialogHarness {
  /** The element that opens the dialog (`button[aria-haspopup="dialog"]`). */
  readonly trigger: Locator;
  /** The `<dialog>` element itself. */
  readonly popup: Locator;

  constructor(scoper: HarnessScoper, options: DialogOptions = {}) {
    const { triggerName, title } = options;
    this.trigger = (
      triggerName
        ? scoper.getByRole('button', { name: triggerName })
        : scoper.locator('button[aria-haspopup="dialog"]')
    ).describe('Dialog trigger');
    this.popup = (
      title
        ? scoper
            .locator('dialog')
            .filter({ has: scoper.getByRole('heading', { name: title as string | RegExp }) })
        : scoper.locator('dialog')
    ).describe('Dialog popup');
  }

  async open(): Promise<void> {
    await this.trigger.click();
    await this.expectOpen();
  }

  /** A button inside the popup, by accessible name (`Dialog.Actions`' confirm/cancel). */
  button(name: string | RegExp, exact?: boolean): Locator {
    return this.popup.getByRole('button', { name, exact }).describe('Dialog button');
  }

  /** The default `Dialog.Close` chrome (`aria-label="Close"`); only exists when `Dialog.Close` is rendered without a child. */
  private closeButton(): Locator {
    return this.popup.locator('button[aria-label="Close"]').describe('Dialog close button');
  }

  /**
   * Native dismissal semantics: `close-button` clicks the default `Dialog.Close` chrome
   * (use `button(name).click()` for custom `Dialog.Close` content); `backdrop` clicks the
   * top layer's light-dismiss; `escape` sends the key into the popup.
   */
  async close(mode: 'escape' | 'backdrop' | 'close-button'): Promise<void> {
    if (mode === 'escape') {
      await this.popup.press('Escape');
    } else if (mode === 'backdrop') {
      // The default dialog is centred, so the viewport corner is reliably on the backdrop.
      await this.popup.page().mouse.click(4, 4);
    } else {
      await this.closeButton().click();
    }
    await this.expectClosed();
  }

  async expectOpen(): Promise<void> {
    await expect(this.popup).toBeVisible();
    // Native modality: `showModal()` puts the dialog in the top layer (`:modal`).
    await expect.poll(() => this.popup.evaluate((el) => el.matches(':modal'))).toBe(true);
  }

  async expectClosed(): Promise<void> {
    await expect(this.popup).toBeHidden();
  }
}

export function getDialog(scoper: HarnessScoper, options?: DialogOptions): DialogHarness {
  return new DialogHarness(scoper, options);
}
