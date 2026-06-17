# Turtlestitch / Snap! 12 Lasso Selection Tool

An intuitive rectangle lasso multi-selection tool, Alt-click toggle selection, Select All shortcut, and Backspace/Delete keyboard shortcut manager for Turtlestitch and Snap! 12 (Morphic) workspaces.

This tool works on both **local** Snap! instances and the official editors at **`https://turtlestitch.org`** and **`https://snap.berkeley.edu`**.

![Lasso Selection Banner](https://img.shields.io/badge/Snap!-Lasso%20Selection-brightgreen?style=for-the-badge&logo=javascript)
![Version](https://img.shields.io/badge/version-3.0-blue?style=for-the-badge)

---

## ✨ Features
* **Lasso Selection:** Click and drag to draw a bright green-blueish bounding box. Releasing the mouse groups all blocks.
* **Click Anywhere:** Lassoing *any* part of the block group selects the entire stack.
* **Alt-Drag Region Toggle:** Hold `Alt` while dragging a lasso to instantly toggle regions: it adds unselected blocks to your group and subtracts already-selected blocks!
* **Alt-Click:** Press and hold `Alt` (or `Option` on macOS) while clicking any block to add it to, or remove it from, the active selection. Clicking a block mid-stack toggles the whole stack.
* **Select All:** Press `Cmd+A` (macOS) or `Ctrl+A` (Windows/Linux) to instantly select every block in the workspace. Falls back to normal text select-all when editing a block input.
* **Instant Deletion:** Press `Backspace` or `Delete` keys to instantly delete the entire selected group.
* **Deep Duplication:** Right-click a selected group to access the custom context menu and duplicate the selection.

---

## 🚀 Installation & Loading Methods

Choose the loading format that best fits your workflow:

### Method 1: Portable XML Library (Recommended for Safari & Firefox)
This runs 100% offline, bypasses browser bookmark URL length limits, and works across all browsers.
1. Download [libraries/lasso_selection.xml](libraries/lasso_selection.xml).
2. Open any Snap! editor window.
3. Drag and drop the `.xml` file into the editor (or import it via **File -> Import...**).
4. Open the Snap! **Settings** menu (gear icon) and make sure **Enable JavaScript extensions** is **checked**.
5. Find the new block **`[enable lasso selection]`** under the **Control** category palette and click it once.

---

### Method 2: Bookmarklet (Zero-Install)
Bookmarklets run JavaScript directly in your active tab.

#### Option A — CDN Loader *(always up to date, requires internet)*
1. Create a new bookmark in your browser named **Snap! Lasso Tool**.
2. Replace the URL with this code:
   ```javascript
   javascript:(function(){var targetWin=window;try{for(var i=0;i<window.frames.length;i++){if(window.frames[i].ScriptsMorph){targetWin=window.frames[i];break;}}}catch(e){}var s=targetWin.document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/tekiela/snap12-lassoselect@main/extensions/lasso_selection/inject.js?v=' + Date.now();targetWin.document.body.appendChild(s);})();
   ```
3. Open a Snap! editor page and click the bookmark to activate.

#### Option B — Self-contained offline bookmarklet *(no internet needed)*
The entire extension is pre-minified into a single URL-safe string in [minified_bookmarklet.txt](minified_bookmarklet.txt).
1. Open [minified_bookmarklet.txt](https://raw.githubusercontent.com/tekiela/snap12-lassoselect/main/minified_bookmarklet.txt) — you will see one long line of text.
2. Select all and copy it.
3. Create a new bookmark named **Snap! Lasso v3 (offline)** and paste it into the URL field.
4. Open a Snap! editor page and click the bookmark to activate.

---

### Method 3: Browser Extension (Persistent & Automatic)
Loads the lasso tool automatically on every Snap! tab you open.

#### For Chrome / Chromium Browsers:
1. Download or clone this repository to your computer.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** (top-left) and select the `extensions/lasso_selection` directory.

#### For Firefox:
1. Open Firefox and go to `about:debugging`.
2. Click **This Firefox** -> **Load Temporary Add-on...**
3. Select `manifest.json` inside the `extensions/lasso_selection` folder.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+A` / `Ctrl+A` | Select all blocks and comments in the workspace |
| `Backspace` / `Delete` | Delete the active selection |
| `Alt` + Click | Toggle a block or comment in/out of the selection |

---

## 🛠️ Technology Stack
* **Language:** Vanilla JavaScript (ES5 compatible for wide Morphic engine support).
* **UI Overlays:** HTML5 Canvas extensions & dynamic CSS-in-JS toast notifications.

---

## 📝 Changelog

See the full history of updates and fixes in [CHANGELOG.md](CHANGELOG.md).
