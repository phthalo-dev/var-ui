---
'@var-ui/core': minor
---

`variant="diff"` on the code-block recipe paints line backgrounds and colors from the `color.code` tokens (`addition`/`additionBackground` for `+` lines, `deletion`/`deletionBackground` for `-` lines, `section` for `@@` hunk headers), and a new `maxHeight` variable caps the code body height and scrolls inside the block.
