---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Every form control takes the shared `size` axis (`sm` / `md` / `lg`, default `md`).

- New `size` variant and React prop on `TextAreaField`, `MultiSelector`, `Tokenizer`, `DateInput`, `DateRangeInput`, `DateTimeInput`, `TimeInput`, `FileInput`, `Checkbox`, `Switch`, `RadioGroup`, `CheckboxGroup`, `Slider` and `ColorPicker`. Like `TextField`, the size resolves as `size`, then the surrounding control size (`InputGroup`, `Toolbar`, `Select.Root`, `Combobox.Root`), then `md`. Text-entry controls match `TextField` at each size; checkbox, radio and switch scale the indicator, label type and gap; group sizes apply to every option; `Slider` scales the track and thumb; `ColorPicker` scales the panel, rails, thumbs and swatches (`ColorInput` opens its picker at its own size).
- `Button` and `IconButton` now inherit the surrounding control size instead of always defaulting to `md`. A button inside an `InputGroup`, `Toolbar` or compound root matches it unless it sets `size`.
- `Toolbar` provides its `size` to the controls inside it, and falls back to the surrounding control size.
- Breaking: the `size.indicator` tokens are per size: `size.indicator.box.{sm,md,lg}`, `dot.{sm,md,lg}`, `trackWidth.{sm,md,lg}`, `trackHeight.{sm,md,lg}` (CSS `--var-ui-size-indicator-box-md`, ...). The switch geometry moved to recipe variables (`--var-ui-switch-trackwidth`, `--var-ui-switch-trackheight`, `--var-ui-switch-thumbsize`).
- Breaking: `StatusDot` uses the shared surface appearance axis: `appearance` is `solid` / `subtle` / `outline` (default `solid`). `filled` is now `solid`.
- Breaking: the size styles key on `data-size`, so plain-CSS markup for these controls needs `data-size` on each slot (the recipes and components set it).
