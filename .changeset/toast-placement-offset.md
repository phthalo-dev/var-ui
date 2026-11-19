---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Toasts fit around app chrome.

- **core** `toast` recipe: `top-center` and `bottom-center` placements, and `offsetBlock` / `offsetInline` vars (`--var-ui-toast-offsetblock` / `--var-ui-toast-offsetinline`) that move the region off its edges, for example above a bottom player bar. Also fixes the region's `max-width`, which was a single-quoted string with an uninterpolated `${…}` and so was never applied.
- **react** `ToastProvider` and `ToastRegion` take `offset` (a length, or `{ block, inline }`). `ToastProvider` also takes `className`, `style` and an existing `queue`. New `createToaster(queue)` returns the imperative `toast` API bound to a queue you own, for apps that render their own `ToastRegion`.
- **astro** `ToastRegion` takes `offset` with the same shape. New `withStyle(own, style)` util merges component-owned declarations into a string or object `style` (the caller's declarations win). `Grid`, `Text` and `AspectRatio` now use it, so a `style` object no longer loses to the component's own vars.
