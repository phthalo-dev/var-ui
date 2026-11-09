---
'@var-ui/react': patch
'@var-ui/core': patch
'@var-ui/astro': patch
---

Toast: the last toast now fades out before its region unmounts (React and Astro), and a toast arriving mid-exit cancels the removal. Popups cap their width against the usable viewport instead of `100vw`, so a very wide popup no longer extends under a classic scrollbar (the root element is now a CSS anchor named `--var-ui-viewport`).
