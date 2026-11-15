---
'@var-ui/core': minor
---

Grid gains responsive column counts and a min column width: `gridColumnsStyle` builds the media-query class for per-breakpoint counts (`{ base: 2, lg: 7 }` using the theme breakpoints), the `columns` axis gains `seven` and the internal `fixed` mode that hands the template to that class, and `--var-ui-grid-mincolumnwidth` stays overridable.
