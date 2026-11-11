# @var-ui/playwright

Playwright component harnesses for the var-ui design system. They hide VarUI's DOM
contracts (ARIA wiring, native `<dialog>` / `[popover]` top layer, dismissal semantics)
behind a small component-aware API, so consumer tests never reach into implementation
details like roles, class names or `data-*` attributes.

Locators are **ARIA-first by design** — never class names or test ids — and every part
locator is `describe`d so Playwright failures read `Dialog popup` rather than a raw
engine selector.

## Install

```sh
pnpm add -D @var-ui/playwright
```

## Usage

```ts
import { test, expect } from '@playwright/test';
import { getButton, getDialog, getSelect } from '@var-ui/playwright';

test('order flow', async ({ page }) => {
  await page.goto('/demo/index');

  const select = getSelect(page, { name: 'Region' });
  await select.selectOption('EU (Frankfurt)');

  const dialog = getDialog(page, { triggerName: 'Open', title: 'Confirm order' });
  await dialog.open();
  await expect(dialog.popup).toContainText('You are ordering 2 items.');
  await dialog.close('escape');

  const button = getButton(page, { name: 'Back to catalogue' });
  await button.expectEnabled();
  await button.click();
});
```

Every `get<Component>` factory accepts a `Page` or a `Locator` (scope to one instance,
e.g. `getCheckbox(page.getByTestId('row-1'), { name: 'Include tax' })`), plus accessible
name options to disambiguate several instances of the same component on a page.

## Components

| Harness            | Notes                                                                                           |
| :----------------- | :---------------------------------------------------------------------------------------------- |
| `ButtonHarness`    | native `<button>` / `<a>`-as-button                                                             |
| `CheckboxHarness`  | sr-only `<input>`; `toggle()` clicks the `<label>` wrapper                                      |
| `TextFieldHarness` | labelled native control; also covers `TextAreaField`, `SearchInput`, `PasswordInput`            |
| `DialogHarness`    | native `<dialog>`, `open()` / `close('escape' \| 'backdrop' \| 'close-button')`, `:modal`-aware |
| `SelectHarness`    | trigger + listbox in a native `[popover=manual]` shell                                          |

## Development (in this repo)

```sh
vp run @var-ui/playwright#test            # Playwright suite (fixture app served via `vp dev`)
vp run -F @var-ui/playwright build        # `vp pack` the src/ entry
```

Fixture scenarios live in `fixture/scenarios.tsx` (one React island per `/?case=`);
harness specs live in `tests/`. Both are deliberately minimal renderings of the docs
demos so the harnesses stay written against what consumers actually see.
