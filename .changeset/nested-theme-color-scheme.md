---
'@var-ui/core': patch
'@var-ui/react': patch
---

Fix nested theme surfaces so they inherit an ancestor's pinned `data-color-mode` instead of following the OS. Theme classes like `.theme-var-ui-rose` now use `color-scheme: inherit` when nested without their own pin, while root or pinned theme surfaces keep an explicit `color-scheme`. Also documents the SSR hydration pitfall when initializing `DesignSystemProvider`'s controlled `colorMode` from `localStorage`.
