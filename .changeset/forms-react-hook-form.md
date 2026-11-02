---
'@var-ui/react': patch
---

Make the form libraries work with the fields. `register()` from react-hook-form now shows `defaultValues`, `setValue()` and `reset()` on `TextField`, `TextAreaField`, `PasswordInput`, `Checkbox` and `Switch` (uncontrolled fields keep the DOM as the source of truth). The browser's validation message is now shown by `TextField` and friends (and by the `Field` preset) inside a `Form`. `Select` types `onBlur`/`onFocus`, and `Slider` forwards `onBlur`/`onFocus`. New guide: Forms.
