---
'@var-ui/core': minor
'@var-ui/react': patch
'@var-ui/astro': minor
---

Astro `LayoutPanel` takes `responsive={{ below, mode }}` (and `defaultOpen`), the same shape as React. Below the breakpoint, CSS hides the panel on the first paint. `overlay` moves it into a native modal `<dialog>` drawer when opened, and `hidden` shows it in place. Open it with a `data-var-ui-layout-panel-toggle` button whose `aria-controls` names the panel, or with `setLayoutPanelOpen` / `toggleLayoutPanel`. It fires `var-ui:layout-panel-open-change`.

The CSS lives in the core `layoutPanel` recipe (`data-responsive` / `data-responsive-below`, with `LAYOUT_PANEL_POPUP_ATTRIBUTE` marking the drawer). React sets the same attributes, so its server-rendered first paint is right too.
