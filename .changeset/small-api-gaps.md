---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': patch
---

Small API gaps and naming alignment (#146).

- **One appearance vocabulary.** `button`'s `filled` appearance is now `solid`, matching badge, alert, chip, toast, banner, progress and meter. `chatMessageBubble`'s `variant` axis is now `appearance` (`solid | subtle | ghost`; React `ChatMessageBubble` prop `variant` → `appearance`). Theme overrides keyed on `appearance.filled` move to `appearance.solid`; plain CSS selectors move to `[data-appearance="solid"]`.
- **New `UnstyledButton`** (core `unstyledButton`, React, Astro): a native `<button>` without chrome that keeps the cursor, focus ring and disabled state, for inline toggles and custom pressable regions.
- **Link** (core, React, Astro): `link` is now a recipe with `root` and `icon` slots. New `tone` (`accent | primary | secondary`) and `size` (`inherit | xs | sm | md | lg`). A link now inherits the surrounding font size by default (was a fixed `md`). React adds `startIcon` / `endIcon`; Astro adds `start-icon` / `end-icon` slots. Disabled links get the disabled style.
- **ProgressBar** (core, React, Astro): new `size` (`sm | md | lg`, the same track steps as `Meter`; `md` is 0.5rem, was 0.375rem). `minValue` / `maxValue` are now `min` / `max`, like `Meter` and `ProgressCircle`. Astro gains `valueLabel`.
- **ProgressBar and Meter** show value text by default only when there is a `label`, so a bare bar needs just an `aria-label`.
- **CopyButton**: `onCopied(value)` and `onCopyError(error, value)` (React; also on `useCopy`). Astro dispatches bubbling `var-ui:copy-button-copied` / `var-ui:copy-button-error` events (`COPY_BUTTON_COPIED_EVENT`, `COPY_BUTTON_ERROR_EVENT`) and exports `initCopyButton(s)`.
- **Types**: `TabDefinition`, `GridColumns`, `PaginationLabels`, `ButtonAsButtonProps`, `ButtonAsLinkProps`, the `Combobox` part props and the `Select` section/header props are exported from `@var-ui/react`. A test now fails when a component module exports a type the package root doesn't.
