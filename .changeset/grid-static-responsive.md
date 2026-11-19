---
'@var-ui/core': minor
'@var-ui/react': patch
'@var-ui/astro': patch
---

`Grid`'s responsive `columns` map (`{ base: 2, md: 3 }`) works with extracted CSS and SSR. In Astro it silently stayed one column, because the old `gridColumnsStyle()` built a runtime-hashed class that never reached the build-time stylesheet. The `grid` recipe's `fixed` variant is now static CSS that reads per-breakpoint track vars (`columns.base` … `columns.xl` recipe vars with TypeStyles' `inheritOverride`, so an unset breakpoint stays unset). Each breakpoint falls back to the nearest smaller one that is set, and before the first set one to the `auto` template. The components set those variables inline.

**Breaking (core):** `gridColumnsStyle` is replaced by `gridColumnsVars(counts)`, which returns the inline vars to pair with `grid({ columns: 'fixed' })`.
