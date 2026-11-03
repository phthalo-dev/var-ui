---
'@var-ui/react': patch
---

Fix Escape closing a modal `Dialog` together with a `Popover` inside it. When the popover was opened without a user activation (a timer, a controlled `open`, `showPopover()`), Chromium grouped its close watcher with the dialog's, so one Escape also fired the dialog's `cancel`. The dialog now keeps itself open when the Escape already closed a nested popover or dialog.
