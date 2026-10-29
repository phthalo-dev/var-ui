---
'@var-ui/react': patch
'@var-ui/astro': patch
---

Fix `Toc` `stickyTop` never applying (the inline style used `--var-ui-toc-sticky-top`, but the recipe variable is `--var-ui-toc-stickytop`). Internal cleanup: route recipe CSS variables through `styleVars`, type the positioner style as `CSSProperties`, and drop unnecessary slot-recipe casts.
