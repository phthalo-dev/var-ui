---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Move all sizing to `rem` and onto design tokens. `space`, `fontSize`, `radius`, `borderWidth` and `breakpoint` defaults are now `rem`, and no component style uses `px` (the one exception is the `toc` scroll-spy `rootMargin`, which `IntersectionObserver` only accepts in `px`). `size.control` gains `xs` and `xl`, and new `size.field`, `size.panel`, `size.indicator` and `size.media` groups replace repeated literals (field min-widths, popup/dialog/drawer widths, checkbox/radio/switch geometry, thumbnails and empty-state artwork). `Avatar` sizes come from `size.control`, and its status dot is now a `StatusDot` positioned by the `status` slot (no wrapper span, no ring, no `data-avatar-status`). `ProgressCircle`'s `thickness` var is now a unitless number. A few sizes shift slightly (Avatar `sm`/`lg`, ProgressCircle `sm`/`md`, some panel widths, prose headings).
