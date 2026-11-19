---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

`Card` gaps from real apps:

- **react** `onClick` makes a div card pressable. The title renders as a `<button>` whose `::after` covers the card: button semantics, focus and Enter/Space, the title as its accessible name, and no block content inside a button. Inner links and buttons stay clickable.
- **react, astro** Every card takes `description`, and `titleEnd` (Astro: the `title-end` slot) for a badge at the end of the title row. React link cards accept a node `title`.
- **core** `card` recipe: new `header`, `titleEnd`, `description` and `action` slots and the `data-pressable` root state. A div card with no children no longer renders an empty body, which added a stray gap.
