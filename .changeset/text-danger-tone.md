---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/cli': minor
---

Add the semantic tones to `Text`: `accent`, `success`, `warning`, `danger` and `info` (for example `<Text tone="danger">`), each colored with that tone's foreground token. Previously `tone` only accepted `primary` and `secondary`, so a downstream `tone="danger"` was a type error and was ignored at runtime. The axis is built from the token tone keys, so a new tone token has to be styled here. Closes #48.
