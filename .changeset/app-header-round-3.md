---
'@var-ui/core': patch
'@var-ui/react': patch
'@var-ui/astro': patch
'@var-ui/docs': patch
'@var-ui/cli': patch
---

App header round 3: menu keyboard model, palette states, drawer footer, stronger selection.

- **core** `topNav`: hover is a 5% ink wash, visible on a white bar (the neutral surface step all but vanished in light mode).
- **core** new `@var-ui/core/shared/menuNavigation` (`menuArrowTarget`): the arrow-key model for menus with `layout: 'row'` sections, shared by React and Astro.
- **core** `menu`: list rows share one 36px rhythm; row-section items keep their 32px segments.
- **core** `segmentedControl`: unselected segments a step quieter than `text.secondary`; the light thumb gets a `border.default` hairline, the dark thumb is clearly lighter than the track with a lit top edge (new `indicatorHighlight` var).
- **core** `searchInput` (`command`): the hairline goes transparent while focused, so the focus ring is the only outline.
- **core** `commandPalette`: new `emptyIcon`, `emptyTitle`, `emptyHint` and `cancel` slots; the footer hides while the list is empty (`data-empty` on `frame`) and on touch-first devices, where `cancel` shows instead. Matches use one treatment in titles and subtitles (accent ink, no chip).
- **core** `mobileNav`: new `footer` slot, pinned under the scrolling body.
- **react / astro** `Menu`: in a `layout: 'row'` section ArrowLeft/Right wrap within the row and ArrowUp/Down treat the row as one stop (entering on the checked item); picking a row item keeps the menu open. `CommandPalette`: the empty state echoes the query (`No results for “…”`) with an optional `emptyHint`, a `cancelLabel` button for touch, and Recent items name their group in the subtitle. `MobileNav`: `footer` prop (React) / `footer` slot (Astro).
- **docs** `DocsMobileMenu`: a divider between the site sections and the page tree; Preferences are pinned in the drawer footer. `DocsSearch`: an `emptyHint` suggestion. `DocsAppearanceMenu`: the theme cue is a ringed swatch dot at the glyph's corner instead of an underline bar.
