---
'@var-ui/core': patch
---

ToggleButton: a selected button keeps its accent fill on hover. The base hover set `background-color` directly, which beat the selected hover var and paired a light fill with the light selected label.
