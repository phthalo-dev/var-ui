---
'@var-ui/playwright': minor
---

New package: `@var-ui/playwright`, Playwright component test harnesses so consumers do not have to reach into VarUI internals (ARIA queries, class names, `data-*` attributes). Pilot harnesses: `getButton`, `getCheckbox`, `getTextField`, `getDialog` and `getSelect`, each with a component-aware API (e.g. `dialog.open()`, `select.selectOption('EU')`, `checkbox.toggle()`) built on ARIA-first locators with friendly failure names.
