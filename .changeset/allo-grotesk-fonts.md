---
'@var-ui/core': minor
'@var-ui/docs': patch
---

**Fonts.** Add the `alloGrotesk` pairing: Allo (Latin subset, variable weight) for body and UI, Space Grotesk for display, JetBrains Mono for code, each webfont backed by a metric-matched Arial fallback so text doesn't rewrap when the webfont swaps in. `defineFonts` slots accept several faces (upright + italic of one family), register a face shared by two slots once, and take an optional `metricFallback` face; `FontFaceDefinition` gains `sizeAdjust`, `ascentOverride`, `descentOverride` and `lineGapOverride`.

**Letter-spacing tokens resolve at the text that uses them.** `letterSpacing.*` tokens were registered as `<length-percentage>`, so `em` values computed once against the root font size: `caps` (0.06em) rendered as 0.08em on 12px labels and `display` tracking didn't scale with headline size. They are now unregistered (`*` syntax), so `em` resolves at the use site.

**Tabular figures** on `badge` and the `slider` output.

**Docs prose:** H3–H6 use the body face (H3 at weight 650); the lead paragraph and page-header lead track at −0.005em.
