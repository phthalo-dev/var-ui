---
'@var-ui/react': patch
---

Fix: pressing the trigger of a Menu, Select, Combobox or date picker to close it and pressing it again within about 80ms now reopens the popup. The trigger no longer ignores the second press.
