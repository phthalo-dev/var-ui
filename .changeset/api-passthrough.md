---
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/core': minor
---

API contract, part 1: native passthrough, refs and shared field plumbing.

- Components accept and spread their element's native props (`id`, `data-*`, `aria-*`, `style`, handlers) and merge `className`; this covers the display, data, navigation, button, overlay-part and field components in React and the matching Astro components. Overlay triggers and `Close` merge onto their child.
- Field components render label/description/error through shared `FieldFrame`/`RacFieldFrame`; `errorMessage` implies invalid, ids are wired into `aria-describedby`. `ref` now points at the native control (`<input>`, `<button>`, …) where one exists; date/time fields use the segmented input, and Slider/PinInput/InputGroup/EditableText the nearest real element.
- `Button` takes `href` and renders an anchor. New `Toolbar.astro`. `ResizeHandle.astro` takes `aria-label` instead of `label`.
- User-visible default strings are overridable props (Pagination takes a `labels` object). Heading levels are overridable on Accordion, Collapsible, Card, Section and EmptyState.
- `Menu.Popup` takes `placement`, `Menu.Item` takes `textValue`, menu presets compose the same root (presence, layer, `portalContainer`), `MenuContent` no longer nests a second menu.
- `FileInput` puts dropped files into the native input so `FormData` sees them; `Field` accepts `name` and shows `<Form errors>`; one shared calendar body backs the date fields; `SearchInput` drops the unsupported `variant="command"` type in React; `Toc` drops `hideBelowXl` (the rail already hides below `xl`).
- Inline style objects in Accordion, Collapsible, Table, Tree, List, SideNav, TopNav and Layout moved into recipes.
