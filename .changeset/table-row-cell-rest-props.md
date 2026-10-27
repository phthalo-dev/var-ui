---
'@var-ui/react': minor
---

`Table.Row` and `Table.Cell` now forward remaining props (`onClick`, `onDoubleClick`, `data-*`, `aria-*`, `id`, …) to the underlying `<tr>`/`<td>`/`<th>` instead of silently dropping them.
