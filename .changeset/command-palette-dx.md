---
'@var-ui/core': minor
'@var-ui/react': minor
---

`CommandPalette` DX pass:

- Items accept `onSelect`; `onAction` is now optional.
- The palette closes itself after an item is chosen (`closeOnAction`, default `true`). Callers that closed it in `onAction` can drop that.
- Items accept `icon` and `shortcut` (key-cap hints).
- `hotkey` takes a combo string or array (`'mod+k'`, `'ctrl+shift+p'`) as well as a boolean.
- New `controller` prop plus `createCommandPalette()` / `useCommandPalette()` to open the palette from outside the component tree.
- New `highlightMatches` prop wraps matching text in a `<mark>`.
- Core recipe gains `resultIcon`, `resultBody` and `resultShortcut` slots; `resultLink` is now a flex row.
