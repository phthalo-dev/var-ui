---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Categorical colors for identity, not status:

- **Tokens:** `color.categorical.1`–`8` (blue, orange, teal, pink, grass, violet, amber, red). Mode-aware palette steps, each at least 4:1 on the surface in both modes, ordered so neighbours differ most. Use them for chart series, roles and kinds. Plus chart chrome: `color.chart.axis`, `gridline` and `plot`.
- **Badge and StatusDot `category`** (`"1"`–`"8"`): sets the hue instead of `tone`, in every appearance. `none` (the default) leaves `tone` in charge.
