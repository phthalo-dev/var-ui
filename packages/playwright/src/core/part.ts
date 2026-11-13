import type { Locator, Page } from '@playwright/test';
import type { HarnessScoper } from './types';

type ByRoleOptions = { name?: string | RegExp; exact?: boolean };
type ByLabelOptions = { exact?: boolean };
/** The role strings accepted by Playwright's `getByRole` (kept in sync with the engine). */
type AriaRole = Parameters<Extract<HarnessScoper, Page>['getByRole']>[0];

/**
 * Locate one harness part and give it a friendly debug name. Playwright surfaces `describe`
 * names in assertion failures, strict-mode violations and traces, so a consumer error reads
 * `Dialog popup (strict-mode violation: resolved to 2 dialog elements)` instead of a raw
 * engine selector string. Every part locator in a harness must go through one of these.
 */
export function partByRole(
  scoper: HarnessScoper,
  role: AriaRole,
  options: ByRoleOptions,
  description: string,
): Locator {
  return scoper.getByRole(role, options).describe(description);
}

export function partByLabel(
  scoper: HarnessScoper,
  name: string | RegExp,
  options: ByLabelOptions,
  description: string,
): Locator {
  return scoper.getByLabel(name, options).describe(description);
}

/**
 * The clickable root of a field-style component (checkbox, switch-like labels): the native
 * control lives in a clipped wrapper inside the component's clickable `<label>`, so
 * interaction walks up to that label (`ancestor::label[1]`).
 */
export function clickableRoot(locator: Locator, description: string): Locator {
  return locator.locator('xpath=ancestor::label[1]').describe(description);
}
