---
'@var-ui/core': minor
'@var-ui/react': minor
---

Table: `bordered`, `minWidth`, and `ref` on the `<table>` (#145).

- **core** `table`: new `bordered` variant (outer border and surface radius on the root scroller; the last body row drops its divider) and a `minWidth` variable (`--var-ui-table-minwidth`) for the `<table>`'s minimum width. `hasHover` is renamed `highlightOnHover`.
- **react** `Table`: new `bordered` and `minWidth` props; `hasHover` is renamed `highlightOnHover`. `ref` now points at the `<table>` (it was the root `<div>`), matching the form fields: `className` and `style` style the root, `ref` and every other native attribute reach the `<table>`.
