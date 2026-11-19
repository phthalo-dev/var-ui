---
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs-components': patch
---

Data-driven icons for SegmentedControl options and Astro menu items (#182).

- **astro** `SegmentedControl` options take `icon` (a registry name or `{ svg }` markup). Menu items' `icon` also accepts `{ svg }`. New `AstroIcon` type and `iconMarkup()`; an unknown icon name now throws at render instead of rendering nothing. Astro named slots can't be generated inside a `map`, so per-option content now travels with the data. `ColorModeToggle` is built on it.
- **react** `SegmentedControl` options take `icon` (registry name or node), the same shape as Astro.
- In both, with `layout="icon"` only the icon shows and a string `label` becomes the segment's accessible name, so icon-only options no longer need a separate `aria-label`.
- **docs-components** `FrameworkSwitcher` uses option icons instead of one slot per framework.
