---
'@var-ui/react': minor
---

`Dialog.Root` gains a `title`/`description` shorthand (renders the popup, header with close button, and treats `children` as the body — the `useDisclosure` example now type-checks), an `onClose` convenience that fires on close requests unless the change was vetoed, and a `size` pass-through; `Dialog.Popup` gains a `size` prop (`sm` | `md` | `lg` | `xl`).
