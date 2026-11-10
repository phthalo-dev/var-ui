---
'@var-ui/react': minor
'@var-ui/astro': minor
---

API contract and React/Astro parity leftovers:

- `useTableSelection` uses the same vocabulary as `Select`: `multiple` (opt-in), plus `value`, `defaultValue` and `onValueChange` with row ids as `string[]`. It returns `value`, `isSelected`, `toggle`, `selectAll`, `clear` and `setValue`. The `selectedKeys`/`onSelectionChange` options and the `SelectionMode` type are gone.
- `useChatNewMessages` takes `locked` instead of `isLocked`. The public-props guard now also checks hook options.
- `Menu` (React) supports a single choice: `value`, `defaultValue` and `onValueChange` on `Menu`/`Menu.Root` and `Menu.FromSections` turn items into `menuitemradio` with a check mark. Astro `Menu` replaces `selectionMode` and `selectedId` with the same `defaultValue` (`null` = selectable, nothing checked).
- `Card` takes `href`: the whole card becomes a link with `title`, `description` and `hint`, like `Button`. `ClickableCard` is removed from both packages; use `<Card href>`.
- `Pill` is removed; use `<Chip onRemove>`.
- Astro `ToggleButton` takes `defaultSelected` instead of `pressed`, matching React.
