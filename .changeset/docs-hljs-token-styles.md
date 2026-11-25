---
'@var-ui/docs': minor
---

`@var-ui/docs/styles` now colours highlight.js output (`hljs-*` classes inside a `CodeBlock`) with the theme's `color.code.*` tokens, so `@var-ui/docs/highlight` output is styled outside the kit's own site, in the same palette as the design-token Shiki theme. `@var-ui/docs/highlight` also exports `highlightCode(code, lang)` and `highlightCodeClassName(lang)` (#335).
