---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/cli': minor
---

Add a `danger` tone to `Text` (`<Text tone="danger">`), colored with the danger foreground token. Previously `tone` only accepted `primary` and `secondary`, so a downstream `tone="danger"` was a type error and was ignored at runtime. Closes #48.
