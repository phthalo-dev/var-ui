---
'@var-ui/core': patch
'@var-ui/react': patch
'@var-ui/astro': patch
---

Move the last hand-written styles into recipes: `mobileNav` gains a `headerContent` slot (React and Astro use it instead of an inline style or a `<style>` block), the `searchInput` `command` variant sizes its trigger in the recipe instead of a `<style>` block in Astro, CommandPalette drops a redundant inline style on its input, and ProgressCircle sets its progress through the recipe's var ref instead of a hand-written custom property.
