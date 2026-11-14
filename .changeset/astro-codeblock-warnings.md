---
'@var-ui/astro': patch
---

The Astro `CodeBlock` copy script toggles state with `data-copied`/`data-error`/`data-tone` attributes instead of swapping class names, and the component merges one recipe slot per element (no more typestyles dev warnings from `combine()`).
