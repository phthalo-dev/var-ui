---
'@var-ui/react': minor
---

`DesignSystemProvider` now defaults `defaultColorMode` to `'system'` instead of `'light'`, so apps follow the OS color preference unless they choose a mode. `'system'` resolves in CSS (`prefers-color-scheme`) and pins no `data-color-mode`, so the server render is unchanged by the user's OS. Pass `defaultColorMode="light"` to keep the old behaviour.

`Table.Row` `selected` now only sets `data-selected` for styling. It no longer adds `aria-selected`, which is not valid on a row of a plain `<table>`; convey selection with the row's checkbox. Pass `aria-selected` yourself when you render the table as a `role="grid"`.
