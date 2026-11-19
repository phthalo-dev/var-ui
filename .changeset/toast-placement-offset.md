---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Toasts fit around app chrome.

- **core** `toast` recipe (its screen-edge axis export is now `toastPlacement`, was `placement`): `top-center` and `bottom-center` placements, and `offsetBlock` / `offsetInline` vars (`--var-ui-toast-offsetblock` / `--var-ui-toast-offsetinline`) that move the region off its edges. They use TypeStyles' `inheritOverride`, so a value set on `:root` reaches the region, for example above a bottom player bar. Also fixes the region's `max-width`, which was a single-quoted string with an uninterpolated `${…}` and so was never applied.
- **react** `ToastProvider` and `ToastRegion` take `offset` (a length, or `{ block, inline }`). `ToastProvider` also takes `className`, `style` and an existing `queue`, which keeps its own limit unless `maxVisibleToasts` is passed. New `createToaster(queue)` returns the imperative `toast` API bound to a queue you own, for apps that render their own `ToastRegion`.
- **astro** `ToastRegion` takes `offset` with the same shape. `Grid`, `Text` and `AspectRatio` use the shared `mergeInlineStyle` helper instead of their own copies, so a `style` object no longer loses to the component's own vars.
