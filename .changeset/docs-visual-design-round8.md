---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/docs': minor
---

Docs visual design, round 8:

- `toc`: the rail no longer hides itself below `xl`; the layout that holds it decides (an `AppShell` aside, a docs frame).
- `collapsible` / `Accordion`: a closed panel (`hidden="until-found"`) drops its padding, so a closed row is its trigger only.
- `segmentedControl`: segments never shrink below label + padding; a row too wide for its container scrolls sideways.
- `chatLayout`: the composer dock is no longer `position: sticky` (it floated over messages inside clipped or scrolling ancestors); bound the root's height and the messages scroll above it.
- `ColorInput` `format="css"` shows a short label at rest (`phthalo-7` for `var(--var-ui-color-palette-phthalo-7)`, also for the placeholder) with the full value in the tooltip and on focus; the form value travels in a hidden input. New `colorValueLabel()` in `@var-ui/core/shared/colorLabel`.
- `@var-ui/docs`: the main content area is a size container (`docsMainContainer`); the rail and hero showcase respond to its width (shown down to a 1200px viewport with the sidebar), the showcase shrinks before it hides, and the single-column frame keeps its left edge. On pages with tabs the hero showcase overhangs the tab row, so the tabs follow the metadata by 40px; elsewhere it is sized to its scene. The showcase ends on the frame edge. `DocsPage` and `DocsGuidePage` take a `rail` slot (content above the TOC).
