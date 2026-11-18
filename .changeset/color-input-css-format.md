---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

- `ColorInput` gains `format="css"`: it accepts any CSS color (`var(--brand)`, `oklch(…)`, named colors) as typed, allows an empty value, paints the swatch with it (falling back to `defaultValue`), and starts the picker from the resolved color. The `colorField` recipe has a matching `format` variant (`hex` keeps the upper-case input).
- Text inputs in `textField` and `colorField` end long values in an ellipsis at rest.
- `Tabs` gains `size: 'sm' | 'md'` (React and Astro; core `tabs` recipe variant) for compact rows in side panels.
