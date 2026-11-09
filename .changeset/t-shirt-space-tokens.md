---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Space tokens use t-shirt names, like `fontSize` and `radius`: `none` (0), `xxs` (0.25rem), `xs` (0.5rem), `sm` (0.75rem), `md` (1rem), `lg` (1.5rem), `xl` (2rem), `xxl` (2.5rem), `xxxl` (3rem) and `xxxxl` (4rem). The old numeric keys map as `0→none`, `1→xxs`, `2→xs`, `3→sm`, `4→md`, `5→lg`, `6→xl`, `10→xxl`, `8→xxxl` and `12→xxxxl`. The unused steps `7`, `9`, `11`, `16` and `20` are removed. CSS variables follow, so `--var-ui-space-4` is now `--var-ui-space-md`.

Scale names use letters only: `fontSize` and `size.panel` rename `2xl` to `xxl`, and `fontSize` renames `3xl` to `xxxl`.

`Layout`, `LayoutHeader`, `LayoutFooter`, `LayoutContent`, `LayoutPanel` (`padding`) and `AppShell` (`contentPadding`) take space names instead of numbers, for example `padding="none"` instead of `padding={0}`.
