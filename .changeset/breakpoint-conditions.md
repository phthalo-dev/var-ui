---
'@var-ui/core': patch
---

The TypeStyles instance registers its breakpoints as explicit `(min-width: …)` conditions built from the `breakpoint` tokens, so TypeStyles no longer warns about bare breakpoint values on startup. The `breakpoint` tokens keep their bare widths, and the emitted CSS is unchanged.
