---
'@var-ui/core': patch
'@var-ui/react': patch
'@var-ui/astro': patch
---

`TopNav` items no longer run under `endContent` on narrow screens. The start zone scrolls sideways (scrollbar hidden), with scroll-driven edge fades (`scrollFadeStart` / `scrollFadeEnd` vars) and room for focus rings. `observeTopNavIndicator` scrolls the selected item into view (new `revealTopNavItem`), and items keep their width.
