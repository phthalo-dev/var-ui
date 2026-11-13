import type { Page, Locator } from '@playwright/test';

/**
 * A harness is rooted at the `Page`, or scoped to a `Locator` (e.g. resolved within one
 * dialog or form) so multiple instances of a component on one page can be targeted:
 * `getButton(page.getByTestId('row-1'), { name: 'Delete' })`.
 */
export type HarnessScoper = Page | Locator;

/** Accessible-name matching shared by every `get<Component>` factory. */
export interface HarnessNameOptions {
  /** Accessible name of the harness's primary part (button text, field label text, ...). */
  name?: string | RegExp;
  /** Match `name` exactly (after trimming whitespace). @default false */
  exact?: boolean;
}
