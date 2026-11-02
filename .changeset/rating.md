---
'@var-ui/react': minor
'@var-ui/core': minor
'@var-ui/astro': minor
'@var-ui/icons': minor
---

Add `Rating`: a star (or custom icon) rating built on a native radio group, so arrow keys, Home/End, Tab, `name`/`form`/`required`/`disabled` and form submission come from the browser. Props: `value`/`defaultValue`/`onValueChange`, native `onChange`, `max`, `readOnly` (a `role="img"` display that also accepts fractional values such as `3.5`), `clearable`, `size`, `tone`, `icon`/`emptyIcon`, `getItemLabel`, `getValueLabel`, and `label`/`description`/`errorMessage`. Hover preview is pure CSS and mirrors in RTL. New core `rating` recipe, a read-only `Rating.astro`, and a `star` glyph (`star` joins the semantic icon names).
