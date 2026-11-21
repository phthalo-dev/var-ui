---
'@var-ui/core': minor
---

New `color.text.tertiary` token: quiet but enabled text, a step below `text.secondary` and not `disabled`. It is `secondary` mixed 85% toward `background.surface`, so it stays opaque and follows a theme's `secondary`. The defaults meet WCAG AA (4.5:1) on `background.surface` and `background.subtle` in both modes. `segmentedControl` (unselected segments) and `commandPalette` (result subtitles) use it instead of hand-rolled `color-mix(… transparent)` values.
