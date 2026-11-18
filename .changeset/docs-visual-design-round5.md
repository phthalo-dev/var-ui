---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': minor
'@var-ui/docs-components': patch
---

Docs component pages, round 5:

- `SideNav.Section` (React and Astro) gains `collapsible`, `defaultOpen` and `count`: a native `<details>` disclosure whose title row sticks to the top of the scroll area, with a trailing chevron and an item count. New `sideNav` slots: `sectionSummary`, `sectionCount`, `sectionChevron`, `sectionItems`.
- Underline `tabs`: the rail ends flush with the container edge.
- `@var-ui/docs`:
  - The collapsed page bar is a full-bleed sub-header (edge to edge across the content area, content on the page frame, hairline bottom border) with core underline tabs whose indicator sits on the hairline.
  - It reveals as a discrete 140ms fade once the page's real tab row has passed under it, so labels and tab rows never double up.
  - Bar-tab jumps land the panel 24px under a shown bar.
  - The bar never truncates the name; it drops source links and the Markdown label below `xl`, and the eyebrow below `lg`.
  - The hero band is borderless and its showcase sits directly on the band (no plate).
  - `DocsSidebar` groups collapse (the current group open, the open state remembered).
- `@var-ui/docs-components`: page tabs below the hero use the pill appearance again.
