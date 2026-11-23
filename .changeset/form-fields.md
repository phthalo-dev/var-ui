---
'@var-ui/core': minor
'@var-ui/react': minor
---

Form field gaps from real apps:

- **TextAreaField `autosize`** with `minRows` / `maxRows`: platform `field-sizing: content`, heights in `lh` plus padding (core: `autosize` variant, `minRows` / `maxRows` vars).
- **Required marker:** every field label shows ` *` when the field is required, as CSS from the shared field chrome. It's excluded from the accessible name (empty alt text), since `aria-required` already says it.
- **`label`, `description` and `errorMessage` accept nodes** on every field (`FieldMeta`), like `Typeahead`. New `labelText()` for code that needs the label as a string.
- **`NumberInput.onValueChange`** documents that it fires on commit (blur, Enter, steppers), not per keystroke. Use the native `onChange` for live dirty tracking.
