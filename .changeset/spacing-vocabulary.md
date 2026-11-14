---
'@var-ui/core': minor
---

One spacing vocabulary: `gap`/`padding` step names now map 1:1 to the `space.*` tokens everywhere (`md` is always `space.md`), and the axes cover the full scale — `none`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`, `xxxxl`.

- `stack`, `grid`, `fieldset`, `overflowList` gap axes and `surface` padding follow the same names and sizes. Rendered defaults are unchanged in pixels (Stack/Fieldset/OverflowList default to 12px, Grid and Surface to 16px).
- Values that change for explicit steps: Stack/Fieldset/OverflowList `gap="md"` 12px → 16px and `gap="xl"` 48px → 32px; Grid `gap="sm"` 8px → 12px and `gap="xl"` 48px → 32px; Surface `padding="sm"` 8px → 12px, and it gains `none`/`xxs`/`lg`/`xl`/`xxl`/`xxxl`/`xxxxl`.
