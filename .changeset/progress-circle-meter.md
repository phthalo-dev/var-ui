---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Add `ProgressCircle` and `Meter`. `ProgressCircle` is a circular progress indicator (determinate or indeterminate) on react-aria's ProgressBar, with `value`, `min`, `max`, `label`, `valueLabel`, `size`, `tone`, `appearance` and centered `children`; the arc follows `--var-ui-progress-circle-progress`. `Meter` shows a measurement within a range with the `<meter>` attributes `value`, `min`, `max`, `low`, `high` and `optimum`, deriving a success, warning or danger tone like browsers do (overridable with `tone`). Core adds the `progressCircle` and `meter` recipes and `getMeterTone`; both components have Astro peers.
