---
'@var-ui/react': patch
'@var-ui/core': patch
---

Bug fixes from the component audit:

- `className` now reaches the root of `TextField`, `TextAreaField`, `PasswordInput`, `CheckboxGroup` and `RadioGroup` (string or render-prop function); it was overwritten by the recipe class.
- Ship the `'use client'` directive in every `@var-ui/react` module so the package works from Next.js server components (guarded by `scripts/check-use-client.mjs`).
- `Checkbox` renders an indeterminate state; `Form` reports rejected async `onSubmit` (new optional `onError`) and keeps a stable default `errors`.
- `Dialog.Description` is wired to `aria-describedby`; `AlertDialog` is no longer dismissed by a backdrop click by default (Escape still closes it).
- Keyboard-invoked `ContextMenu` anchors to the target instead of the top-left corner; `CommandPalette` fires `onOpenChange(false)` once and its `mod` hotkey is Meta on Apple platforms, Ctrl elsewhere.
- `PinInput`, `MultiSelector`, `Tokenizer` and `FileInput` accept `name` (so `FormData` includes them); description/error text is linked via `aria-describedby` on `PinInput`, `MultiSelector`, `Tokenizer` and `ColorInput`.
- `Chip` remove and `FileInput` clear controls are no longer nested inside another button; `Chip` also removes on Backspace/Delete. `ColorPicker` hue/alpha sliders are keyboard operable.
- `useResizable` no longer reads `localStorage` during the first render (hydration mismatch), `useMediaQuery` no longer resubscribes every render, and storage access in the provider/color mode is guarded.
- `Carousel` exposes carousel/slide ARIA semantics with overridable labels; `Alert` accepts an optional `role`.
