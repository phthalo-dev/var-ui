---
'@var-ui/react': minor
'@var-ui/core': minor
'@var-ui/astro': minor
---

Native `<dialog>` overlays (P6 part A). Breaking.

- **Dialog, AlertDialog, Drawer, MobileNav, the Layout panel overlay and CommandPalette now render a native `<dialog>` opened with `showModal()`**: native focus trap, inert background, top layer (no z-index), `::backdrop`, native focus return and Escape. react-aria's `Modal`/`ModalOverlay`/`Dialog` are gone from these components.
- **API.** `Popup` _is_ the `<dialog>` and accepts its native props; the `Backdrop` parts are removed (style `::backdrop` of the popup); `portalContainer` is removed everywhere (dialogs render in place; theme and token scope follow the DOM; note a `<button>` inside a dialog inside a `<form>` submits that form, and DOM events bubble through real ancestors). `dismissable` stays on Root and now also on MobileNav. Triggers must be button-like. `autoFocus` has no effect inside a native dialog on plain elements: use the native `autofocus` attribute.
- **Close reasons from native events:** `escape-key`, `outside-press`, `close-press`, `trigger-press`, `imperative`. `details.cancel()` vetoes opening and click-driven changes; Escape can be vetoed once per user activation (Chromium), after which a controlled `open=true` re-shows the dialog.
- **CSS.** Enter and exit use `@starting-style` with `allow-discrete` transitions; the `::backdrop` fades; scroll lock is a global `html:has(dialog:modal)` rule with `scrollbar-gutter: stable`. Recipes: `dialog`, `drawer`, `mobileNav` and `layoutPanel` have a single `popup` slot (plus `content` padding on dialog), `commandPalette`'s `root` is the dialog, and the `overlay` recipe is deleted. New helpers in `shared/overlayMotion`: `nativeEnterExit`, `nativeSlideFrom`, `nativeBackdrop`, `nativeDialogReset`.
- `MobileNav.astro` and the command palette use a native `<dialog>`; their DOM and script hooks changed accordingly.
- **Interim:** Select, Combobox, Menu, the date pickers and other react-aria popups render into the open dialog through a small internal shim until the popover migration lands.
- **Tests.** Real-Chromium browser tests (`*.browser.test.tsx`, vitest browser mode with Playwright) now run next to the jsdom tests; see AGENTS.md. CI installs Chromium (cached).
