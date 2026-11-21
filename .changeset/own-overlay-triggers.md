---
'@var-ui/react': minor
'@var-ui/cli': patch
---

`@var-ui/react` no longer depends on `react-aria`, directly or as a peer: install `react`, `react-dom`, `react-aria-components` and `@var-ui/core`. Our popups no longer render under a react-aria trigger's press responder, which removes the one reason we imported `react-aria` (its `Overlay`, to clear that responder).

- `Menu` provides react-aria's menu contexts itself (`MenuContext`, `RootMenuTriggerStateContext`, the popover and overlay-state contexts) instead of wrapping in RAC `MenuTrigger`. The trigger handles its own click and keys: ArrowDown, Enter and Space open with the first item focused, ArrowUp with the last. Submenus, Menubar and the presets are unchanged.
- `ColorInput`'s picker is a var-ui `Popover` (a light-dismiss native popover) instead of RAC `DialogTrigger`. It still takes focus when it opens and gives it back to the swatch.
- The internal popover shell renders its content in place, without `Overlay`. If a var-ui popup is placed inside a RAC `MenuTrigger` / `DialogTrigger`, it keeps its anchor and warns in development.
