---
'@var-ui/core': minor
'@var-ui/react': patch
'@var-ui/astro': patch
---

Export `Density`, `Gap`, `Orientation` and `Sender`, the value types of the shared `density`, `gap`, `orientation` and `sender` variant axes, alongside `Tone`, `SurfaceAppearance` and `ControlSize`. React and Astro component props that use a shared axis now name it with these types instead of `NonNullable<XVariantProps['axis']>`. The accepted values are unchanged.
