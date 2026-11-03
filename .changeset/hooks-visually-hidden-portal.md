---
'@var-ui/react': minor
'@var-ui/astro': minor
---

Add a small set of general-purpose hooks and two utilities. Hooks: `useDisclosure` (`{ open, setOpen, show, hide, toggle }`, shaped for `<Dialog open onOpenChange>`), `useControllableState`, `useDebouncedValue`, `useDebouncedCallback` (with `cancel` and `flush`), `useClickOutside` (capture-phase pointer events, ref or refs) and `useHotkeys` (`mod+k` style combos, platform-aware `mod`, ignores text inputs by default). `useHotkeys` is generalised from the `CommandPalette` hotkey parser, which now runs on top of it. Components: `VisuallyHidden` (a `<span>` using the existing recipe; `Spinner` now uses it; Astro peer included) and `Portal` (renders into `document.body` or a `container`; renders nothing on the server). New docs: a Hooks reference covering every public hook, and pages for VisuallyHidden and Portal.
