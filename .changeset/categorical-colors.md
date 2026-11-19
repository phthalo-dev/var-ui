---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Named colors for identity, not status:

- **Badge and StatusDot `color`** takes any name from the base palette: `blue`, `red`, `violet`, `teal`, `sage`, `stone` and the rest of the 40 families. It sets the hue instead of `tone`, in every appearance. `none` (the default) leaves `tone` in charge. `<Badge color="violet">Reviewer</Badge>`.
- **Tokens:** `color.hue.<name>` for every palette family, mode-aware: step 7 in light mode (≥ 5.5:1 on surface and subtle) and step 4 in dark mode (≥ 8:1), so each works as badge text, an outline and a fill.
- `color.categorical.1`–`8` lists eight of them in chart series order (blue, orange, teal, pink, grass, violet, amber, red). Chart chrome: `color.chart.axis`, `gridline` and `plot`.
