---
'@var-ui/core': minor
'@var-ui/react': patch
---

Element base styles no longer format content (#170).

- **core** The `base` layer keeps document defaults only: body text and background, font roles (display headings, mono code), semibold `strong`, link colour and the focus ring. Heading sizes and margins, paragraph and list spacing, `pre` chrome, blockquote, `hr`, and table borders, `th` fills and cell padding were applied to every bare element on the page. They now come from `prose` / `<Prose>`, scoped to its container. Components that render a `<table>`, a heading or a list (Table, Calendar, SideNav, the docs header) no longer inherit formatting they had to undo. **Wrap rendered markdown or rich text in `Prose`** (or add the `var-ui-prose` class) to keep it formatted. `prose` gains `caption` styles.
- **core** Anchored popups use `self-` logical `position-area` keywords, so `start` / `end` alignment follows the popup's own direction. Under a subtree `dir="rtl"` (a `DirectionProvider`), popups narrower than their trigger aligned to the physical left edge. The leaked table cell padding had hidden this by making the date picker as wide as its field.
