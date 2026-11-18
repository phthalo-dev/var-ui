---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': minor
'@var-ui/docs-components': minor
'@var-ui/cli': patch
---

App header chrome: one calm, consistent header across docs pages.

- **core** `sideNav`: sections and items rendered outside a `SideNav` root (e.g. in a `MobileNav` drawer) get the default colours instead of the transparent `@property` initial values.
- **core** `topNav`: items are the 32px control height with a quieter hover than the selected pill, selected items are semibold, and a new `itemLabel` slot reserves the bold width so selecting never shifts neighbours. The bar drops its shadow for a `border.subtle` hairline.
- **core** `segmentedControl`: new `layout: 'icon'` (square segments), nested indicator radius (the focus ring matches it), hover colour on unselected segments, a hairline track and a lifted indicator in dark mode. `toggleButton({ segmented: true })` no longer uses a pill radius.
- **core** `searchInput`: new `collapseBelow` variant (`none | sm | md | lg | xl`, default `md`, was a fixed `xl`) for the command trigger, a hover fill, a single focus ring on the field, and an even inset around the shortcut key cap. The collapsed trigger is a quiet icon button.
- **core** `kbd`: a centred fixed-height key cap. `commandPalette`: new `footer` / `footerHint` slots; the search input hides the UA clear button.
- **react** `SegmentedControl` / `ColorModeToggle`: `layout` prop (`ColorModeToggle` uses `icon` for icon-only segments). `CommandPalette`: keyboard hints footer (`hints`, default on). `Menu.FromSections`: a section `defaultValue` makes it an independent single-choice group. `TopNavItem` renders the `itemLabel` slot.
- **astro** `SegmentedControl` is a radio group of native radios (one tab stop, arrow keys move and check, like React); new `layout`, `name`, `disabled` props and `setSegmentedControlValue` / `getSegmentedControlValue`. `ColorModeToggle` is built on it. `Menu` sections take `defaultValue` for per-section radio groups. `SearchInput` takes `collapseBelow` and shows `Ctrl K` off Apple platforms. `CommandPalette` renders its group headings with the recipe's `groupHeading` slot (was an unstyled `<h2>`) and a hints footer (`hints`). New `COLOR_MODE_CHANGE_EVENT`, `readColorModePreference` (unset = `system`).
- **docs** One shared header, `DocsTopBar` (with `DocsMobileMenu`), used by `DocsPage` and `DocsMarketingPage`: the same brand and links on every page, persisted across view transitions (no jump or cross-fade; the selected link moves on navigation). `DocsThemePicker` is replaced by `DocsAppearanceMenu` (colour mode + theme presets in one icon menu); the `themePicker` slot is gone and a `drawerTools` slot puts tools in the mobile drawer. The docs sidebar moves into the drawer below `md`.
- **docs-components** `FrameworkSwitcher` is the Astro `SegmentedControl` (radio group, icon layout) with `size` and `appearance` props.
