---
'@var-ui/react': minor
'@var-ui/core': minor
---

Add `Menu.Submenu`: nested menus for `Menu` and `Menubar.Menu`. The trigger item has a chevron (mirrored in RTL) and `aria-haspopup`/`aria-expanded`; the child menu opens beside it on hover, ArrowRight, Enter or Space (mirrored in RTL), closes with ArrowLeft or Escape, and choosing an item closes the whole chain. Menubar keeps Left/Right for the bar except inside submenus. `Menu.FromSections`, `Menu.ContextMenu` and `Menu.Overflow` items accept `items` to render a submenu. The `menu` recipe gains `itemIcon` and `submenuPopover` slots and styles `submenuChevron`.
