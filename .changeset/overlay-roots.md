---
'@var-ui/react': minor
'@var-ui/core': minor
---

API contract, part 3: one shape for every overlay. Breaking.

- **Shared root hook.** `useOverlayRoot` (with `OverlayTrigger`, `useHoverIntent`, one cleanup-aware `useMergedRef`, `createOverlayContext`) replaces six near-identical copies of the open-state, close-reason, presence and trigger wiring in Dialog, Popover, Tooltip, HoverCard, Menu, Drawer, MobileNav, CommandPalette, TopNavMegaMenu and the Layout panel. The `display: contents` wrapper divs that existed only to catch keydown are gone; the close `reason` now comes from native listeners (`escape-key`, `outside-press`, `trigger-press`, `close-press`, `focus`, `hover`, `imperative`) and `details.cancel()` vetoes a change. A request equal to the current `open` is dropped, so Escape during an exit animation no longer fires a second `onOpenChange(false)`.
- **Uniform API.** Every overlay Root takes `open`, `defaultOpen` and `onOpenChange(open, details)` (now also MobileNav, TopNavMegaMenu, the Layout panel and CommandPalette); `portalContainer` and `dismissable` are Root-only; parts are `Trigger`, `Backdrop`, `Popup`, `Close`, `Title`, `Description` where the concept exists.
- **Removed.** `SimpleDialog`, `SimplePopover`, `SimpleTooltip`, and the assembled `AlertDialog`, `HoverCard` and `Drawer` presets (now documented recipes built from the compound parts); `Drawer.Panel` is `Drawer.Popup` and Drawer gains `Trigger`.
- **Also.** Menu presets and `Menu.Popup` share the hook (a click on the trigger no longer counts as an outside press); MobileNav and the Layout panel now animate out; one tone-to-icon map and one default toast duration; `toast()` without a provider warns once in development, and changing `maxVisibleToasts` keeps existing toasts; `LoadingOverlay` sets `aria-busy` on its root and makes the covered content `inert` (new `content` slot in the core recipe).
