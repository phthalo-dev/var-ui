---
'@var-ui/react': minor
---

`Tree` selection is named like `Select`: `multiple` replaces `selectionMode`. Passing `value`, `defaultValue` or `onValueChange` makes rows selectable (single by default, `string | null`); add `multiple` for `string[]`. Without any of them a row click toggles expansion, as `selectionMode="none"` did. The `TreeSelectionMode` type is no longer exported. `Menu` follows the same rule: `onValueChange` alone now also makes it a single-choice menu.
