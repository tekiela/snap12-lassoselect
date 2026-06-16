# Turtlestitch / Snap! Lasso Selection Tool (v3.0)

## Overview
This document details the functionality of the Lasso Selection extension built for the Snap! 11 (Morphic) engine. The extension patches `ScriptsMorph`, `HandMorph`, and `Morph` prototypes to introduce standard multi-selection capabilities to the workspace.

## Features

1. **Lasso Selection (`Drag`)**
   - Click and drag on an empty workspace background to draw a bounding box.
   - Releasing the mouse groups all intersecting stacks into a single draggable `LassoGroupMorph`.

2. **Alt-Drag Region Toggle**
   - Holding `Alt/Option` while drawing a lasso toggles selection states.
   - Unselected blocks touched by the lasso are added to the selection.
   - Currently selected blocks touched by the lasso are removed from the selection.

3. **Stack Selection Depth (`fullBounds`)**
   - The intersection algorithm evaluates the `fullBounds()` of blocks.
   - Lassoing any segment of a script stack (e.g., the bottom or middle block) successfully resolves the `topBlock()` and selects the entire intact stack.

4. **Alt-Click Modifiers**
   - Holding `Alt/Option` while clicking a script instantly toggles it in or out of the current active selection group.
   - Clicking a block mid-stack toggles the entire stack.

5. **Select All (`Cmd/Ctrl + A`)**
   - Selects all blocks and comments in the active workspace.
   - Falls back to standard text selection when the user is actively editing a text input field.

6. **Deletion (`Backspace` / `Delete`)**
   - Instantly destroys the active selection group without a confirmation dialogue.
   - Aborts execution if the active `World` has an active `textEdit` focus to prevent accidental block deletion while typing.

## Architecture Details

- **Event Routing Fix & Garbage Collection:** Includes a workaround for Morphic's `processMouseUp` event routing. Drag events released over child morphs (blocks) are forced to fire the background's `mouseClickLeft` sequence. Furthermore, an aggressive garbage collection sweep intercepts `mouseDownLeft` to instantly destroy any orphaned ghost-lasso render boxes caused by browser quirks swallowing mouse-up events.
- **Render Crash Prevention:** Bounding box logic enforces a minimum 10x10 initial extent to prevent Chromium's `CanvasRenderingContext2D.roundRect` from crashing and freezing the workspace when drawing near-zero dimensional bounds.
- **State Resiliency:** The extension identifies groups using prototype fingerprinting (`isLassoGroup = true`) rather than `constructor.name` or `instanceof` checks. This guarantees the selection engine functions correctly across script injections, serialized data loads, and live-reloads.
- **Graceful Degradation:** Existing prototype methods (`toXML`, `wantsDropOf`, `processMouseDown`) are wrapped to preserve default behavior when the lasso tool is inactive.
