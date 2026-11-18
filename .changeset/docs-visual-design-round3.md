---
'@var-ui/core': patch
'@var-ui/docs': minor
'@var-ui/docs-components': patch
---

Docs visual design, round 3:

- Prose inline code is one chip everywhere except table cells (mono only, first column keeps the chip).
- Pill `Tabs` scroll with snap and a scroll-driven trailing-edge fade.
- `@var-ui/docs`:
  - `DocsPageHeader` takes a `preview` slot: a live component plate in the right half of the hero band.
  - Guide pages render the same hero (eyebrow from frontmatter `eyebrow` or the section name, lead from `description`); the MDX title is hidden by `docsGuideArticle`.
  - The import pill truncates with an ellipsis and keeps its copy button; metadata links underline on hover only.
  - Demo stages size to their content (120px floor) and get a hover toolbar: preview in the opposite color mode, and right-to-left.
  - The TOC hairline only shows under a rendered TOC.
- `@var-ui/docs-components`: the component tabs script shows a per-tab rail block (`data-rail`), so non-Documentation tabs keep useful right-rail content.
