# var-ui Roadmap

Tracking doc for var-ui's own design-system work, in the style of
[TypeStyles' `IMPROVEMENTS.md`](https://github.com/phthalo-dev/typestyles/blob/main/IMPROVEMENTS.md)
(the sibling project this is built on). Each task ships as its own PR; check
items off and link the PR as they land. Full designs live in `specs/`.

## Why var-ui exists

Meta open-sourced **Astryx**, an internal-tools design system built on
StyleX. Astryx's actual achievement is that a restrictive compiler (StyleX)
can still produce a flexible, easily-themeable system — but it gets there by
working _around_ StyleX: theming is 100% plain CSS custom properties
generated from a `defineTheme()` config, component-level overrides are plain
CSS scoped via `@scope` against stable classes, and StyleX itself is demoted
to an internal implementation detail plus an optional `xstyle` escape hatch
for power users.

var-ui exists to prove the same flexible, CSS-native theming story doesn't
need a workaround in the first place, when the foundation is
[TypeStyles](https://github.com/phthalo-dev/typestyles) instead of StyleX:
real CSS custom properties, semantic/readable class names, cascade layers, and
a general theme condition engine, all reachable directly — no compiler
restriction to route around, no escape hatch needed for the common case.

**Scope:** var-ui is the actual public, open-source design system —
components, themes, tokens, docs, and a public npm surface (`@var-ui/*`). Core
CSS/theming _engine_ capabilities that var-ui needs from TypeStyles itself
(generative color/type/motion/radius scales, the `@scope` override helper, the
`descendant` condition-engine scope) are designed and built in the TypeStyles
framework — var-ui consumes them as a versioned dependency, it doesn't reimplement
them. See TypeStyles' `IMPROVEMENTS.md` P5 section for that side of the work.

## Status of TypeStyles engine dependencies

| Capability                                                                   | TypeStyles status  | var-ui impact                                             |
| ---------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------- |
| `typestyles/color-scale` (`parseColor`, `generateRamp`, `contrastRatio`)     | **Shipped**        | Powers `createColorTheme` today                           |
| `typestyles/token-scale` (geometric/linear scale + duration-band generators) | **Shipped** (0.8)  | V2 ready — spec: `type-motion-radius-scale-generation.md` |
| `styles.scope()` + classname-stability contract + lint rule                  | **Shipped** (0.8)  | V3 ready — spec: `component-override-contract.md`         |
| `descendant` scope on the theme condition engine                             | **Shipped** (0.8)  | V4 ready — spec: `surface-tone-override.md`               |
| `override()` + `__tsMeta` component metadata contract                        | **Shipped** (0.10) | V7 ready — spec: `typed-component-theming.md`             |

Don't re-derive these designs here — when picking up a blocked item, check
TypeStyles' `IMPROVEMENTS.md`/`specs/` for current status first.

---

## V1 — Color theme generation

- [x] **V1 — `createColorTheme`** — generate a full functional light/dark
      color palette from one accent color, built on `typestyles/color-scale`.
      Spec: `specs/color-scale-generation.md`.

## V2 — Generative primitive scales

- [ ] **V2 — Wire `generateGeometricScale`/`generateLinearScale`/
      `expandDurationBand` into `packages/core/src/tokens/primitive.ts`** —
      replace hand-picked `fontSizeValues`/`radiusValues` and add duration
      min/max bands. Requires `typestyles` **^0.8.0**. Spec:
      `specs/type-motion-radius-scale-generation.md`.

## V3 — Component override contract

- [ ] **V3 — Adopt the classname-stability contract across `packages/core`
      recipes** — treat every `recipe()` semantic class name as public
      API once published; audit recipes for anything themeable that isn't
      already exposed as a component-scoped CSS variable (the `c.vars()` pattern
      `button.ts` already uses) and expose it; commit classname snapshot + lint
      rule. Requires `typestyles` **^0.8.0** and `@typestyles/eslint-plugin`.
      Spec: `specs/component-override-contract.md`.

## V4 — Surface tone overrides

- [ ] **V4 — `surfaces` config + `SURFACE_ATTRIBUTE` convention** — let a
      theme define fixed light/dark faces for a marked subtree (an always-dark
      toast on a light page, etc.), and roll it out to all 8 built-in themes.
      Requires `typestyles` **^0.8.0** (`descendant` scope). Spec:
      `specs/surface-tone-override.md`.

## V5 — Theme gallery, packaging, and the var-ui.com site

- [ ] **V5 — Public theme gallery + packaging decision + var-ui.com site** —
      compare all 8 built-in themes side by side (light/dark faces together, once
      V4 lands), decide on standalone `@var-ui/theme-*` packages now that
      publishing is real, and build the actual var-ui.com site this lives on
      (site framework: **Astro + Netlify** in `docs/`; separate from TypeStyles'
      own docs site — nothing here can reuse that site's `LiveDemo` component
      directly). Spec: `specs/theme-gallery.md`.

## V6 — Component breadth (Astryx core parity)

- [ ] **V6 — Grow `@var-ui/core` from ~22 recipes to ~95 module families**
      (matching Astryx core scope, excluding lab/charts). Phased plan:
      infrastructure (Field, LayerProvider, layout primitives,
      `@var-ui/icons` + `IconProvider`), then
      feedback/content, forms/menus, overlays, tables/lists, navigation,
      layout polish, and chat. Spec: `specs/component-breadth.md`.
  - Can proceed in parallel with V3 (`c.vars()` audit on existing recipes).
  - `@var-ui/lab` (charts, Schedule, Stepper, etc.) is a separate track —
    see spec's Lab tier section.
  - [x] **Phase 0 — infrastructure** — `field` recipe + shared `fieldChrome`
        (textField/textAreaField/select refactored, class names unchanged);
        icon system (`IconName` + `icon` recipe in core, `IconProvider`/`useIcons`/
        `<Icon>` with empty fallback in react, new **`@var-ui/icons`** package with
        bundle 1 glyphs as optional peer); layout primitives (`stack`, `grid`,
        `divider`, `section`, `center`, `aspectRatio` + React wrappers incl.
        `HStack`/`VStack`); floating-layer groundwork (`overlay` recipe,
        `LayerProvider`/`useLayer`, `useMediaQuery`, `useScrollLock`); jsdom +
        testing-library test project for `packages/react`.
        Plan: `docs/superpowers/plans/2026-07-05-component-breadth-phase-0-1.md`.
  - [ ] **Phase 1 — feedback, content atoms, containers** — shipped: Spinner,
        Skeleton, ProgressBar, Banner, StatusDot, EmptyState, Kbd, Heading, Text,
        Avatar/AvatarGroup, Badge + Card/ClickableCard wrappers, Carousel,
        Thumbnail, Timestamp; registry icons wired into Alert, Select, Dialog,
        CodeBlock. Remaining before closing the phase: visual QA pass across all
        8 themes in the example app.
  - [x] **Phase 2 — actions, menus, and form expansion** — shipped: IconButton,
        ButtonGroup, SegmentedControl, ToggleButton, DropdownMenu, ContextMenu,
        MoreMenu, Slider, NumberInput, Toolbar, FileInput, InputGroup/
        InputGroupText, CheckboxGroup, Calendar, DateInput, DateRangeInput,
        DateTimeInput, TimeInput, Typeahead, Tokenizer, MultiSelector.
        `RadioGroup` (shipped in Phase 0/1) already fulfills the spec's
        "RadioList" line item — no separate component needed. Astryx's
        `Selector` turned out to be functionally redundant with var-ui's
        existing `Select` (RAC `Select`+`ListBox` already covers its
        static-list model); its extras — nullable/clear, sections/dividers,
        inline filter, start icon — are candidates for a future `Select`
        polish pass rather than a new component. `PowerSearch` is deferred:
        it's a bespoke filter-bar/query-builder composed from Typeahead/
        Tokenizer/Selector/date inputs, not a primitive itself, and is
        better scoped once there's a real consumer need. Remaining
        nice-to-haves: `InputGroupText` prefix/suffix polish pass,
        `CheckboxList`/`RadioList`-style per-item description/disabled
        support if a consumer need appears.
  - [x] **Phase 3 P1 — overlays and command surfaces** — Toast (hybrid provider),
        Tooltip/Popover/HoverCard, AlertDialog, CommandPalette. Spec:
        `specs/phase-3-overlays-p1.md`. Plan:
        `plans/2026-07-15-phase-3-overlays-p1.md`.
  - [ ] Phase 3 P2 — Lightbox/Overlay
  - [x] **Phase 4 — lists, tables, and data display** — shipped: `List`/
        `List.Item`, `DescriptionList`/`DescriptionList.Item`, `OverflowList`
        (+ `useOverflow`), `Table` (+ `useTableSort`/`useTableSelection`/
        `useTablePagination`), `Tree`/`Tree.Item` (+ `useTreeFocus`); icons
        `arrowDown`/`arrowsUpDown`. Filter/column resize deferred. Shipped on
        branch `phase-4-lists-tables`. Spec:
        `specs/phase-4-lists-tables.md`. Plan:
        `plans/2026-07-17-phase-4-lists-tables.md`.
  - [x] **Phase 5 P1 — Breadcrumbs and Pagination** — shipped: `Breadcrumbs`
        (item-array API, click-to-expand overflow collapse), `Pagination`
        (`pages`/`count`/`compact`/`dots`/`none` variants + page-size
        selector). Spec: `specs/phase-5-navigation-p1.md`. Plan:
        `plans/2026-07-15-phase-5-navigation-p1.md`.
  - [x] **Phase 5 P2 — SideNav, TopNav, MobileNav, AppShell, TabList** —
        shipped: `Resizable`/`ResizeHandle`/`useResizable` (pulled forward
        from Phase 6 for SideNav), `SideNav` (zones + collapse + resize),
        `TopNav` (+ Menu / MegaMenu), `MobileNav` (+ Toggle / Provider),
        minimal `AppShell` (pulled forward from P3), nav `TabList` /
        `TabList.Tab` / `TabList.Menu` kept **separate** from panel `Tabs`.
        Spec: `specs/phase-5-navigation-p2.md`. Plan:
        `plans/2026-07-17-phase-5-navigation-p2.md`.
  - [ ] **Phase 5 P3 — Outline, NavIcon/NavMenu** — shipped: `Outline`
        (in-page TOC + scroll-spy, docs shell parity); `NavIcon`/`NavMenu`
        deferred.
  - [x] **Phase 6 — layout polish and collapsible regions** — shipped:
        `Collapsible`/`CollapsibleGroup`; `Resizable` single-region (P5 P2);
        `Layout`/`LayoutContent`/`LayoutPanel`/`LayoutHeader`/`LayoutFooter`,
        multi-region `useResizable`, responsive panel modes, Astro static bindings.
        Spec: `docs/superpowers/specs/2026-07-29-phase-6-layout-design.md`.
  - [ ] Phase 7 — chat

## V7 — Typed theming & component overrides

- [x] **V7 — Recipe-shaped typed customization DX** — consumers restyle any
      component (`base`/`variants`/`compoundVariants`, full CSS properties,
      variant names typed from the recipe, zero class names) and mint custom
      mode-aware tokens, via an extended `createDesignTheme` config plus
      `overrideComponent`/`extendTokens` primitives. Revisits V3's "bulk
      override configs — out of scope" deferral and makes the config DX the
      primary customization surface (tiers 1–2 remain the substrate).
      Shipped: attribute-mode runtime + `overrides` layer; `extend` /
      `components` / `overrideComponent` / `customTheme`; docs under
      `/theming/customize`; Acme demo theme in `examples/vite-app`. Spec:
      `specs/typed-component-theming.md`. Plan:
      `plans/2026-07-17-v7-typed-theming.md`.

## V8 — Conditional component overrides

- [x] **V8 — Mode-aware override values + `conditions`** — `{ light, dark }`
      property values (→ `light-dark()`) for ambient/surface light/dark in
      overrides; `conditions` + `when` presets for reduced motion and complex
      blocks. TypeStyles 0.15+ (`conditions`, `colorModes`). Spec:
      `specs/conditional-component-overrides.md`.

## V9 — Token color migration to `light-dark()`

- [x] **V9 — Ambient + surface color tokens via `light-dark()`** — theme
      `colorMode` patches compile via TypeStyles **0.16+** (`colorMode: { light, dark }`
      on `createTheme`, mode-aware `extend` leaves). Global `color-scheme` on `:root`,
      theme surfaces, and `data-surface`. Shadow `modes` retained for non-color values.
      Spec: `specs/conditional-component-overrides.md` (TypeStyles: [#164](https://github.com/phthalo-dev/typestyles/pull/164)).

## Chat components

- [x] **Chat — "MVP + AI streaming essentials"** — `ChatLayout`,
      `ChatMessageList`, `ChatMessage`, `ChatMessageBubble`, `ChatComposer`/
      `ChatComposerInput`, `ChatSendButton`, `ChatToolCalls`,
      `ChatSystemMessage`, `ChatMessageMetadata`, plus `useChatStreamScroll`/
      `useChatNewMessages`. Shipped as its own initiative ahead of V6's
      Phase 2–6 ordering — see `specs/chat-components.md` for the scope
      decision. Deferred to a later PR: `ChatComposerDrawer`, mention/token
      composer input, `ChatDictationButton`, `ChatTokenizedText` (tracked
      under V6 Phase 7 in `specs/component-breadth.md`).

## Future (unscheduled)

- **`@var-ui/astro`** — Astro bindings (v0.1 docs/content kit shipped). Docs site
  DemoHost cutover is complete (framework cookie SSR, completeness gate green
  for all live MDX demos). Progressive interactivity (native HTML → Zag later)
  remains open. Spec: `docs/superpowers/specs/2026-07-18-var-ui-astro-design.md`.
  Docs site framework is Astro (Netlify adapter) under `docs/`.
- Per-recipe structured docs for human + AI-agent discovery (colocated
  `.doc.ts` files per component, a CLI or editor-integration delivery
  vehicle). Originally scoped as TypeStyles P5.8; moved here since it's about
  documenting var-ui's own components. Not yet speced in detail.
