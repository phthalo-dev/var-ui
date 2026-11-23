---
'@var-ui/core': minor
---

`defaultTheme.override({ extend: { app: { … } } })` adds new token namespaces on a child theme, typed on the child's `.tokens` as `{ name, var }` refs, so an app no longer needs a full root theme for a few values of its own (#230). Custom namespaces and the `tokens` passed to theme `components` factories are `{ name, var }` refs, like `designTokens` (the runtime half came with the TypeStyles 0.37 upgrade); the Tokens and Customize docs now say so.
