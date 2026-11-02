---
'@var-ui/react': minor
'@var-ui/core': minor
---

Add `Menubar`: a horizontal bar of menus (File, Edit, View...) following the WAI-ARIA menubar pattern. `<Menubar aria-label="Application"><Menubar.Menu label="File">...</Menubar.Menu></Menubar>` reuses the `Menu.Item`, `Menu.Section` and `Menu.Separator` parts for the popups, has one Tab stop, Left/Right (mirrored in RTL), Home and End between top-level items, switches menus with Left/Right and on hover while one is open, and reports `details.reason` through `Menubar.Menu`'s `onOpenChange`. Adds the `menubar` core recipe. `ToggleGroup` now shares its roving-focus logic with `Menubar` (no behaviour change).
