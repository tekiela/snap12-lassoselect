# Snap! Workspace Lasso Selection Tool

An intuitive rectangle lasso multi-selection tool, Alt-click toggle selection, and Backspace/Delete keyboard shortcut manager for Snap! (Morphic) workspaces. 

This tool works on both **local** Snap! instances and the official online editor at **`https://snap.berkeley.edu/snap/snap.html`**.

![Lasso Selection Banner](https://img.shields.io/badge/Snap!-Lasso%20Selection-brightgreen?style=for-the-badge&logo=javascript)

---

## ✨ Features
* **Lasso Selection:** Click and drag on any empty workspace background to draw a bright green-blueish bounding box. Releasing the mouse groups all intersecting blocks and comments.
* **Premium Styling:** Displays selection feedback via standard active block glow highlights and comment borders. Bounding boxes are borderless/transparent when inactive (no leftovers).
* **Alt-Click Modifiers:** Press and hold `Alt` (or `Option` on macOS) while clicking any block or comment to add it to, or remove it from, the active selection.
* **Instant Deletion:** Press `Backspace` or `Delete` keys to instantly delete the entire selected group without dialog confirmation pop-ups (safely ignored when editing text).
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

### Method 2: Short Bookmarklet Loader (Zero-Install)
Bookmarklets run JavaScript directly in your active tab. This loader fetches the script dynamically, works on all browsers (including Safari and Firefox) without length truncation, and automatically gets updates when you push commits to GitHub:

1. Create a new bookmark in your browser named **Snap! Lasso Tool**.   
2. Edit the bookmark and paste the following code into the **URL / Location** field:
   ```javascript
   javascript:(function(){var%20s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/tekiela/snap12-lassoselect@main/extensions/lasso_selection/inject.js';document.body.appendChild(s);})();
3. Open a Snap! editor page (e.g. https://snap.berkeley.edu/snap/snap.html) and click the bookmark to activate the tool.
(Alternatively, if you want the fully offline/self-contained version that doesn't load code from GitHub, you can copy the raw text from 
minified_bookmarklet.txt and use that as the bookmark URL).   
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

## 🛠️ Technology Stack
* **Language:** Vanilla JavaScript (ES5 compatible for wide Morphic engine support).
* **UI Overlays:** HTML5 Canvas extensions & dynamic CSS-in-JS toast notifications.
