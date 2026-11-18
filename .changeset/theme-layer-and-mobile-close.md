---
'@var-ui/docs': patch
'@var-ui/core': patch
'@var-ui/astro': patch
'@var-ui/cli': patch
---

- `@var-ui/docs`: lazy theme stylesheets (`/themes/<id>.css`) keep the cascade layer their rules were emitted in. The extract sliced from the theme class mid-`@layer tokens { … }` block, dropping the opener, so the theme's `color-scheme: light dark` became unlayered and overrode the `data-color-mode` pin: Light/Dark did nothing on every non-default theme.
- `MobileNav`: the close button has a 32px control-sized box and sizes its icon (core), and the Astro `MobileNav` now renders the close icon (it rendered an empty 8px button).
