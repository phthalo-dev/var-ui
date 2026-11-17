---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': minor
'@var-ui/cli': patch
---

Marketing-grade primitives and fixes:

- Tokens: fluid `fontSize.display.{sm,md,lg}`, `letterSpacing.display`, `fontWeight.light`; `size.control.xl` is now `3rem`.
- `Heading`: `size` replaces `display` with `display-sm` / `display-md` / `display-lg`, adds a `weight` axis, and balances wrapping.
- `Text`: new `mono` boolean.
- `Button`: new `xl` size and `pill` boolean.
- `Table`: cells center vertically and body row headers no longer pick up the base `th` fill.
- `Slider`: never wider than its container.
- `CodeBlock`: lighter shadow; Astro plain/terminal code is no longer double-escaped (`&quot;`).
- `DocsMarketingPage`: `bleed` prop for edge-to-edge pages and a `footer` slot.
- Radius scale is now `sm` 4px / `md` 6px / `lg` 12px / `xl` 16px; `Card` uses `lg` radius and `lg` padding; `SegmentedControl` uses the control radius (`md`).
- New `color.overlay.shadow` ink token; shadows no longer tint with the (light) text color in dark mode.
- New `xxl` (90rem) breakpoint.
- `MobileNav` toggle declares its color vars on the `toggle` slot, so the hamburger is visible when rendered outside the popup (docs header ≤768px).
- New `color.background.code` / `codeHeader` tokens (surface nudged toward the accent); `CodeBlock` uses them, and generated themes include them.
- `Tabs`: the grid track shrinks (`minmax(0, 1fr)`), so wide panel content scrolls instead of overflowing.
- `SideNav`: button items (no `href`) reset native button chrome.
- Tone faces: filled-surface text never uses a fallback that fails 4.5:1 (falls back to near-black ink).
- `CodeBlock`: scroll-driven right-edge fade while code overflows horizontally (new `scrollFade` var; no fade when nothing overflows or without scroll timelines).
- Code surface tokens mix in sRGB (no hue drift toward pink on warm neutrals); light mode tints the surface rather than `subtle`.
- New `figtreeGrotesk` font preset (Figtree body, Space Grotesk display, JetBrains Mono).
- Type scale: `fontSize.xs` / `sm` pinned to 12px / 13px (legibility floor for captions, badges, mono labels).
- `Calendar`: the day grid and nav buttons opt out of element base styles (table borders, `th` fill, native button chrome).
- `Calendar`: new `marked` prop (ISO strings or date values) draws a marker dot on those days; today gets a ring; selection/hover now style the day cell itself (they targeted a child that doesn't exist); the standalone grid shrinks with narrow containers.
- New `scrollFade` recipe: scroll-driven edge fades for any horizontal scroller (shared with `CodeBlock`'s fade via an internal helper).
- `ChatMessage`: the 80% width cap moved from the bubble to the message content column, so short bubbles no longer wrap into a narrow column.
- `Switch` / `Checkbox` / `Radio`: the control root is `position: relative`, so the visually-hidden native input sits on the control. It used to resolve against a distant positioned ancestor, and focusing or clicking a control inside a scroll container scrolled that ancestor (blanking an app shell).
- `Layout` content / panel scrollers and `AppShell` main are containing blocks (`position: relative`), so absolutely positioned descendants scroll with them.
- `CodeBlock`: new `fontSize` var (defaults to `fontSize.sm`) for the code and line numbers.
- `@var-ui/cli`: republish the generated docs catalog for the component changes above.
