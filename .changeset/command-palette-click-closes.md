---
'@var-ui/astro': patch
---

CommandPalette closes when a result is clicked, not only on Enter. With view transitions the palette can live in a persisted element (as on the docs site), so navigating left it open. Modifier clicks (open in a new tab) keep it open.
