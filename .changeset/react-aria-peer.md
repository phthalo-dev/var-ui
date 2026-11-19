---
'@var-ui/react': minor
'@var-ui/cli': patch
---

`react-aria` is now a peer dependency (`^3.50.0`) instead of an exact dependency, so apps install one copy: the one `react-aria-components` uses. Two copies made menu items take over their trigger's ref, so `Menu` popups anchored to their own first item and rendered at the window's corner. A popup now ignores a trigger that sits inside itself and warns in development that `react-aria` is duplicated. `@react-aria/i18n` is gone (`isRTL` comes from `react-aria-components`).

Install it next to `react-aria-components`: `pnpm add react-aria`, then check `npm ls react-aria` lists one version.
