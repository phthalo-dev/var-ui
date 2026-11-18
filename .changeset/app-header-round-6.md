---
'@var-ui/core': patch
'@var-ui/react': patch
'@var-ui/astro': patch
'@var-ui/docs': patch
'@var-ui/cli': patch
---

App header polish, round 6:

- Breakpoints: `typestyles.breakpoint(name, 'max')` and `media(name, 'max', …)` now emit an exclusive range query (`(width < 48rem)`), so "below md" and "md and up" no longer both match at exactly 768px. `AppShell` / `Layout` mobile queries follow. Calling `breakpoint(name)` without a feature now means `'min'` (it used to emit an invalid `@media (48rem)`). This works around phthalo-dev/typestyles#345.
- Button: neutral `ghost` buttons hover in the same warm chip as the top nav (`neutralHoverChip`), and every `ghost` button keeps its hover fill while its popup is open (`aria-expanded="true"`). New recipe var: `--var-ui-button-ghosthover`.
- Command palette: the active row keeps body ink (`resultSelectedForeground` defaults to `text.primary`), so the accent match highlight stays visible in it.
- Command palette ranking: a mid-word title or keyword hit (`sel` in Carousel) ranks below description word starts; keywords match at word starts. One-typo ties prefer the longer correctly typed prefix (`inpt` → Input* above Installation).
- Command palette items take `headings` (React and Astro): section headings searched below the title and description prefix. When a heading is the match, it is shown as the subtitle.
- Docs kit: `DocsPage` / `DocsMarketingPage` take a `drawerBrand` slot (falls back to `brand`) for the drawer header. Guide frontmatter takes `keywords`. The drawer's divider under the site sections is full-bleed.
