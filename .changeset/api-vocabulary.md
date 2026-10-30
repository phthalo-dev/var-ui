---
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/core': minor
---

API contract, part 2: platform vocabulary. Breaking.

- **Booleans drop the `is` prefix:** `disabled`, `required`, `readOnly`, `invalid`, `open`/`defaultOpen`, `expanded`/`defaultExpanded`, `collapsed`/`defaultCollapsed`, `dismissable`, `loading`, `selected`, `nested`, `active`, `striped`, `scrollable`, `indeterminate`, `rowHeader`, `streaming`, `reversed`, `labelHidden`, `iconOnly`, `destructive`, `wheelDisabled`, `unavailable`. Checkbox and Switch use `checked` / `defaultChecked` / `indeterminate`. Core recipe axes `isScrollable` and `isStriped` are now `scrollable` and `striped`.
- **Events:** `onChange` is always the native DOM event (via `...rest`, or a capture handler on the root for Checkbox, Switch, RadioGroup, CheckboxGroup and Slider); parsed values arrive through `onValueChange` (`onCheckedChange` for Checkbox/Switch, `onSelectedChange` for toggle chips and buttons, `onValueCommit` on Slider). `onPress` is gone: use `onClick`. Select, Tabs, SegmentedControl, Tree selection, Pagination and the date/time fields have no native `onChange`.
- **Collections** use `value` / `defaultValue` / `onValueChange` (`string | null` for single, `string[]` with `multiple`/`selectionMode="multiple"`) and `{ value, label, disabled? }` options: Select, Combobox, Typeahead, MultiSelector, Tokenizer, SegmentedControl, ChipGroup, RadioGroup, CheckboxGroup, Tabs, TabList, Tree, Pagination, Accordion. `selectedKey(s)`, `Selection` and `Set` values are gone from the public API; Tree and CollapsibleGroup expansion uses `expanded` / `defaultExpanded` / `onExpandedChange(string[])`.
- **Renames:** Alert `variant` -> `tone`; `IconButton name` -> `icon`; `PinInput type` -> `characters`; Button `pending` -> `loading`; NumberInput/Slider/date fields `minValue`/`maxValue` -> `min`/`max`; date `isDateUnavailable` -> `unavailable`; `ResizeHandle onChange` -> `onValueChange`; `CollapsibleGroup allowsMultipleExpanded` -> `multiple`; `MobileNav` context `isOpen` -> `open` (and `open()` -> `show()`).
- **New:** `CommandPalette` and `AlertDialog` take `defaultOpen`; `CommandPalette` `onOpenChange(open, details)` with `details.cancel()`; Drawer is uncontrolled when `open` is omitted; `ChatComposerInput` takes a native `onChange`, its `ref` now points at the textarea; chat components pass native props through.
- `Pill.astro` is removed (it duplicated `Chip.astro`); `Pill` is a removable `Chip` in React only. `ChipGroup` is single-select unless `multiple`.
- A compiler-based test (`publicProps.test.ts`) fails if any exported component prop starts with `is`/`defaultIs` or uses `onPress*`, `selectedKey(s)` or `onSelectionChange`.
