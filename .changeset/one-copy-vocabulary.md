---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': minor
---

`CodeBlock` and `CopyButton` share one set of copy props and events.

- **`CodeBlock`** (React and Astro): `copyErrorLabel` is now `errorLabel`, matching `CopyButton`. `copyText` and `errorText` are removed: the copy button is icon-only, so `copyLabel` / `copiedLabel` / `errorLabel` (its accessible name in each state) are the only labels. A copy failure shows the error icon, as `CopyButton` does.
- **React `CodeBlock`** gains `onCopied(value)` and `onCopyError(error, value)` and is built on `useCopy`. It resets after 2 seconds like `CopyButton` (it was 1.2s). The status region now announces success as well as failure; success is screen-reader-only.
- **Astro**: `CodeBlock` fires the same events as `CopyButton`, renamed to `var-ui:copied` / `var-ui:copy-error` (`COPIED_EVENT` / `COPY_ERROR_EVENT`; previously `COPY_BUTTON_COPIED_EVENT` / `COPY_BUTTON_ERROR_EVENT`), and honours `data-var-ui-timeout`. The hand-written markup contract uses `data-var-ui-error-label` (was `data-copy-error-label`) and drops the `[data-codeblock-copy-text]` span.
- **`CopyButton`**'s default `errorLabel` is now `Copy failed` (was `Error`), and `useCopy` clears `error` after the timeout, as it already did for `copied`.
