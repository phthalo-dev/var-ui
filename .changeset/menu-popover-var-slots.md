---
'@var-ui/core': patch
'@var-ui/react': patch
---

Paint portaled menu surfaces and item labels. Menu color variables now name the `popover` slot, so typestyles emits the default and theme overrides on the popover itself. React portals that slot outside `.var-ui-menu`, where a custom property set only on the host stays transparent.
