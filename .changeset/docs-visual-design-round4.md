---
'@var-ui/core': minor
'@var-ui/docs': minor
'@var-ui/docs-components': minor
---

Docs component pages, round 4:

- `tabs` underline appearance is now true page tabs: a full-width hairline rail, a 2px accent indicator that slides (respecting reduced motion), 44px tall tabs with a neutral hover underline and an accented icon on the selected tab. The row scrolls sideways with a trailing fade.
- `@var-ui/docs`:
  - The hero (`DocsPageHeader`) spans the full content frame (main column + rail), with a large showcase plate set into the band.
  - The rail (TOC or per-tab list) starts below the hero and tabs, and sticks under the new collapsed page bar.
  - The collapsed page bar (`docsPageBar`): once the hero scrolls away, a compact sticky bar shows the page name, the page tabs, source and Markdown links and the import copy button. It reveals with a CSS scroll-driven animation on the hero's view timeline, falling back to an IntersectionObserver; a fade-only variant applies under reduced motion. It is exposed to AT and keyboard only while visible.
- `@var-ui/docs-components`: `ComponentDocTabs` uses the underline tabs and joins the page grid (`data-docs-page-tabs`).
