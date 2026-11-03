---
'@var-ui/react': minor
'@var-ui/core': minor
---

Add `Splitter`: resizable split panels (the APG window splitter pattern), horizontal or vertical, with `Splitter.Panel` children and automatic `role="separator"` dividers (customise one with `Splitter.Handle`). Sizes are percentages (`sizes` / `defaultSizes` / `onSizesChange`), with `minSizes`, `maxSizes`, `collapsible` (Enter toggles), `autoSaveId` persistence, keyboard resizing (arrows, Shift for a larger step, Home/End), pointer drag with capture, double-click reset and RTL mirroring. Built on `ResizeHandle`, which gains `step`, `largeStep`, `unitsPerPixel` and an `aria-orientation` override. New core `splitter` recipe.
