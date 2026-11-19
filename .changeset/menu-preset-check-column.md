---
'@var-ui/react': patch
---

`Menu.FromSections`, `Menu.ContextMenu` and `Menu.Overflow` items no longer reserve an empty check column. Only single-choice sections (`defaultValue`) and single-choice menus (`value` / `defaultValue` on the root) show it, the same as `Menu.Item` and the Astro `Menu`. Plain action menus lost a 24px indent before every label.
