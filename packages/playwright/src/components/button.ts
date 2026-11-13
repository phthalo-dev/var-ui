import { expect, type Locator } from '@playwright/test';
import { partByRole } from '../core/part';
import type { HarnessNameOptions, HarnessScoper } from '../core/types';

/**
 * Harness for `@var-ui/react`'s `Button` (and `Link`-styled-as-button): a native
 * `<button>` / `<a>` locateable by role and accessible name.
 */
export class ButtonHarness {
  readonly locator: Locator;

  constructor(scoper: HarnessScoper, options: HarnessNameOptions = {}) {
    this.locator = partByRole(scoper, 'button', options, 'Button');
  }

  /** Mouse/touch/keyboard activation (react-aria unifies them). */
  async click(): Promise<void> {
    await this.locator.click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.locator).toBeVisible();
  }

  async expectEnabled(): Promise<void> {
    await expect(this.locator).toBeEnabled();
  }

  async expectDisabled(): Promise<void> {
    await expect(this.locator).toBeDisabled();
  }
}

export function getButton(scoper: HarnessScoper, options?: HarnessNameOptions): ButtonHarness {
  return new ButtonHarness(scoper, options);
}
