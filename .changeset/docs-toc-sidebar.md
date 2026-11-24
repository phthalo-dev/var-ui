---
'@var-ui/docs': patch
'@var-ui/core': patch
---

Improve docs TOC scrollspy and sidebar threshold

- Select the last TOC heading when the reader scrolls to the bottom of the page.
- Show the docs TOC for pages with a single heading so the Markdown action is not orphaned.
- Add a `collapseThreshold` prop to `DocsSidebar` to control when groups collapse.
