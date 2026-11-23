---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Every `data-*` attribute a component renders is now either public (documented) or internal (`data-var-ui-*`). There is no undocumented middle ground any more.

- **Public**: recipe variant axes and every attribute the recipes select on, including root flags set on an ancestor of a slot (AppShell `data-aside`, Layout `data-has-header`, …) and markers inside a slot (Calendar `data-calendar-mark`). They are listed in each component's Styling hooks table. Newly documented in the Plain CSS guide: `data-valid`, `data-dirty`, `data-touched` (Field), `data-has-children` (Tree items), `data-row-header` (Table), `data-trigger` (react-aria popups), `data-language` (code block).
- **Renamed to `data-var-ui-*`** (script wiring and config, not a styling API): the Astro script attributes for Accordion, Banner, ColorModeToggle, CommandPalette, CopyButton, Menu, SegmentedControl, SideNav, Toast, Toc, the shared copy vocabulary (`data-var-ui-code`, `data-var-ui-copy-label`, `data-var-ui-copied-label`, `data-var-ui-error-label`, `data-var-ui-timeout`, `data-var-ui-value`) and the `data-class-*` payloads (now `data-var-ui-class-*`); React's Carousel, Menubar, ToggleGroup, Splitter, Tree, context-menu, icon-fallback and popover markers; TopNav's `data-label` (now `data-var-ui-label`).
- **Removed** (each part already has a slot class): `data-codeblock`, `data-codeblock-header`, `-body`, `-pre`, `data-alert-action`, `data-empty-state-icon`, `data-loading-overlay-content`, `data-timeline`, `data-timeline-item`, ScrollArea `data-edge`, AppShell `data-has-top-nav`. Select `.var-ui-code-block`, `.var-ui-code-block__body`, `.var-ui-alert__actionLink` and so on instead.
