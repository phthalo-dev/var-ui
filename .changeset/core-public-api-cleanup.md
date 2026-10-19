---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/cli': patch
---

Trim the `@var-ui/core` public entry down to recipes, tokens, and theme helpers. Variant props come from the TypeStyles recipes, and package subpaths only list real components.

### Breaking (@var-ui/core)

- The `types` re-export barrel is gone. `DesignTheme*` and `OverrideConfigFor` stay on the theme entry. TypeStyles passthroughs (`OverrideConfig`, `SlotOverrideConfig`, `CreateTokenValues`, `colorModes`, `conditional`, and the rest) are no longer re-exported — import them from `typestyles`.
- Hand-written recipe aliases are gone (`*RecipeProps`, `DrawerSize`, `TimelineSize`, `AvatarSize`, `AvatarStatusTone`, `ToastPlacement`, `ScrollAreaFade`, `ScrollAreaOrientation`, `SpinnerAppearance`, `ProgressBarAppearance`, `StatusDotAppearance`). Use `RecipeVariants<typeof recipe>`, plus `ControlSize`, `Size`, `FillAppearance`, and the `placement` axis.
- Example recipes `layoutUtility`, `text`, and `namedContainerQuery` are removed, including the `ds-layout`, `ds-text`, and `ds-named-cq-*` classes.
- Short subpaths such as `@var-ui/core/button` are removed. Import from `@var-ui/core` or `@var-ui/core/components/button`. Authoring helpers (`controlSize`, `controlFocus`, `fieldChrome`, `layoutShellVars`, `breakpoints`) are not entry points.
- `@var-ui/core/internal` is removed. Overlay motion is `@var-ui/core/shared/overlayMotion`. Shared tone and variant axes are `@var-ui/core/shared/semanticTone` and `@var-ui/core/shared/variantAxes`.
- Hex and HSV converters are no longer exported from core.

### Breaking (@var-ui/react)

- The `layout` and `text` style helpers are removed. Use `Stack`, `Text`, and `Heading`.
- `DrawerSize`, `TimelineSize`, `AvatarSize`, and `AvatarStatusTone` are no longer re-exported. `ToastPlacement` remains and is derived from the shared `placement` axis.

### Patch (@var-ui/cli)

- The published catalog matches the trimmed core exports.
