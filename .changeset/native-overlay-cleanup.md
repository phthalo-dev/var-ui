---
'@var-ui/react': minor
'@var-ui/core': minor
---

Remove what the native `<dialog>` and `popover` overlays replaced, and add gates so it cannot return.

**Removed from `@var-ui/react`**

- `LayerProvider` and `useLayer`. Overlays live in the top layer and need no stacking coordination; remove the provider from your app root.
- `useOverlayPresence` (and its types), `usePositionerVars`, `OverlayPlacement` and the related types. Enter and exit are CSS (`@starting-style`).
- `useScrollLock`. Scroll lock is one global CSS rule (`html:has(dialog:modal)`).
- The `'unknown'` value of `OverlayOpenChangeReason`. Changes with no observed cause now report `'imperative'`, and `inferOverlayCloseReason` returns `'imperative'` for unrecognized events.

**Removed from `@var-ui/core`**

- The `layerStack` recipe, `layerZIndex`, and the `positioner` recipe (CSS classes `var-ui-layer-stack` and `var-ui-positioner`, variables `--var-ui-layer-stack-zindex` and `--var-ui-positioner-*`).
- The `zIndex` tokens `dropdown`, `toast` and `modal`. `base`, `raised`, `lifted`, `sticky`, `overlay` (the `LoadingOverlay` scrim) and `max` (the focused skip link) remain for in-flow content.

**Docs**: the Overlay lifecycle page now describes the native model; `data-starting-style`, `data-ending-style` and the `--var-ui-available-*` positioner variables no longer exist.

**Dependencies**: TypeStyles is now `^0.34.0` (`@typestyles/vite` `^0.6.0`, `@typestyles/build-runner` `^0.7.0`, `@typestyles/rollup` `^0.5.9`).
