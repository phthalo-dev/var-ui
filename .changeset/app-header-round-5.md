---
'@var-ui/core': patch
'@var-ui/react': patch
'@var-ui/astro': patch
'@var-ui/icons': patch
'@var-ui/docs': patch
'@var-ui/docs-components': patch
'@var-ui/cli': patch
---

App header polish, round 5:

- `Menu` sections take `closeOnSelect` (React and Astro). Set it to `false` to keep the menu open on a pick, as `layout: 'row'` sections already do. The docs Appearance menu now stays open on a Theme pick too.
- `SegmentedControl` takes `fullWidth` (React and Astro): it fills its container and gives every segment an equal share. `FrameworkSwitcher` passes it through.
- `SideNav.Section` / `SideNavSection` takes `selectionStyle: 'fill' | 'text'`. With `'text'`, the current item shows accent text only, with no fill and no bar. The docs drawer uses it for the site sections, so the current page row is the only filled row.
- Icons: the brand mark has a 16px optical size, `varUiMarkSmall` / `varUiMarkSmallSvg` (16 grid, 2px strokes on whole pixels). `varUiFaviconSvg` now uses it.
- Command palette: one match highlight style (accent ink at the line's own weight) for titles and descriptions. Ranking now puts word starts above camelCase humps and description starts above mid-description hits, and adds one-typo title matching for queries of 4+ characters when nothing matches as typed.
- Top nav: the light hover chip comes from the neutral hover step plus a touch of ink, so it keeps the palette's hue.
- Docs kit: one 24px gap after the brand at every width, and the drawer's brand, links and preferences share one 16px inset.
- Docs kit: the bar shows the `var(--ui)` lockup from `lg` up (the tile alone below), and the search trigger reads "Search…" (accessible name "Search docs") so the tablet-width bar fits without overflowing. `DocsSearch` gains `triggerPlaceholder` and `label`.
