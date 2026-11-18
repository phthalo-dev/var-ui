---
'@var-ui/core': minor
'@var-ui/react': minor
---

`CommandPalette`: only one row is ever highlighted. Rows no longer paint a separate hover background (the `resultHoverBackground` var is gone); moving the pointer over a row makes it the active row in React (as the Astro palette already did), so keyboard and pointer share one highlight.
