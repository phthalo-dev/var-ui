import { expect, type Locator } from '@playwright/test';
import { clickableRoot, partByRole } from '../core/part';
import type { HarnessNameOptions, HarnessScoper } from '../core/types';

/**
 * Harness for `@var-ui/react`'s `Checkbox`. The component renders a `<label>` root with a
 * sr-only native `<input type="checkbox">`; the label is what users (and the harness) click,
 * while checked/disabled state is asserted on the input itself.
 *
 * `name` is the checkbox's label text.
 */
export class CheckboxHarness {
  /** The native `<input type="checkbox">` (role `checkbox`). */
  readonly locator: Locator;
  /** The `<label>` root: actually clickable. */
  readonly label: Locator;

  constructor(scoper: HarnessScoper, options: HarnessNameOptions = {}) {
    this.locator = partByRole(scoper, 'checkbox', options, 'Checkbox');
    this.label = clickableRoot(this.locator, 'Checkbox label');
  }

  async toggle(): Promise<void> {
    await this.label.click();
  }

  async expectChecked(): Promise<void> {
    await expect(this.locator).toBeChecked();
  }

  async expectUnchecked(): Promise<void> {
    await expect(this.locator).toBeChecked({ checked: false });
  }

  async expectIndeterminate(): Promise<void> {
    await expect(this.locator).toBeChecked({ indeterminate: true });
  }

  async expectEnabled(): Promise<void> {
    await expect(this.locator).toBeEnabled();
  }

  async expectDisabled(): Promise<void> {
    await expect(this.locator).toBeDisabled();
  }
}

export function getCheckbox(scoper: HarnessScoper, options?: HarnessNameOptions): CheckboxHarness {
  return new CheckboxHarness(scoper, options);
}
