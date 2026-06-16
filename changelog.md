## 📝 Changelog

### v3.0
* ✅ **NEW: Alt-Drag Region Toggle** — Hold `Alt` while drawing a lasso to dynamically add unselected blocks and subtract selected blocks.
* ✅ **NEW: Deep Stack Selection** — Bounding box logic now uses `fullBounds()`, meaning lassoing any part of a stack selects the entire script.
* 🐛 **FIX:** Alt-clicking mid-stack no longer rips the script apart. It now correctly resolves the `topBlock()` and toggles the whole stack.
* 🐛 **FIX:** Prevented Chromium `RangeError` rendering crashes (and UI freezing) on initial drag by safely initializing bounding boxes at `10x10`.
* 🐛 **FIX:** Implemented aggressive garbage collection on `mouseDownLeft` to permanently eradicate orphaned "ghost lasso" bounding boxes caused by edge-case browser event swallowing.
* 🛠️ **ARCH:** Replaced volatile `constructor` checks with prototype fingerprinting (`isLassoGroup`) for 100% live-reload resiliency.

### v2.0
* ✅ **NEW: Select All** — `Cmd+A` / `Ctrl+A` selects every block and comment in the workspace.
* 🐛 **FIX:** Blocks no longer disappear immediately after a lasso drag selection (regression fix).
* 🔑 **IMPROVED:** Keyboard detection updated to use modern `event.key` instead of deprecated `event.keyCode`.

### v1.0
* Initial release: rectangle lasso select, Alt-click toggle, group drag, duplicate, delete.
