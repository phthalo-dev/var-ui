import { expect, type Locator } from '@playwright/test';
import { partByRole } from '../core/part';
import type { HarnessNameOptions, HarnessScoper } from '../core/types';

/**
 * Harness for `@var-ui/react`'s `Select` (single- and multi-select with a listbox in a
 * native `[popover=manual]` shell anchored to the trigger).
 */
export class SelectHarness {
  /** The trigger `<button>` carrying the selected value/placeholder. */
  readonly trigger: Locator;
  /** The select root (the trigger's parent contains the popover shell). */
  readonly root: Locator;
  /** The `<div role="listbox">` inside the popover shell; resolves only while open. */
  readonly listbox: Locator;

  constructor(scoper: HarnessScoper, options: HarnessNameOptions = {}) {
    this.trigger = partByRole(scoper, 'button', options, 'Select trigger');
    this.root = this.trigger.locator('..').describe('Select root');
    this.listbox = this.root.getByRole('listbox').describe('Select listbox');
  }

  /** Opens the listbox (unlike `getByRole('listbox')` outside interaction, this observes the full open flow). */
  async open(): Promise<void> {
    await this.trigger.click();
    await expect(this.listbox).toBeVisible();
  }

  /** Closes via the trigger's toggle behaviour (react-aria opens on pointer-down and the shell swallows the closing click). */
  async close(): Promise<void> {
    await this.trigger.click();
    await expect(this.listbox).toBeHidden();
  }

  /** A single option locator, composed via `expect(option).toBeDisabled()` etc. */
  option(name: string | RegExp, exact?: boolean): Locator {
    return this.listbox.getByRole('option', { name, exact }).describe('Select option');
  }

  /** Opens the listbox, selects the named option and waits for the post-selection close (react-aria closes automatically). */
  async selectOption(name: string | RegExp): Promise<void> {
    await this.open();
    await this.option(name).click();
    await expect(this.listbox).toBeHidden();
  }

  /** The trigger shows the selected option's label. */
  async expectValue(label: string | RegExp): Promise<void> {
    await expect(this.trigger).toHaveText(label);
  }

  /** The trigger still shows the placeholder (default `Select…`). */
  async expectPlaceholder(text: string | RegExp = 'Select…'): Promise<void> {
    await expect(this.trigger).toHaveText(text);
  }

  async expectEnabled(): Promise<void> {
    await expect(this.trigger).toBeEnabled();
  }

  async expectDisabled(): Promise<void> {
    await expect(this.trigger).toBeDisabled();
  }
}

export function getSelect(scoper: HarnessScoper, options?: HarnessNameOptions): SelectHarness {
  return new SelectHarness(scoper, options);
}
