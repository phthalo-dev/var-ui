---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': patch
---

New `Bleed` (React and Astro) and core `bleed` recipe: a band that spans a padded, centred frame edge to edge while its content stays on the column (`align="content"`, the default) or bleeds too (`align="edge"`). It is pure CSS, `calc((100cqw - 100%) / 2 + gutter)` against the nearest `container-type: inline-size` frame, so it works with SSR and extracted CSS. `gutter` is the frame's own inline padding. For recipe slots, `bleedStyle({ gutter, align })` returns the same declarations. The docs page bar uses it.
