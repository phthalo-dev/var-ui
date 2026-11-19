---
'@var-ui/react': patch
---

`Menu.Popup` (and so `Menu.FromSections`, `Menu.Overflow`, `Menu.ContextMenu`) mounts its `[popover]` element the first time the menu opens instead of with the trigger. A 60-row list with a menu per row no longer mounts 60 hidden popovers. Triggers stay mounted, so focus still returns to them on close. A `ref` on `Menu.Popup` is `null` until the first open.
