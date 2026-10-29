---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

React and Astro components now import recipes from narrow `@var-ui/core/components/*` subpaths instead of the barrel, so importing one component no longer registers every recipe's CSS during extraction. `@var-ui/core` gains `./components/breakpoints`, `./components/layoutShellVars`, `./tokens/declare` and `./icons/iconNames` subpaths.
