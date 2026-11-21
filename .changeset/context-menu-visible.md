---
'@var-ui/react': patch
---

`Menu.ContextMenu` paints again. Its 1px virtual anchor used `visibility: hidden`, and Chrome's initial `position-visibility: anchors-visible` hides any popup whose anchor is hidden, so the menu was open but invisible and clicks went through it. The anchor now uses `opacity: 0`.
