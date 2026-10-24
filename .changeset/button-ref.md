---
'@var-ui/core': patch
'@var-ui/react': patch
---

`Button` accepts a `ref` and forwards it to the underlying `<button>`, so callers can return focus to the trigger. Closes #49.
