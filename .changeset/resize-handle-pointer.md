---
'@var-ui/core': patch
'@var-ui/react': minor
---

`ResizeHandle` now drags with pointer events and pointer capture, so touch and pen input work and the drag keeps tracking outside the handle. The grab target extends 4px past the 1px visible line on each side (`touch-action: none` is set so touch drags don't scroll).
