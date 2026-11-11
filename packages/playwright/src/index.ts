/**
 * `@var-ui/playwright`: component test harnesses for the var-ui design system.
 *
 * Each harness hides VarUI's DOM contracts (ARIA wiring, native `<dialog>`/`[popover]`
 * top layer, dismissal semantics) behind a small component-aware API. Locators are
 * ARIA-first by design — never class names or test ids — and every part is `describe`d so
 * Playwright errors stay readable. Scope a factory with a `Locator` (or pass the `Page`)
 * to address a specific instance.
 */
export type { HarnessNameOptions, HarnessScoper } from './core/types';
export { getButton, ButtonHarness } from './components/button';
export { getCheckbox, CheckboxHarness } from './components/checkbox';
export { getTextField, TextFieldHarness } from './components/textfield';
export { getDialog, DialogHarness, type DialogOptions } from './components/dialog';
export { getSelect, SelectHarness } from './components/select';
