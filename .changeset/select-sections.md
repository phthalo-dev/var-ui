---
'@var-ui/core': minor
'@var-ui/react': minor
---

`Select` supports option sections and render hooks on the preset: pass `sections` (`{ title, options }[]`, in place of `options`) to group options under headings — the core recipe gained `group` / `groupHeading` slots with a muted uppercase heading (`Select.Section` / `Select.Header` exist for the compound API too). `renderOption` customizes each row and `renderValue` the closed trigger (it receives the selected option, or `null` when nothing is selected). Options accept a `textValue` for typeahead and the trigger, used when the label is a node or the row shows more than the label.
